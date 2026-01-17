import type { AuthError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AUTH_HOME, DASHBOARD, VERIFY_EMAIL } from "../../helpers/getters";
import { useAppDispatch } from "../../hooks/redux";
import {
  clearAuth,
  setAuthData,
  setAuthError,
  setLoading,
  updateProfile,
} from "../../store/authSlice";
import type { ApiError, LoginPayload, SignUpPayload } from "../../types/auth";
import { ProfileService } from "../profile/profile.service";
import { authKeys } from "../query-key-factory";
import { AuthService } from "./auth.service";

/**
 * Singleton instance of AuthService
 */
const profileService = new ProfileService();
const authService = new AuthService();

/**
 * Helper function to handle Supabase errors
 */
export const handleSupabaseError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "message" in error) {
    const err = error as AuthError;
    return {
      message: authService.getErrorMessage(err),
      code: err.code,
      status: err.status,
    };
  }
  return {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  };
};

/**
 * Hook: Sign up a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ user }: { user: SignUpPayload }) => {
      const authResponse = await authService.signUp({
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });

      if (authResponse.error) throw authResponse.error;

      // Check if email confirmation is required
      if (authService.requiresEmailConfirmation(authResponse)) {
        return {
          requiresEmailConfirmation: true,
          user: authResponse.user,
          session: null,
          profile: null,
        };
      }

      // Fetch user profile
      const { data: profile, error: profileError } =
        await profileService.getCurrentUserProfile();

      if (profileError) {
        console.warn("Profile fetch after sign-up failed:", profileError);
      }

      return {
        session: authResponse.session,
        user: authResponse.user,
        profile: profile || null,
        requiresEmailConfirmation: false,
      };
    },
    onSuccess: (data, variables) => {
      if (data.requiresEmailConfirmation) {
        navigate(VERIFY_EMAIL, {
          state: { email: variables.user.email },
        });
        return;
      }

      if (data.session) {
        dispatch(
          setAuthData({
            session: data.session,
            profile: data.profile || undefined,
          }),
        );

        queryClient.invalidateQueries({
          queryKey: authKeys.createUser(),
        });

        navigate(data.profile?.is_onboarded ? DASHBOARD : "/explore");
      }
    },
    onError: (error: unknown) => {
      dispatch(setAuthError());
      const apiError = handleSupabaseError(error);
      console.error("Sign up error:", apiError);
      throw apiError;
    },
  });
};

/**
 * Hook: Login user
 */
export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ user }: { user: LoginPayload }) => {
      const authResponse = await authService.signIn({
        email: user.email,
        password: user.password,
      });

      if (authResponse.error) throw authResponse.error;
      if (!authResponse.session) throw new Error("No session returned");

      // Fetch user profile
      const { data: profile, error: profileError } =
        await profileService.getCurrentUserProfile();

      if (profileError) {
        console.warn("Profile fetch after login failed:", profileError);
      }

      return {
        session: authResponse.session,
        user: authResponse.user,
        profile: profile || null,
      };
    },
    onSuccess: (data) => {
      dispatch(
        setAuthData({
          session: data.session,
          profile: data.profile || undefined,
        }),
      );

      queryClient.invalidateQueries({
        queryKey: authKeys.loginUser(),
      });

      navigate(data.profile?.is_onboarded ? DASHBOARD : "/onboarding");
    },
    onError: (error: unknown) => {
      dispatch(setAuthError());
      const apiError = handleSupabaseError(error);
      console.error("Login error:", apiError);
      throw apiError;
    },
  });
};

/**
 * Hook: Update user password
 */
export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { user, error } = await authService.updatePassword(newPassword);

      if (error) throw error;
      if (!user) throw new Error("Failed to update password");

      return { user };
    },
    onSuccess: (data) => {
      dispatch(updateProfile(data.user));

      queryClient.invalidateQueries({
        queryKey: authKeys.updateUserPassword(),
      });

      navigate(DASHBOARD);
    },
    onError: (error: unknown) => {
      const apiError = handleSupabaseError(error);
      console.error("Password update error:", apiError);
      throw apiError;
    },
  });
};

/**
 * Hook: Send password reset email
 */
export const useSendPasswordResetEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await authService.sendPasswordResetEmail(email);

      if (error) throw error;

      return { success: true, message: "Password reset email sent" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.sendOTPMail(),
      });
    },
    onError: (error: unknown) => {
      const apiError = handleSupabaseError(error);
      console.error("Password reset error:", apiError);
      throw apiError;
    },
  });
};

/**
 * Hook: Resend confirmation email
 */
export const useResendConfirmationEmail = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await authService.resendConfirmation(email);

      if (error) throw error;

      return { success: true, message: "Confirmation email resent" };
    },
    onError: (error: unknown) => {
      const apiError = handleSupabaseError(error);
      console.error("Resend confirmation error:", apiError);
      throw apiError;
    },
  });
};

/**
 * Hook: Get current session
 */
export const useCurrentSession = (options?: { enabled?: boolean }) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const { session, error } = await authService.getSession();

      if (error) throw error;
      if (!session) throw new Error("No active session");

      // Get user profile
      const { data: profile } = await profileService.getCurrentUserProfile();

      // Update Redux store
      dispatch(
        setAuthData({
          session,
          profile: profile || undefined,
        }),
      );

      return { session, profile };
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook: Refresh session
 */
export const useRefreshSession = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { session, error } = await authService.refreshSession();

      if (error) throw error;
      if (!session) throw new Error("Failed to refresh session");

      // Get updated profile
      const { data: profile } = await profileService.getCurrentUserProfile();

      return { session, profile };
    },
    onSuccess: (data) => {
      dispatch(
        setAuthData({
          session: data.session,
          profile: data.profile || undefined,
        }),
      );

      queryClient.invalidateQueries({
        queryKey: authKeys.all,
      });
    },
    onError: (error: unknown) => {
      dispatch(clearAuth());
      const apiError = handleSupabaseError(error);
      console.error("Session refresh error:", apiError);
      throw apiError;
    },
  });
};

/**
 * Hook: Logout user
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authService.signOut();
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      dispatch(clearAuth());
      queryClient.clear();
      navigate(AUTH_HOME);
    },
    onError: (error: unknown) => {
      // Even on error, clear local state
      dispatch(clearAuth());
      queryClient.clear();
      navigate(AUTH_HOME);

      const apiError = handleSupabaseError(error);
      console.error("Logout error:", apiError);
    },
  });
};

/**
 * Hook: OAuth sign in with Google
 */
export const useOAuthSignIn = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(setLoading(true));

      const result = await authService.signInWithGoogle();

      if (result.error) throw result.error;

      // OAuth redirects to provider, no immediate session
      return result.data;
    },
    onError: (error: unknown) => {
      const apiError = handleSupabaseError(error);
      console.error("OAuth error:", apiError);
      throw apiError;
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};
