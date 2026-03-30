import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";
import TopBarProgress from "react-topbar-progress-indicator";
import { SIGN_UP } from "../../helpers/getters";
import AuthLayout from "../../layout/auth/AuthLayout";

const SignIn = lazy(() => import("./containers/sign-in/SignIn"));
const SignUp = lazy(() => import("./containers/sign-up/SignUp"));
const VerifyEmail = lazy(() => import("./containers/verify-email/VerifyEmail"));
const ForgotPassword = lazy(
  () => import("./containers/forgot-password/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("./containers/reset-password/ResetPassword"),
);

const SuspendedView = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

const AuthRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Navigate to={SIGN_UP} replace />} />
        <Route
          path="sign-in"
          element={
            <SuspendedView>
              <SignIn />
            </SuspendedView>
          }
        />
        <Route
          path="sign-up"
          element={
            <SuspendedView>
              <SignUp />
            </SuspendedView>
          }
        />
        {/* TODO: make this private but public later */}
        <Route
          path="verify-email"
          element={
            <SuspendedView>
              <VerifyEmail />
            </SuspendedView>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SuspendedView>
              <ForgotPassword />
            </SuspendedView>
          }
        />
        <Route
          path="reset-password"
          element={
            <SuspendedView>
              <ResetPassword />
            </SuspendedView>
          }
        />

        <Route path="*" element={<Navigate to="/error/404" replace />} />
      </Route>
    </Routes>
  );
};

export default AuthRouter;
