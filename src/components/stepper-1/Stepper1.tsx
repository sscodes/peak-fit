import React, { useState, type ReactNode } from 'react';
import classes from './styles.module.css';
import Button from '../button/Button';
import { BUTTON_VARIANT, STEPPER_1_PROGRESS } from '../../helpers/types';

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
  progressIndicator?: STEPPER_1_PROGRESS;
  footer?: ReactNode;
  hideFooterSteps?: number[];
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

// Main Stepper1 Component
export const Stepper1: React.FC<StepperProps> = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  progressIndicator = STEPPER_1_PROGRESS.DOTS,
  footer,
  hideFooterSteps = [],
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Convert children to array and filter out invalid elements
  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Step
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
        console.error('Error in onNext handler:', error);
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

    return progressIndicator === STEPPER_1_PROGRESS.LINE ? (
      <div className={classes.progressBar}>
        <div
          className={classes.progressFill}
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    ) : (
      <div
        className={`${classes.stepIndicators} ${stepCircleContainerClassName}`}
      >
        {steps.map((_, index) => (
          <div
            key={index}
            className={`${classes.stepDot} 
                ${currentStep > index + 1 ? classes.active : ''} 
                ${currentStep === index + 1 ? classes.current : ''}`}
          />
        ))}
      </div>
    );
  };

  const getButtonText = () => {
    const stepProps = currentStepElement?.props;

    const backText = stepProps?.backButtonText || backButtonText;
    const nextText = isLastStep
      ? stepProps?.nextButtonText || 'Submit'
      : stepProps?.nextButtonText || nextButtonText;

    return { backText, nextText };
  };

  const { backText, nextText } = getButtonText();
  const stepProps = currentStepElement?.props;
  const showBackButton = !isFirstStep && !stepProps?.hideBackButton;
  const showNextButton = !stepProps?.hideNextButton;

  return (
    <div className={`${classes.stepperContainer} ${stepContainerClassName}`}>
      <div className={classes.stepperWrapper}>
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
                {backText}
              </Button>
            ) : (
              <div />
            )}

            {showNextButton && (
              <Button onClick={handleNext} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : nextText}
              </Button>
            )}
          </div>
        )}

        {hideFooterSteps.includes(currentStep) ? null : footer}
      </div>
    </div>
  );
};
