import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { FORGOT_PASSWORD } from "../../../../helpers/getters";
import { notifyError } from "../../../../helpers/helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { AuthService } from "../../../../services/auth/auth.service";
import { ProfileService } from "../../../../services/profile/profile.service";
import {
  clearAuth,
  initializeAuth,
  selectIsInitialized,
  setAuthData,
  setInitialized,
} from "../../../../store/authSlice";
import type { Profile } from "../../../../types/profile";
import classes from "./AuthInitializer.module.css";

interface AuthInitializerProps {
  children: ReactNode;
}

/**
 * Service instances
 */
const profileService = new ProfileService();
const authService = new AuthService();

const AuthInitializer: FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let authListener: { unsubscribe: () => void } | null = null;

    const initializeAuthState = async () => {
      try {
        // First check if this is a recovery/magic link flow
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const type = hashParams.get("type");
        const accessToken = hashParams.get("access_token");

        // If it's a recovery link, let the reset-password page handle it
        if (type === "recovery" && accessToken) {
          console.log("Password recovery link detected, skipping auto-auth");
          // Don't initialize auth, let the reset-password page handle it
          dispatch(setInitialized(true));
          setIsLoading(false);
          return;
        }

        // Check for existing session (normal flow)
        const { session, error } = await authService.getSession();

        if (error) {
          console.error("Auth initialization error:", error);
          dispatch(setInitialized(true));
          return;
        }

        if (session) {
          // We have a valid session, get the user profile
          const { data: profile } =
            await profileService.getCurrentUserProfile();

          if (isMountedRef.current) {
            dispatch(
              initializeAuth({
                session,
                profile: (profile as Profile) || null,
              }),
            );
          }
        } else {
          // No session found
          if (isMountedRef.current) {
            dispatch(setInitialized(true));
          }
        }

        // Set up auth state change listener
        authListener = authService.onAuthStateChange(
          async (event: AuthChangeEvent, session: Session | null) => {
            if (!isMountedRef.current) return;

            switch (event) {
              case "SIGNED_IN":
                if (session) {
                  // Get user profile when signed in
                  const { data: profile } =
                    await profileService.getCurrentUserProfile();
                  dispatch(
                    setAuthData({
                      session,
                      profile: (profile as Profile) || undefined,
                    }),
                  );
                }
                break;

              case "SIGNED_OUT":
                dispatch(clearAuth());
                break;

              case "TOKEN_REFRESHED":
                if (session) {
                  // Update session with new tokens
                  const { data: profile } =
                    await profileService.getCurrentUserProfile();
                  dispatch(
                    setAuthData({
                      session,
                      profile: (profile as Profile) || undefined,
                    }),
                  );
                }
                break;

              case "USER_UPDATED":
                if (session) {
                  // User data was updated (e.g., email change)
                  const { data: profile } =
                    await profileService.getCurrentUserProfile();
                  dispatch(
                    setAuthData({
                      session,
                      profile: (profile as Profile) || undefined,
                    }),
                  );
                }
                break;

              default:
                break;
            }
          },
        );
      } catch (error: unknown) {
        console.error("Failed to initialize auth:", error);
        if (isMountedRef.current) {
          dispatch(setInitialized(true));
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Only initialize if not already initialized
    if (!isInitialized) {
      initializeAuthState();
    } else {
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [dispatch, isInitialized, navigate]);

  // Handle OAuth callback (for OAuth flows)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we're on the callback URL with an auth code
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);

      const error = hashParams.get("error") || searchParams.get("error");
      const errorDescription =
        hashParams.get("error_description") ||
        searchParams.get("error_description");

      if (error && errorDescription) {
        console.error("OAuth error:", error, errorDescription);
        notifyError(errorDescription);
        navigate(FORGOT_PASSWORD);
        return;
      }

      // Supabase handles the code exchange automatically via the auth state listener
      // The SIGNED_IN event will fire when the exchange is complete
    };

    handleOAuthCallback();
  }, [navigate]);

  if (!isInitialized && isLoading) {
    return (
      <div className={classes.authInitializerContainer}>
        <DotLottieReact
          src="https://lottie.host/2ecc5382-8ea7-4709-b6fb-41b9a3f527ad/O63lCPhknw.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
