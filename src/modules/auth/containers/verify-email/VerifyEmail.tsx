import { useState, useEffect } from "react";
import { FaRedo } from "react-icons/fa";
import { useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import Button from "../../../../components/button/Button";
import Icon from "../../../../components/icon/Icon";
import { notifyError, notifySuccess } from "../../../../helpers/helper";
import { useResendConfirmationEmail } from "../../../../services/auth/auth.data";
import { AuthService } from "../../../../services/auth/auth.service";
import classes from "./VerifyEmail.module.css";

const authService = new AuthService();

const VerifyEmail = () => {
  const [clickedResend, setClickedResend] = useState(0);
  const location = useLocation();
  const email = location.state?.email;

  const {
    mutateAsync: resendEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useResendConfirmationEmail();

  useEffect(() => {
    if (isSuccess && clickedResend > 0) {
      notifySuccess("Email re-sent successfully");
    }
  }, [clickedResend, isSuccess]);

  useEffect(() => {
    if (isError && clickedResend > 0) {
      const message = authService.getErrorMessage(error);
      notifyError(message);
    }
  }, [clickedResend, error, isError]);

  return (
    <>
      <div className={classes.container}>
        <span className={classes.loader}></span>
        <div className={classes.textSection}>
          <div className="heading-2">Email on its way!</div>
          <div className="body-large">
            Confirm your email and feel free to close this window.
          </div>
        </div>
        <Button
          onClick={async () => {
            try {
              if (!email) {
                notifyError(
                  "Missing email. Please sign in or restart the sign-up flow.",
                );
                return;
              }
              await resendEmail({ email });
              setClickedResend((e) => e + 1);
            } catch (error: unknown) {
              const message = authService.getErrorMessage(error);
              notifyError(message);
            }
          }}
          disabled={isPending || !email}
        >
          <div className={classes.buttonText}>
            {isPending ? (
              <div>Sending email...</div>
            ) : (
              <>
                <div>Resend email</div>
                <Icon icon={FaRedo} style={{ width: "12px" }} />
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
