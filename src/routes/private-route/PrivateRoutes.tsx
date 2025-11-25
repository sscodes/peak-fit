import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import TopBarProgress from 'react-topbar-progress-indicator';
import Explore from '../../modules/explore/containers/Explore';
import Dashboard from '../../modules/dashboard/containers/Dashboard';
import MasterLayout from '../../layout/master-layout/MasterLayout';
import { DASHBOARD } from '../../helpers/getters';

const SuspendedView = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<TopBarProgress />}>{children}</React.Suspense>
  );
};

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route index element={<Navigate to={DASHBOARD} replace />} />
        <Route
          path='dashboard'
          element={
            <SuspendedView>
              <Dashboard />
            </SuspendedView>
          }
        />
        <Route
          path='explore'
          element={
            <SuspendedView>
              <Explore />
            </SuspendedView>
          }
        />
        <Route path='*' element={<Navigate to='/error/404' replace />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
