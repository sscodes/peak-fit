import React, { useState, type ReactNode } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  BUTTON_VARIANT,
  STEPPER_PROGRESS,
  STEPPER_SIZE,
} from "../../helpers/types";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import classes from "./Stepper.module.css";
import useMediaQuery from "../../hooks/useMediaQuery";

interface StepperProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: () => ReactNode;
  progressIndicator?: STEPPER_PROGRESS;
  footer?: ReactNode;
  hideFooterSteps?: number[];
  size?: STEPPER_SIZE;
  header?: ReactNode;
}

interface StepProps {
  children: ReactNode;
  onNext?: () => boolean | Promise<boolean>;
  onPrev?: () => void;
  hideBackButton?: boolean;
  hideNextButton?: boolean;
  nextButtonText?: string;
  backButtonText?: string;
  isLastStep?: boolean;
}

// Step Component
export const Step: React.FC<StepProps> = ({ children }) => {
  return <>{children}</>;
};

// Main Stepper Component
export const Stepper: React.FC<StepperProps> = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  progressIndicator = STEPPER_PROGRESS.DOTS,
  footer,
  hideFooterSteps = [],
  size = STEPPER_SIZE.SMALL,
  header,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isExtraLarge = useMediaQuery("1400px");
  const isLarge = useMediaQuery("1150px");
  const isMedium = useMediaQuery("992px");
  const isSmall = useMediaQuery("768px");
  const isExtraSmall = useMediaQuery("576px");
  // Convert children to array and filter out invalid elements
  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Step,
  ) as React.ReactElement<StepProps>[];

  const totalSteps = steps.length;
  const currentStepElement = steps[currentStep - 1];
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNext = async () => {
    if (isProcessing) return;

    const stepProps = currentStepElement?.props;

    if (stepProps?.onNext) {
      setIsProcessing(true);
      try {
        const canProceed = await stepProps.onNext();
        if (canProceed) {
          proceedToNext();
        }
      } catch (error) {
        console.error("Error in onNext handler:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      proceedToNext();
    }
  };

  const proceedToNext = () => {
    if (isLastStep) {
      onFinalStepCompleted?.();
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrev = () => {
    if (isProcessing || isFirstStep) return;

    const stepProps = currentStepElement?.props;
    stepProps?.onPrev?.();

    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  };

  const renderProgressIndicators = () => {
    if (disableStepIndicators) return null;

    if (renderStepIndicator) {
      return renderStepIndicator();
    }

    const getStepperWidth = () => {
      if (size === STEPPER_SIZE.FULLSCREEN) {
        if (isExtraSmall) return "90%";
        else if (isSmall) return "85%";
        else if (isMedium) return "75%";
        else if (isLarge) return "65%";
        else if (isExtraLarge) return "55%";
        else return "45%";
      } else return "90%";
    };

    return progressIndicator === STEPPER_PROGRESS.LINE ? (
      <div className={classes.progressSection}>
        <div
          className={classes.progressBar}
          style={{ width: getStepperWidth() }}
        >
          <div
            className={classes.progressFill}
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    ) : (
      <div
        className={`${classes.stepIndicators} ${stepCircleContainerClassName}`}
      >
        {steps.map((_, index) => (
          <div
            key={index}
            className={`${classes.stepDot} 
                ${currentStep > index + 1 ? classes.active : ""} 
                ${currentStep === index + 1 ? classes.current : ""}`}
          />
        ))}
      </div>
    );
  };

  const getButtonText = () => {
    const stepProps = currentStepElement?.props;

    const backText = stepProps?.backButtonText || backButtonText;
    const nextText = isLastStep
      ? stepProps?.nextButtonText || "Submit"
      : stepProps?.nextButtonText || nextButtonText;

    return { backText, nextText };
  };

  const { backText, nextText } = getButtonText();
  const stepProps = currentStepElement?.props;
  const showBackButton = !isFirstStep && !stepProps?.hideBackButton;
  const showNextButton = !stepProps?.hideNextButton;

  const getStepperSizeStyle = React.useCallback(() => {
    // check for fullscreen size
    if (isExtraSmall || size === STEPPER_SIZE.FULLSCREEN) {
      return {
        width: "100vw",
        height: "100vh",
        margin: 0,
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
        padding: "96px 48px",
      };
    }
    // check for small size
    else if (size === STEPPER_SIZE.SMALL) {
      if (isSmall) {
        return { width: "60vw" };
      } else if (isMedium) {
        return { width: "50vw" };
      } else if (isLarge) {
        return { width: "40vw" };
      } else if (isExtraLarge) {
        return { width: "35vw" };
      } else {
        return { width: "25vw" };
      }
    }
    // check for medium size
    else if (size === STEPPER_SIZE.MEDIUM) {
      if (isSmall) {
        return { width: "80vw" };
      } else if (isMedium) {
        return { width: "75vw" };
      } else if (isLarge) {
        return { width: "65vw" };
      } else if (isExtraLarge) {
        return { width: "60vw" };
      } else {
        return { width: "50vw" };
      }
    }
    // check for large size
    else if (size === STEPPER_SIZE.LARGE) {
      if (isSmall) {
        return { width: "85vw" };
      } else if (isMedium) {
        return { width: "82vw" };
      } else if (isLarge) {
        return { width: "80vw" };
      } else if (isExtraLarge) {
        return { width: "77vw" };
      } else {
        return { width: "75vw" };
      }
    }
  }, [isExtraLarge, isExtraSmall, isLarge, isMedium, isSmall, size]);

  return (
    <div className={classes.stepperContainer}>
      <div
        className={`${classes.stepperWrapper} ${stepContainerClassName}`}
        style={getStepperSizeStyle()}
      >
        {header}
        {renderProgressIndicators()}

        <div className={`${classes.stepContent} ${contentClassName}`}>
          {currentStepElement?.props.children}
        </div>

        {(showBackButton || showNextButton) && (
          <div className={`${classes.navigationButtons} ${footerClassName}`}>
            {showBackButton ? (
              <Button
                variant={BUTTON_VARIANT.SECONDARY}
                onClick={handlePrev}
                disabled={isProcessing}
              >
                {!isProcessing && (
                  <div className={classes.btnIcon}>
                    <Icon icon={HiChevronLeft} />
                  </div>
                )}
                {backText}
              </Button>
            ) : (
              <div />
            )}

            {showNextButton && (
              <Button onClick={handleNext} disabled={isProcessing}>
                {nextText}
                {!isProcessing && (
                  <div className={classes.btnIcon}>
                    <Icon icon={HiChevronRight} />
                  </div>
                )}
              </Button>
            )}
          </div>
        )}

        {hideFooterSteps.includes(currentStep - 1) ? null : footer}
      </div>
    </div>
  );
};
