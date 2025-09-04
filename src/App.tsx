import * as React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Navigate, Route, Routes } from 'react-router';
// import './App.css';
import AuthRouter from './modules/auth/AuthRouter';
import Home from './modules/home/containers/Home';
import PublicRoute from './routes/public-route/PublicRoute';
import PrivateRoute from './routes/private-route/PrivateRoute';
import { useAppSelector } from './hooks/redux';
import { selectIsAuthenticated } from './store/authSlice';
import { AUTH_HOME, HOME } from './helpers/getters';
import Error404Page from './modules/error/not-found/Error404Page';

const SuspendedView = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<TopBarProgress />}>{children}</React.Suspense>
  );
};

function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return (
    <Routes>
      <Route path='error/*' element={<Error404Page />} />

      <Route element={<PublicRoute />}>
        <Route path='auth/*' element={<AuthRouter />} />
      </Route>

      {/* <Route path='*' element={!token && <Navigate to={AUTH_HOME} />} /> */}

      <Route element={<PrivateRoute />}>
        <Route
          path='dashboard'
          element={
            <SuspendedView>
              <Home />
            </SuspendedView>
          }
        ></Route>
      </Route>

      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? HOME : AUTH_HOME} />}
      />
    </Routes>
    // <ToastContainer />
  );
}

export default App;
