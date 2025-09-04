import * as React from 'react';
import classes from './styles.module.css';
// import { LOADING_COPIES } from '@/helpers/constants';
import { initializeAuth, selectIsInitialized, setInitialized } from '../../../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { authService } from '../../../../services/auth/auth.service';
import { useCurrentUser } from '../../../../services/auth/auth.data';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
//   const [loaderCopyIndex, setLoaderCopyIndex] = React.useState(0);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

//   React.useEffect(() => {
//     setLoaderCopyIndex(Math.floor(Math.random() * LOADING_COPIES.length));
//   }, []);

  // First, try to refresh token if no access token exists
  React.useEffect(() => {
    const initializeAuthCallback = async () => {
      const token = sessionStorage.getItem('access_token');

      if (!token && !isInitialized) {
        if (isMountedRef.current) setIsRefreshing(true);
        try {
          // Try to refresh using the httpOnly cookie
          const refreshData = await authService.refreshToken();
          if (refreshData) {
            // Now we have access_token, fetch user data
            const userResponse = await authService.fetchCurrentUser();
            const userData = await userResponse.json();

            if (userResponse.ok) {
              dispatch(
                initializeAuth({
                  user: userData.user,
                  access_token: refreshData.access_token,
                })
              );
            } else {
              dispatch(setInitialized());
            }
          } else {
            dispatch(setInitialized());
          }
        } catch (error) {
          dispatch(setInitialized());
        } finally {
          if (isMountedRef.current) setIsRefreshing(false);
        }
      }
    };

    initializeAuthCallback();
  }, [dispatch, isInitialized]);

  // Then use the existing query if we have a token
  const token = sessionStorage.getItem('access_token');
  const { data, isLoading, isError } = useCurrentUser({
    enabled: !!token && !isInitialized,
  });

  React.useEffect(() => {
    if (data && !isInitialized) {
      dispatch(initializeAuth(data));
    } else if (isError && token && !isInitialized) {
      dispatch(setInitialized());
    }
  }, [data, isError, token, isInitialized, dispatch]);

  if (!isInitialized && (isLoading || isRefreshing)) {
    return (
      <div className={classes.authInitializerContainer}>
        <span className={classes.loader}></span>
        <div className={classes.textSection}>
          <h2 className='tm-h3'>loading copies</h2>
          <p className='tm-subheading'>
            loading copies
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
