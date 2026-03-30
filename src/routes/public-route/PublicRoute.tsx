import { type ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../../hooks/redux';
import {
  selectIsAuthenticated,
  selectIsInitialized,
} from '../../store/authSlice';
import { DASHBOARD } from '../../helpers/getters';

const PublicRoute = (): ReactElement => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);

  if (!isInitialized) {
    return <div>loading...</div>;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={DASHBOARD} />;
};

export default PublicRoute;
