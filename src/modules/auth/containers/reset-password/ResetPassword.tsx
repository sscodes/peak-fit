import clsx from 'clsx';
import { useFormik } from 'formik';
import Button from '../../../../components/button/Button';
import { notifyError } from '../../../../helpers/helper';
import { supabaseAuth } from '../../../../lib/supabaseAuth';
import { useUpdateUserPassword } from '../../../../services/auth/auth.data';
import { passwordResetValidation } from '../../utils/validation';
import classes from './styles.module.css';

const ResetPassword = () => {
  const { mutateAsync: resetPassword, isPending } = useUpdateUserPassword();
  const submitPasswordReset = async () => {
    const payload = {
      newPassword: formik.values.password,
    };
    try {
      await resetPassword(payload);
      formik.resetForm();
    } catch (error: any) {
      const message = supabaseAuth.getErrorMessage(error);
      notifyError(message);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: passwordResetValidation,
    onSubmit: submitPasswordReset,
  });

  const handlePasswordReset = async () => {
    formik.setFieldTouched('password', true);
    formik.setFieldTouched('confirmPassword', true);
    const errors = await formik.validateForm();
    if (!errors.password && !errors.confirmPassword)
      formik.handleSubmit();
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
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
            <span className={classes.errors}>
              {formik.errors.password}
            </span>
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
              formik.touched.confirmPassword &&
                formik.errors.confirmPassword
                ? classes.error
                : ''
            )}
          />
          {formik.touched.confirmPassword &&
          formik.errors.confirmPassword ? (
            <span className={classes.errors}>
              {formik.errors.confirmPassword}
            </span>
          ) : (
            <div className={classes.errorsFiller}>error filler</div>
          )}
        </div>
        <Button onClick={handlePasswordReset} disabled={isPending}>
          {isPending ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
