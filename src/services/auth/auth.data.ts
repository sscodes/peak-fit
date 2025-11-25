import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AUTH_HOME, DASHBOARD, VERIFY_EMAIL } from '../../helpers/getters';
import { useAppDispatch } from '../../hooks/redux';
import { supabaseAuth } from '../../lib/supabaseAuth';
import { supabaseProfile, type ProfileData } from '../../lib/supabaseProfile';
import {
  clearAuth,
  setAuthData,
  setAuthError,
  setLoading,
  updateProfile as updateProfileState,
} from '../../store/authSlice';
import type { ApiError, LoginPayload, SignUpPayload } from '../../types/auth';
import { authKeys } from '../query-key-factory';

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any): ApiError => {
  if (error?.message) {
    return {
      message: supabaseAuth.getErrorMessage(error),
      code: error.code,
      status: error.status,
    };
  }
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

// Sign Up Hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ user }: { user: SignUpPayload }) => {
      dispatch(setLoading(true));

      const { session, error } = await supabaseAuth.signUp({
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });

      if (error) throw error;

      // If email confirmation is required, session will be null
      if (!session) {
        return {
          requiresEmailConfirmation: true,
          user: null,
          session: null,
        };
      }

      // Get or create profile
      const { data: profile, error: profileError } =
        await supabaseProfile.getCurrentUserProfile();

      if (profileError) {
        console.warn('Profile fetch after sign-up failed:', profileError);
        // Profile might not exist yet due to trigger delay, this is not critical
      }

      return {
        session,
        profile: profile || null, // Changed to ensure null instead of undefined
        requiresEmailConfirmation: false,
      };
    },
    onSuccess: (data, variables) => {
      if (data.requiresEmailConfirmation) {
        // Navigate to email confirmation page
        navigate(VERIFY_EMAIL, {
          state: { email: variables.user.email },
        });
      } else if (data.session) {
        // Set auth data in Redux
        dispatch(
          setAuthData({
            session: data.session,
            profile: data.profile || undefined,
          })
        );

        queryClient.invalidateQueries({
          queryKey: authKeys.createUser(),
        });

        // Navigate to onboarding or home
        if (!data.profile?.onboarding_completed) {
          navigate('/explore');
        } else {
          navigate(DASHBOARD);
        }
      }
    },
    onError: (error: any) => {
      dispatch(setAuthError());
      const apiError = handleSupabaseError(error);
      console.error('Sign up error:', apiError);
      throw apiError;
    },
    onSettled: () => {
      // Always clear loading state regardless of outcome
      dispatch(setLoading(false));
    },
  });
};

// Login Hook
export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ user }: { user: LoginPayload }) => {
      dispatch(setLoading(true));

      const { session, error } = await supabaseAuth.signIn({
        email: user.email,
        password: user.password,
      });

      if (error) throw error;
      if (!session) throw new Error('No session returned');

      // Get user profile
      const { data: profile, error: profileError } =
        await supabaseProfile.getCurrentUserProfile();

      if (profileError) {
        console.warn('Profile fetch after login failed:', profileError);
        // Continue with login even if profile fetch fails
      }

      return { session, profile: profile || null };
    },
    onSuccess: (data) => {
      // Set auth data in Redux
      dispatch(
        setAuthData({
          session: data.session,
          profile: data.profile || undefined,
        })
      );

      queryClient.invalidateQueries({
        queryKey: authKeys.loginUser(),
      });

      // Navigate based on onboarding status
      if (!data.profile?.onboarding_completed) {
        navigate('/onboarding');
      } else {
        navigate(DASHBOARD);
      }
    },
    onError: (error: any) => {
      dispatch(setAuthError());
      const apiError = handleSupabaseError(error);
      console.error('Login error:', apiError);
      throw apiError;
    },
    onSettled: () => {
      // Always clear loading state regardless of outcome
      dispatch(setLoading(false));
    },
  });
};

// Update Password Hook
export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { user, error } = await supabaseAuth.updatePassword(newPassword);

      if (error) throw error;
      if (!user) throw new Error('Failed to update password');

      return { user };
    },
    onSuccess: (data) => {
      // Update user in Redux
      dispatch(updateProfileState(data.user));

      queryClient.invalidateQueries({
        queryKey: authKeys.updateUserPassword(),
      });

      navigate(DASHBOARD);
    },
    onError: (error: any) => {
      const apiError = handleSupabaseError(error);
      console.error('Password update error:', apiError);
      throw apiError;
    },
  });
};

// Reset Password Hook (Send Reset Email)
export const useSendPasswordResetEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabaseAuth.sendPasswordResetEmail(email);

      if (error) throw error;

      return { success: true, message: 'Password reset email sent' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.sendOTPMail(),
      });
    },
    onError: (error: any) => {
      const apiError = handleSupabaseError(error);
      console.error('Password reset error:', apiError);
      throw apiError;
    },
  });
};

// Resend Confirmation Email Hook
export const useResendConfirmationEmail = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabaseAuth.resendConfirmation(email);

      if (error) throw error;

      return { success: true, message: 'Confirmation email resent' };
    },
    onError: (error: any) => {
      const apiError = handleSupabaseError(error);
      console.error('Resend confirmation error:', apiError);
      throw apiError;
    },
  });
};

// Get Current Session Hook
export const useCurrentSession = (options?: { enabled?: boolean }) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const { session, error } = await supabaseAuth.getSession();

      if (error) throw error;
      if (!session) throw new Error('No active session');

      // Get user profile
      const { data: profile } = await supabaseProfile.getCurrentUserProfile();

      // Update Redux store
      dispatch(
        setAuthData({
          session,
          profile: profile || undefined,
        })
      );

      return { session, profile };
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Refresh Session Hook
export const useRefreshSession = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { session, error } = await supabaseAuth.refreshSession();

      if (error) throw error;
      if (!session) throw new Error('Failed to refresh session');

      // Get updated profile
      const { data: profile } = await supabaseProfile.getCurrentUserProfile();

      return { session, profile };
    },
    onSuccess: (data) => {
      // Update Redux store
      dispatch(
        setAuthData({
          session: data.session,
          profile: (data.profile as ProfileData) || undefined,
        })
      );

      // Invalidate all auth queries
      queryClient.invalidateQueries({
        queryKey: authKeys.all,
      });
    },
    onError: (error: any) => {
      // If refresh fails, clear auth
      dispatch(clearAuth());
      const apiError = handleSupabaseError(error);
      console.error('Session refresh error:', apiError);
      throw apiError;
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabaseAuth.signOut();
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      // Clear Redux store
      dispatch(clearAuth());

      // Clear React Query cache
      queryClient.clear();

      // Navigate to auth home
      navigate(AUTH_HOME);
    },
    onError: (error: any) => {
      // Even on error, clear local state
      dispatch(clearAuth());
      queryClient.clear();
      navigate(AUTH_HOME);

      const apiError = handleSupabaseError(error);
      console.error('Logout error:', apiError);
    },
  });
};

// Update Profile Hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<ProfileData>;
    }) => {
      const { data, error } = await supabaseProfile.updateProfile(
        userId,
        updates
      );

      if (error) throw error;
      if (!data) throw new Error('Failed to update profile');

      return data;
    },
    onSuccess: (data) => {
      // Update profile in Redux
      dispatch(updateProfileState(data));

      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: ['profile', data.id],
      });
    },
    onError: (error: any) => {
      const apiError = handleSupabaseError(error);
      console.error('Profile update error:', apiError);
      throw apiError;
    },
  });
};

// Complete Onboarding Hook
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data, error } = await supabaseProfile.completeOnboarding(userId);

      if (error) throw error;
      if (!data) throw new Error('Failed to complete onboarding');

      return data;
    },
    onSuccess: (data) => {
      // Update profile in Redux
      dispatch(updateProfileState({ onboarding_completed: true }));

      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: ['profile', data.id],
      });

      // Navigate to home
      navigate(DASHBOARD);
    },
    onError: (error: any) => {
      const apiError = handleSupabaseError(error);
      console.error('Onboarding completion error:', apiError);
      throw apiError;
    },
  });
};

// Upload Avatar Hook
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const { url, error } = await supabaseProfile.uploadAvatar(userId, file);

      if (error) throw error;
      if (!url) throw new Error('Failed to upload avatar');

      return { avatar_url: url };
    },
    onSuccess: (data, variables) => {
      // Update profile in Redux
      dispatch(updateProfileState({ avatar_url: data.avatar_url }));

      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: ['profile', variables.userId],
      });
    },
    onError: (error: any) => {
      const apiError = handleSupabaseError(error);
      console.error('Avatar upload error:', apiError);
      throw apiError;
    },
  });
};

// src/services/auth/auth.data.ts
// Add this new hook:

export const useOAuthSignIn = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(setLoading(true));

      let result = await supabaseAuth.signInWithGoogle();

      if (result.error) throw result.error;

      // OAuth redirects to provider, no immediate session
      return result.data;
    },
    onError: (error: any) => {
      dispatch(setLoading(false));
      const apiError = handleSupabaseError(error);
      console.error('OAuth error:', apiError);
      throw apiError;
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};
