import { Navigate, Route, Routes } from 'react-router';
import AuthLayout from '../../layout/auth/AuthLayout';
import SignIn from './containers/sign-in/SignIn';
import SignUp from './containers/sign-up/SignUp';
import { SIGN_UP } from '../../helpers/getters';
import VerifyEmail from './containers/verify-email/VerifyEmail';

const AuthRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Navigate to={SIGN_UP} replace />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
         {/* TODO: make this private but public later */}
        <Route path='/verify-email' element={<VerifyEmail />} />
        {/* <Route path='forgot-password' element={<ForgotPassword />} /> */}
        <Route path='*' element={<Navigate to='/error/404' replace />} />
      </Route>
    </Routes>
  );
};

export default AuthRouter;
