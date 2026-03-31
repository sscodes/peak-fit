import clsx from "clsx";
import { useFormik } from "formik";
import { useNavigate, type NavigateFunction } from "react-router";
import Button from "../../../../components/button/Button";
import Input from "../../../../components/input/Input";
import { Step, Stepper } from "../../../../components/stepper/Stepper";
import { ASSETS } from "../../../../helpers/assets";
import { FORGOT_PASSWORD, SIGN_UP } from "../../../../helpers/getters";
import { notifyError } from "../../../../helpers/helper";
import { BUTTON_VARIANT } from "../../../../helpers/types";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import {
  useLoginUser,
  useOAuthSignIn,
} from "../../../../services/auth/auth.data";
import { AuthService } from "../../../../services/auth/auth.service";
import { signInValidation } from "../../utils/validation";
import classes from "./SignIn.module.css";

const authService = new AuthService();

const Footer = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <div className={clsx(classes.footer, "label")}>
      First rep? Join us today!
      <Button onClick={() => navigate(SIGN_UP)}>Sign up</Button>
    </div>
  );
};

const SignIn = () => {
  const { mutateAsync: loginUser } = useLoginUser();
  const { mutate: signInWithOAuth } = useOAuthSignIn();
  const navigate = useNavigate();
  const isExtraSmall = useMediaQuery("576px");

  const signIn = async () => {
    const user = {
      email: formik.values.email,
      password: formik.values.password,
    };
    try {
      await loginUser({ user });
      formik.resetForm();
    } catch (error: unknown) {
      const message = authService.getErrorMessage(error);
      notifyError(message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInValidation,
    onSubmit: signIn,
  });

  const validateStep2 = async () => {
    formik.setFieldTouched("email", true);
    const errors = await formik.validateForm();
    return !errors.email;
  };

  const validateStep3 = async () => {
    formik.setFieldTouched("password", true);
    const errors = await formik.validateForm();
    return !errors.password;
  };

  return (
    <>
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
              <img
                src={ASSETS.illustrations.TimeToWorkOut}
                width={200}
                height={200}
                alt=""
                fetchPriority="high"
              />
            </div>
            <div className={clsx(classes.title, "heading-1")}>
              Welcome back!
            </div>
            <div className={clsx(classes.subTitle, "body-large")}>
              Let's pick up where you left off.
            </div>
          </div>
        </Step>

        <Step onNext={validateStep2} hideBackButton>
          <div className={classes.step}>
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
          </div>
          <div className={classes.forgotPasswordSection}>
            <a
              className={clsx(classes.forgotPassword, "link")}
              onClick={() => navigate(FORGOT_PASSWORD)}
            >
              Forgot password?
            </a>
          </div>
        </Step>
      </Stepper>
    </>
  );
};

export default SignIn;
