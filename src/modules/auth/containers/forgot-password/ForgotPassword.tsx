import clsx from 'clsx';
import { useFormik } from 'formik';
import { Step, Stepper1 } from '../../../../components/stepper-1/Stepper1';
import { ASSETS } from '../../../../helpers/assets';
import { notifyError, notifySuccess } from '../../../../helpers/helper';
import { supabaseAuth } from '../../../../lib/supabaseAuth';
import { useSendPasswordResetEmail } from '../../../../services/auth/auth.data';
import { emailValidation } from '../../utils/validation';
import classes from './styles.module.css';

const Footer = () => {
  return (
    <div className={clsx(classes.footer, 'label')}>
      Feel free to close this window
    </div>
  );
};

const ForgotPassword = () => {
  const { mutateAsync: sendPasswordResetEmail, isPending } =
    useSendPasswordResetEmail();

  const submitEmail = async () => {
    const payload = {
      email: formik.values.email,
    };
    try {
      const res = await sendPasswordResetEmail(payload);
      notifySuccess(res.message);
      return true;
    } catch (error: any) {
      const message = supabaseAuth.getErrorMessage(error);
      notifyError(message);
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailValidation,
    onSubmit: () => {},
  });

  const validateEmail = async () => {
    formik.setFieldTouched('email', true);
    const errors = await formik.validateForm();
    if (errors.email) return false;

    const success = await submitEmail();
    return success;
  };

  return (
    <>
      <Stepper1 initialStep={1} footer={<Footer />} hideFooterSteps={[0]}>
        <Step
          onNext={validateEmail}
          nextButtonText={isPending ? 'Sending email...' : 'Send email'}
          hideBackButton
        >
          <div className={classes.step}>
            <div className={classes.inputGroup}>
              <div className={classes.inputGroup}>
                <label htmlFor='email' className={clsx(classes.title, 'label')}>
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
                {formik.touched.email && formik.errors.email ? (
                  <div className={classes.errors}>{formik.errors.email}</div>
                ) : (
                  <div className={classes.errorsFiller}>error filler</div>
                )}
              </div>
            </div>
          </div>
        </Step>

        <Step hideNextButton hideBackButton>
          <div className={classes.step}>
            <div className={classes.welcomeIcon}>
              <img src={ASSETS.illustrations.SignUp} width={200} alt='' />
            </div>
            <div className={clsx(classes.title, 'heading-1')}>
              Reset link sent!
            </div>
            <div className={clsx(classes.subTitle, 'body-large')}>
              Open your email and follow the link to set a new password.
            </div>
          </div>
        </Step>
      </Stepper1>
    </>
  );
};

export default ForgotPassword;
