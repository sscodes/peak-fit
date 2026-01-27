import clsx from "clsx";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import Button from "../../../../components/button/Button";
import { notifyError } from "../../../../helpers/helper";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import { AuthService } from "../../../../services/auth/auth.service";
import { useUpdateUserPassword } from "../../../../services/auth/auth.data";
import { passwordResetValidation } from "../../utils/validation";
import classes from "./ResetPassword.module.css";
import Input from "../../../../components/input/Input";

const authService = new AuthService();

const ResetPassword = () => {
  const navigate = useNavigate();
  const isExtraSmall = useMediaQuery("576px");
  const { mutateAsync: resetPassword, isPending } = useUpdateUserPassword();
  const submitPasswordReset = async () => {
    const payload = {
      newPassword: formik.values.password,
    };
    try {
      await resetPassword(payload);
      formik.resetForm();
    } catch (error: unknown) {
      const message = authService.getErrorMessage(error);
      notifyError(message);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: passwordResetValidation,
    onSubmit: submitPasswordReset,
  });

  const handlePasswordReset = async () => {
    formik.setFieldTouched("password", true);
    formik.setFieldTouched("confirmPassword", true);
    const errors = await formik.validateForm();
    if (!errors.password && !errors.confirmPassword) formik.handleSubmit();
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        {isExtraSmall && (
          <div
            className={clsx(classes.logo, "hero-large")}
            onClick={() => navigate("/")}
          >
            PeakFit
          </div>
        )}
        <Input
          label="Enter Password"
          id="password"
          isError={formik.touched.password && formik.errors.password}
          error={formik.errors.password}
          type="password"
          placeholder="••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Input
          label="Confirm Password"
          id="confirmPassword"
          isError={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          error={formik.errors.confirmPassword}
          type="password"
          placeholder="••••••••"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className={classes.buttonGroup}>
          <Button onClick={handlePasswordReset} disabled={isPending}>
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
