// src/components/auth/AuthInitializer/index.tsx
import * as React from 'react';
import classes from './styles.module.css';
// import { LOADING_COPIES } from '@/helpers/constants';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { supabaseAuth } from '../../../../lib/supabaseAuth';
import {
  supabaseProfile,
  type ProfileData,
} from '../../../../lib/supabaseProfile';
import {
  clearAuth,
  initializeAuth,
  selectIsInitialized,
  setAuthData,
  setInitialized,
} from '../../../../store/authSlice';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = React.useState(true);
  // const [loaderCopyIndex, setLoaderCopyIndex] = React.useState(0);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // React.useEffect(() => {
  //   setLoaderCopyIndex(Math.floor(Math.random() * LOADING_COPIES.length));
  // }, []);

  React.useEffect(() => {
    let authListener: { unsubscribe: () => void } | null = null;

    const initializeAuthState = async () => {
      try {
        // Check for existing session (Supabase checks localStorage automatically)
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

      if (error) {
        console.error('OAuth error:', error, errorDescription);
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
