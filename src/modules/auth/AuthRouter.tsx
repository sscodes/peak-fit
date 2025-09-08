import { Navigate, Route, Routes } from 'react-router';
import AuthLayout from '../../layout/auth/AuthLayout';
import SignIn from './containers/sign-in/SignIn';
import SignUp from './containers/sign-up/SignUp';

const AuthRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Navigate to='/auth/sign-up' replace />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        {/* <Route path='forgot-password' element={<ForgotPassword />} /> */}
        <Route path='*' element={<Navigate to='/error/404' replace />} />
      </Route>
    </Routes>
  );
};

export default AuthRouter;
