import SignIn from '../components/sign-in/SignIn';
import classes from './Auth.module.css';

const Auth = () => {
  return (
    <div className={classes.authPageContainer}>
      <div>
        <div>PeakFit</div>
        <SignIn />
      </div>
    </div>
  );
};

export default Auth;
