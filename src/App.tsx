import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import { AUTH_HOME, DASHBOARD } from '@/helpers/getters';
import { useAppSelector } from '@/hooks/redux';
import AuthRouter from '@/modules/auth/AuthRouter';
import Error404Page from '@/modules/error/not-found/Error404Page';
import PrivateRoute from '@/routes/private-route/PrivateRoute';
import PrivateRoutes from '@/routes/private-route/PrivateRoutes';
import PublicRoute from '@/routes/public-route/PublicRoute';
import { selectIsAuthenticated } from '@/store/authSlice';

function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return (
    <Routes>
      <Route path='error/*' element={<Error404Page />} />

      <Route element={<PublicRoute />}>
        <Route path='auth/*' element={<AuthRouter />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path='*' element={<PrivateRoutes />} />
      </Route>

      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? DASHBOARD : AUTH_HOME} />}
      />
    </Routes>
  );
}

export default App;
