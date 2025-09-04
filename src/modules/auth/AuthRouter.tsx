import { Navigate, Route, Routes } from 'react-router';
import Auth from './containers/Auth';
import AuthLayout from '../../layout/auth/AuthLayout';

const AuthRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Auth />} />
        {/* <Route path='forgot-password' element={<ForgotPassword />} /> */}
        <Route path='*' element={<Navigate to='/error/404' replace />} />
      </Route>
    </Routes>
  );
};

export default AuthRouter;
