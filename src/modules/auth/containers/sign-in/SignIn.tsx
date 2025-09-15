import clsx from 'clsx';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Button from '../../../../components/button/Button';
import { Step, Stepper1 } from '../../../../components/stepper-1/Stepper1';
import { ASSETS } from '../../../../helpers/assets';
import { SIGN_UP } from '../../../../helpers/getters';
import { notifyError } from '../../../../helpers/helper';
import { supabaseAuth } from '../../../../lib/supabaseAuth';
import { useLoginUser } from '../../../../services/auth/auth.data';
import { signInValidation } from '../../utils/validation';
import classes from './styles.module.css';

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
  const { mutateAsync: loginUser } = useLoginUser();

  const signIn = async () => {
    const user = {
      email: formik.values.email,
      password: formik.values.password,
    };
    try {
      await loginUser({ user });
      formik.resetForm();
    } catch (error: any) {
      const message = supabaseAuth.getErrorMessage(error);
      notifyError(message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInValidation,
    onSubmit: signIn,
  });

  // Helper function to validate specific fields
  const validateStep2 = async () => {
    // Touch the fields to trigger validation display
    formik.setFieldTouched('email', true);

    // Validate the entire form
    const errors = await formik.validateForm();

    // Check if these specific fields have errors
    return !errors.email;
  };

  const validateStep3 = async () => {
    // Touch password fields
    formik.setFieldTouched('password', true);

    // Validate the entire form
    const errors = await formik.validateForm();

    // Check if password fields have errors
    return !errors.password;
  };

  return (
    <>
      <div className={classes.authContainer}>
        <Stepper1
          initialStep={1}
          onStepChange={(step) => console.log('Step changed to:', step)}
          onFinalStepCompleted={() => formik.handleSubmit()}
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

          <Step onNext={validateStep2} hideBackButton>
            <div className={classes.step}>
              <div className={classes.inputGroup}>
                <div className={classes.inputGroup}>
                  <label
                    htmlFor='email'
                    className={clsx(classes.title, 'label')}
                  >
                    Enter Email
                  </label>
                  <input
                    id='email'
                    type='email'
                    name='email'
                    placeholder='your@email.com'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={clsx(
                      classes.input,
                      'input-text',
                      formik.touched.email && formik.errors.email
                        ? classes.error
                        : ''
                    )}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className={classes.errors}>{formik.errors.email}</div>
                  )}
                  <div className={classes.orSection}>
                    <div className={classes.divider}></div>
                    <div className={clsx('heading-6', classes.or)}>or</div>
                    <div className={classes.divider}></div>
                  </div>
                  <div className={classes.oAuthSection}>
                    <img
                      src={ASSETS.logo.google}
                      className={classes.oAuthOption}
                      alt='google-logo'
                    />
                    <img
                      src={ASSETS.logo.facebook}
                      className={classes.oAuthOption}
                      alt='facebook-logo'
                    />
                    <img
                      src={ASSETS.logo.twitter}
                      className={classes.oAuthOption}
                      alt='twitter-logo'
                    />
                    <img
                      src={ASSETS.logo.apple}
                      className={classes.oAuthOption}
                      alt='apple-logo'
                    />
                  </div>
                </div>
              </div>
            </div>
          </Step>

          <Step onNext={validateStep3} nextButtonText='Submit'>
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
                  type='password'
                  name='password'
                  placeholder='••••••••'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={clsx(
                    classes.input,
                    'input-text',
                    formik.touched.password && formik.errors.password
                      ? classes.error
                      : ''
                  )}
                  autoFocus
                />
                {formik.touched.password && formik.errors.password && (
                  <span className={classes.errors}>
                    {formik.errors.password}
                  </span>
                )}
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
      <ToastContainer />
    </>
  );
};

export default SignIn;
