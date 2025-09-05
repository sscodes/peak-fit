import clsx from 'clsx';
import { Step, Stepper1 } from '../../../components/stepper-1/Stepper1';
import { ASSETS } from '../../../helpers/assets';
import classes from './Auth.module.css';
import Button from '../../../components/button/Button';

const Footer = () => {
  return (
    <div className={clsx(classes.signUp, 'nav-link')}>
      First rep? Join us today!
      <Button onClick={() => {}}>Sign up</Button>
    </div>
  );
};

const Auth = () => {
  return (
    <div className={classes.authContainer}>
      <Stepper1
        initialStep={1}
        onStepChange={(step) => console.log('Step changed to:', step)}
        onFinalStepCompleted={() => {}}
        backButtonText='Previous'
        nextButtonText='Next'
        footer={<Footer />}
        hideFooterSteps={[1]}
      >
        <Step hideBackButton>
          <div className={classes.step}>
            <div className={classes.welcomeIcon}>
              <img
                src={ASSETS.illustrations.authentication}
                width={200}
                alt=''
              />
            </div>
            <div className={clsx(classes.title, 'heading-1')}>
              Welcome to PeakFit
            </div>
            <div className={clsx(classes.subTitle, 'body-large')}>
              Your AI-powered fitness journey starts here
            </div>
          </div>
        </Step>

        <Step onNext={() => true}>
          <div className={classes.step}>
            <div className={clsx(classes.title, 'label')}>
              Already sweating with us?
            </div>
            <div className={clsx(classes.title, 'label')}>Jump back in!</div>
            <div className={classes.inputGroup}>
              <input
                type='email'
                placeholder='your@email.com'
                // value={formData.email}
                onChange={() => {}}
                autoFocus
                className={clsx(classes.input, 'input-text')}
              />
              {/* {errors.email && (
                <span className={classes.errorMessage}>{errors.email}</span>
              )} */}
            </div>
          </div>
        </Step>

        <Step onNext={() => true} nextButtonText='Submit'>
          <div className={classes.step}>
            <h2 className={classes.h2}>Enter Your Password</h2>
            <p className={classes.p}>Secure access to your fitness profile</p>
            <div className={classes.inputGroup}>
              <input
                type='password'
                placeholder='••••••••'
                // value={formData.password}
                onChange={() => {}}
                // className={`${classes.input} ${
                //   errors.password ? classes.error : ''
                // }`}
                autoFocus
              />
              {/* {errors.password && (
                <span className={classes.errorMessage}>{errors.password}</span>
              )} */}
            </div>
            <button
              className={classes.forgotPassword}
              onClick={() => console.log('Forgot password')}
            >
              Forgot password?
            </button>
          </div>
        </Step>
      </Stepper1>
    </div>
  );
};

export default Auth;
