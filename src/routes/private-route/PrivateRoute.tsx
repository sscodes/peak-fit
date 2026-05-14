import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { AUTH_HOME } from '@/helpers/getters';
import { useAppSelector } from '@/hooks/redux';
import {
  selectIsAuthenticated,
  selectIsInitialized,
} from '@/store/authSlice';

const PrivateRoute = (): React.ReactElement => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);

  if (!isInitialized) {
    return <div>loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={AUTH_HOME} />;
};

export default PrivateRoute;
