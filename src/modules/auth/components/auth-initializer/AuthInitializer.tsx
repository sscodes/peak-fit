import * as React from 'react';
import classes from './styles.module.css';
import {
  initializeAuth,
  selectIsInitialized,
  setInitialized,
  clearAuth,
  setAuthData,
} from '../../../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { supabaseAuth } from '../../../../lib/supabaseAuth';
import {
  supabaseProfile,
  type ProfileData,
} from '../../../../lib/supabaseProfile';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { notifyError } from '../../../../helpers/helper';
import { useNavigate } from 'react-router';
import { FORGOT_PASSWORD } from '../../../../helpers/getters';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = React.useState(true);
  const isMountedRef = React.useRef(true);
  const navigate = useNavigate()

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    let authListener: { unsubscribe: () => void } | null = null;

    const initializeAuthState = async () => {
      try {
        // First check if this is a recovery/magic link flow
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');

        // If it's a recovery link, let the reset-password page handle it
        if (type === 'recovery' && accessToken) {
          console.log('Password recovery link detected, skipping auto-auth');
          // Don't initialize auth, let the reset-password page handle it
          dispatch(setInitialized(true));
          setIsLoading(false);
          return;
        }

        // Check for existing session (normal flow)
        const { session, error } = await supabaseAuth.getSession();

        if (error) {
          console.error('Auth initialization error:', error);
          dispatch(setInitialized(true));
          return;
        }

        if (session) {
          // We have a valid session, get the user profile
          const { data: profile } =
            await supabaseProfile.getCurrentUserProfile();

          if (isMountedRef.current) {
            dispatch(
              initializeAuth({
                session,
                profile: (profile as ProfileData) || null,
              })
            );
          }
        } else {
          // No session found
          if (isMountedRef.current) {
            dispatch(setInitialized(true));
          }
        }

        // Set up auth state change listener
        authListener = supabaseAuth.onAuthStateChange(
          async (event: AuthChangeEvent, session: Session | null) => {
            if (!isMountedRef.current) return;

            switch (event) {
              case 'SIGNED_IN':
                if (session) {
                  // Get user profile when signed in
                  const { data: profile } =
                    await supabaseProfile.getCurrentUserProfile();
                  dispatch(
                    setAuthData({
                      session,
                      profile: (profile as ProfileData) || undefined,
                    })
                  );
                }
                break;

              case 'SIGNED_OUT':
                dispatch(clearAuth());
                break;

              case 'TOKEN_REFRESHED':
                if (session) {
                  // Update session with new tokens
                  const { data: profile } =
                    await supabaseProfile.getCurrentUserProfile();
                  dispatch(
                    setAuthData({
                      session,
                      profile: (profile as ProfileData) || undefined,
                    })
                  );
                }
                break;

              case 'USER_UPDATED':
                if (session) {
                  // User data was updated (e.g., email change)
                  const { data: profile } =
                    await supabaseProfile.getCurrentUserProfile();
                  dispatch(
                    setAuthData({
                      session,
                      profile: (profile as ProfileData) || undefined,
                    })
                  );
                }
                break;

              default:
                break;
            }
          }
        );
      } catch (error) {
        console.error('Failed to initialize auth:', error);
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
  }, [dispatch, isInitialized]);

  // Handle OAuth callback (for OAuth flows)
  React.useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we're on the callback URL with an auth code
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);

      const error = hashParams.get('error') || searchParams.get('error');
      const errorDescription =
        hashParams.get('error_description') ||
        searchParams.get('error_description');

      if (error && errorDescription) {
        console.error('OAuth error:', error, errorDescription);
        notifyError(errorDescription);
        navigate(FORGOT_PASSWORD)
        return;
      }

      // Supabase handles the code exchange automatically via the auth state listener
      // The SIGNED_IN event will fire when the exchange is complete
    };

    handleOAuthCallback();
  }, []);

  if (!isInitialized && isLoading) {
    return (
      <div className={classes.authInitializerContainer}>
        <DotLottieReact
          src='https://lottie.host/2ecc5382-8ea7-4709-b6fb-41b9a3f527ad/O63lCPhknw.lottie'
          loop
          autoplay
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
