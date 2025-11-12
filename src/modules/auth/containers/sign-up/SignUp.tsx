import clsx from 'clsx';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';
import Button from '../../../../components/button/Button';
import { Step, Stepper1 } from '../../../../components/stepper-1/Stepper1';
import { ASSETS } from '../../../../helpers/assets';
import { SIGN_IN } from '../../../../helpers/getters';
import { notifyError } from '../../../../helpers/helper';
import { supabaseAuth } from '../../../../lib/supabaseAuth';
import { useCreateUser } from '../../../../services/auth/auth.data';
import { signUpValidation } from '../../utils/validation';
import classes from './styles.module.css';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className={clsx(classes.footer, 'label')}>
      Already on board?
      <Button onClick={() => navigate(SIGN_IN)}>Sign in</Button>
    </div>
  );
};

const SignUp = () => {
  const { mutateAsync: createUser } = useCreateUser();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpValidation,
    onSubmit: async () => {
      const payload = {
        user: {
          fullName: formik.values.fullName,
          email: formik.values.email,
          password: formik.values.password,
        },
      };
      try {
        await createUser(payload);
        formik.resetForm();
      } catch (error: any) {
        const message = supabaseAuth.getErrorMessage(error);
        notifyError(message);
      }
    },
  });

  // Helper function to validate specific fields
  const validateStep2 = async () => {
    // Touch the fields to trigger validation display
    formik.setFieldTouched('fullName', true);
    formik.setFieldTouched('email', true);

    // Validate the entire form
    const errors = await formik.validateForm();

    // Check if these specific fields have errors
    return !errors.fullName && !errors.email;
  };

  const validateStep3 = async () => {
    // Touch password fields
    formik.setFieldTouched('password', true);
    formik.setFieldTouched('confirmPassword', true);

    // Validate the entire form
    const errors = await formik.validateForm();

    // Check if password fields have errors
    return !errors.password && !errors.confirmPassword;
  };

  return (
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

      <Step onNext={validateStep2} hideBackButton>
        <div className={classes.step}>
          <div className={classes.inputGroup}>
            <label htmlFor='fullName' className={clsx(classes.title, 'label')}>
              Enter Name
            </label>
            <input
              id='fullName'
              name='fullName'
              type='text'
              placeholder='John Doe'
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoFocus
              className={clsx(
                classes.input,
                'input-text',
                formik.touched.fullName && formik.errors.fullName
                  ? classes.error
                  : ''
              )}
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <div className={classes.errors}>{formik.errors.fullName}</div>
            ) : (
              <div className={classes.errorsFiller}>error filler</div>
            )}
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
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={clsx(
                classes.input,
                'input-text',
                formik.touched.email && formik.errors.email ? classes.error : ''
              )}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={classes.errors}>{formik.errors.email}</div>
            ) : (
              <div className={classes.errorsFiller}>error filler</div>
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
      </Step>

      <Step onNext={validateStep3} nextButtonText='Submit'>
        <div className={classes.step}>
          <div className={classes.inputGroup}>
            <label htmlFor='password' className={clsx(classes.title, 'label')}>
              Enter Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
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
            {formik.touched.password && formik.errors.password ? (
              <span className={classes.errors}>{formik.errors.password}</span>
            ) : (
              <div className={classes.errorsFiller}>error filler</div>
            )}
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
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={clsx(
                classes.input,
                'input-text',
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? classes.error
                  : ''
              )}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <span className={classes.errors}>
                {formik.errors.confirmPassword}
              </span>
            ) : (
              <div className={classes.errorsFiller}>error filler</div>
            )}
          </div>
        </div>
      </Step>
    </Stepper1>
  );
};

export default SignUp;
