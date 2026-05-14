import clsx from "clsx";
import { useFormik } from "formik";
import { useNavigate, type NavigateFunction } from "react-router";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { Step, Stepper } from "@/components/stepper/Stepper";
import { ASSETS } from "@/helpers/assets";
import { SIGN_IN } from "@/helpers/getters";
import { notifyError } from "@/helpers/helper";
import { BUTTON_VARIANT } from "@/helpers/types";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  useCreateUser,
  useOAuthSignIn,
} from "@/services/auth/auth.data";
import { AuthService } from "@/services/auth/auth.service";
import { signUpValidation } from "@/modules/auth/utils/validation";
import classes from "./SignUp.module.css";

const authService = new AuthService();

const Footer = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <div className={clsx(classes.footer, "label")}>
      Already on board?
      <Button onClick={() => navigate(SIGN_IN)}>Sign in</Button>
    </div>
  );
};

const SignUp = () => {
  const { mutateAsync: createUser } = useCreateUser();
  const { mutate: signInWithOAuth } = useOAuthSignIn();
  const isExtraSmall = useMediaQuery("576px");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
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
      } catch (error) {
        const message = authService.getErrorMessage(error);
        notifyError(message);
      }
    },
  });

  // Helper function to validate specific fields
  const validateStep2 = async () => {
    // Touch the fields to trigger validation display
    formik.setFieldTouched("fullName", true);
    formik.setFieldTouched("email", true);

    // Validate the entire form
    const errors = await formik.validateForm();

    // Check if these specific fields have errors
    return !errors.fullName && !errors.email;
  };

  const validateStep3 = async () => {
    // Touch password fields
    formik.setFieldTouched("password", true);
    formik.setFieldTouched("confirmPassword", true);

    // Validate the entire form
    const errors = await formik.validateForm();

    // Check if password fields have errors
    return !errors.password && !errors.confirmPassword;
  };

  return (
    <Stepper
      initialStep={1}
      onFinalStepCompleted={() => formik.handleSubmit()}
      backButtonText="Previous"
      nextButtonText="Next"
      footer={<Footer navigate={navigate} />}
      hideFooterSteps={[0, 2]}
      header={
        isExtraSmall ? (
          <div
            className={clsx(classes.logo, "hero-large")}
            onClick={() => navigate("/")}
          >
            PeakFit
          </div>
        ) : null
      }
    >
      <Step hideBackButton>
        <div className={classes.step}>
          <div className={classes.welcomeIcon}>
            <img src={ASSETS.illustrations.LetsGo} width={200} height={200} alt="" fetchPriority="high" />
          </div>
          <div className={clsx(classes.title, "heading-1")}>
            Welcome to PeakFit
          </div>
          <div className={clsx(classes.subTitle, "body-large")}>
            Your AI-powered fitness journey starts here
          </div>
        </div>
      </Step>

      <Step onNext={validateStep2} hideBackButton>
        <div className={classes.step}>
          <Input
            label="Enter Name"
            id="fullName"
            isError={formik.touched.fullName && formik.errors.fullName}
            error={formik.errors.fullName}
            type="text"
            placeholder="John Doe"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            label="Enter Email"
            id="email"
            isError={formik.touched.email && formik.errors.email}
            error={formik.errors.email}
            type="email"
            placeholder="your@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputGroupClasses={classes.emailSection}
          />
          <div className={classes.orSection}>
            <div className={classes.divider}></div>
            <div className={clsx("heading-6", classes.or)}>or</div>
            <div className={classes.divider}></div>
          </div>
          <div className={classes.oAuthSection}>
            <Button
              variant={BUTTON_VARIANT.MINIMAL}
              onClick={() => signInWithOAuth()}
            >
              Sign in with Google{" "}
              <img
                src={ASSETS.logo.google}
                className={classes.oAuthOption}
                alt="google-logo"
              />
            </Button>
          </div>
        </div>
      </Step>

      <Step onNext={validateStep3} nextButtonText="Submit">
        <div className={classes.step}>
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
            inputGroupClasses={classes.confirmPwdSection}
          />
        </div>
      </Step>
    </Stepper>
  );
};

export default SignUp;
