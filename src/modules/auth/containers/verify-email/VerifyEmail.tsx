import * as React from 'react';
import { FaRedo } from 'react-icons/fa';
import { useLocation } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../../../components/button/Button';
import Icon from '../../../../components/icon/Icon';
import { notificationProperties } from '../../../../helpers/constants';
import { useResendConfirmationEmail } from '../../../../services/auth/auth.data';
import classes from './styles.module.css';

const VerifyEmail = () => {
  const [clickedResend, setClickedResend] = React.useState(0);
  const location = useLocation();
  const email = location.state?.email;

  const {
    mutateAsync: resendEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useResendConfirmationEmail();

  const notifyMailResent = (message: string) =>
    toast.success(message, notificationProperties);

  const notifyMailError = (message: string) =>
    toast.error(message, notificationProperties);

  React.useEffect(() => {
    if (isSuccess && clickedResend > 0) {
      notifyMailResent('Email re-sent successfully');
    }
  }, [isSuccess]);

  React.useEffect(() => {
    if (isError && clickedResend > 0) {
      console.log(error.message);
      notifyMailError(error.message);
    }
  }, [isError]);

  return (
    <>
      <div className={classes.container}>
        <span className={classes.loader}></span>
        <div className={classes.textSection}>
          <div className='heading-2'>Email on its way!</div>
          <div className='body-large'>
            Confirm your email and feel free to close this window.
          </div>
        </div>
        <Button
          onClick={async () => {
            try {
              await resendEmail({ email: email });
              setClickedResend((e) => e + 1);
            } catch (error: any) {
              notifyMailError(error.message);
            }
          }}
          disabled={isPending}
        >
          <div className={classes.buttonText}>
            {isPending ? (
              <div>Sending email...</div>
            ) : (
              <>
                <div>Resend email</div>
                <Icon icon={FaRedo} style={{ width: '12px' }} />
              </>
            )}
          </div>
        </Button>
      </div>
      <ToastContainer />
    </>
  );
};

export default VerifyEmail;
