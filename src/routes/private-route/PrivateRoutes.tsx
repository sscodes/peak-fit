import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";
import TopBarProgress from "react-topbar-progress-indicator";
import { DASHBOARD } from "../../helpers/getters";
import MasterLayout from "../../layout/master-layout/MasterLayout";

const Dashboard = lazy(
  () => import("../../modules/dashboard/containers/Dashboard"),
);
const Explore = lazy(() => import("../../modules/explore/containers/Explore"));
const Coach = lazy(() => import("../../modules/coach/containers/coach/Coach"));
const OnboardingQuestionnaire = lazy(
  () =>
    import("../../modules/coach/containers/onboarding-questionnaire/OnboardingQuestionnaire"),
);

const SuspendedView = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route index element={<Navigate to={DASHBOARD} replace />} />
        <Route
          path="dashboard"
          element={
            <SuspendedView>
              <Dashboard />
            </SuspendedView>
          }
        />
        <Route
          path="explore"
          element={
            <SuspendedView>
              <Explore />
            </SuspendedView>
          }
        />
        <Route
          path="coach"
          element={
            <SuspendedView>
              <Coach />
            </SuspendedView>
          }
        />
        <Route
          path="onboarding-questionnaire"
          element={
            <SuspendedView>
              <OnboardingQuestionnaire />
            </SuspendedView>
          }
        />
        <Route path="*" element={<Navigate to="/error/404" replace />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
