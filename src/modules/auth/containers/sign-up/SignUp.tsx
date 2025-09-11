import clsx from 'clsx';
import { Step, Stepper1 } from '../../../../components/stepper-1/Stepper1';
import { ASSETS } from '../../../../helpers/assets';
import classes from './styles.module.css';
import Button from '../../../../components/button/Button';
import { useNavigate } from 'react-router';
import { SIGN_IN } from '../../../../helpers/getters';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(classes.signIn, 'label')}>
      Already on board?
      <Button onClick={() => navigate(SIGN_IN)}>Sign in</Button>
    </div>
  );
};

const SignUp = () => {
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
              <img src={ASSETS.illustrations.SignUp} width={200} alt='' />
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
            <div className={classes.inputGroup}>
              <label
                htmlFor='fullName'
                className={clsx(classes.title, 'label')}
              >
                Enter Name
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                placeholder='John Doe'
                // value={formData.email}
                onChange={() => {}}
                autoFocus
                className={clsx(classes.input, 'input-text')}
              />
              {/* {errors.email && (
                <span className={classes.errorMessage}>{errors.email}</span>
              )} */}
            </div>
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
            <div className={classes.inputGroup}>
              <label
                htmlFor='confirmPassword'
                className={clsx(classes.title, classes.confirmPwd, 'label')}
              >
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
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
          </div>
        </Step>
      </Stepper1>
    </div>
  );
};

export default SignUp;
