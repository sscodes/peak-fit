import clsx from 'clsx';
import { Step, Stepper1 } from '../../../../components/stepper-1/Stepper1';
import { ASSETS } from '../../../../helpers/assets';
import classes from './styles.module.css';
import Button from '../../../../components/button/Button';
import { useNavigate } from 'react-router';
import { SIGN_UP } from '../../../../helpers/getters';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(classes.signUp, 'label')}>
      First rep? Join us today!
      <Button onClick={() => navigate(SIGN_UP)}>Sign up</Button>
    </div>
  );
};

const SignIn = () => {
  return (
    <div className={classes.authContainer}>
      <Stepper1
        initialStep={1}
        onStepChange={(step) => console.log('Step changed to:', step)}
        onFinalStepCompleted={() => {}}
        backButtonText='Previous'
        nextButtonText='Next'
        footer={<Footer />}
        hideFooterSteps={[0, 2]}
      >
        <Step hideBackButton>
          <div className={classes.step}>
            <div className={classes.welcomeIcon}>
              <img src={ASSETS.illustrations.SignIn} width={200} alt='' />
            </div>
            <div className={clsx(classes.title, 'heading-1')}>
              Welcome back!
            </div>
            <div className={clsx(classes.subTitle, 'body-large')}>
              Let's pick up where you left off.
            </div>
          </div>
        </Step>

        <Step onNext={() => true}>
          <div className={classes.step}>
            <div className={classes.inputGroup}>
              <label htmlFor='email' className={clsx(classes.title, 'label')}>
                Enter Email
              </label>
              <input
                id='email'
                name='email'
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
              <div className={classes.orSection}>
                <div className={classes.divider}></div>
                <div className={clsx('heading-6', classes.or)}>or</div>
                <div className={classes.divider}></div>
              </div>
              <div className={classes.oAuthSection}>
                <img
                  src={ASSETS.logo.facebook}
                  className={classes.oAuthOption}
                />
                <img src={ASSETS.logo.google} className={classes.oAuthOption} />
              </div>
            </div>
          </div>
        </Step>

        <Step onNext={() => true} nextButtonText='Submit'>
          <div className={classes.step}>
            <div className={classes.inputGroup}>
              <label
                htmlFor='password'
                className={clsx(classes.title, 'label')}
              >
                Enter Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                // value={formData.password}
                onChange={() => {}}
                // className={`${classes.input} ${
                //   errors.password ? classes.error : ''
                // }`}
                className={clsx(classes.input, 'input-text')}
                autoFocus
              />
              {/* {errors.password && (
                <span className={classes.errorMessage}>{errors.password}</span>
              )} */}
            </div>
            <a
              className={clsx(classes.forgotPassword, 'link')}
              onClick={() => console.log('Forgot password')}
            >
              Forgot password?
            </a>
          </div>
        </Step>
      </Stepper1>
    </div>
  );
};

export default SignIn;
