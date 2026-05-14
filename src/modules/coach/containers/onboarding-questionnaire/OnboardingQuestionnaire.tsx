import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { Step, Stepper } from "@/components/stepper/Stepper";
import { COACH, DASHBOARD } from "@/helpers/getters";
import { STEPPER_PROGRESS, STEPPER_SIZE } from "@/helpers/types";
import { useAppSelector } from "@/hooks/redux";
import {
  useCompleteOnboarding,
  useGetCrucialQuestionnaire,
  useSaveAnswers,
} from "@/services/onboarding/onboarding.data";
import { selectProfile } from "@/store/authSlice";
import {
  INPUT_TYPE,
  type FormValues,
  type QuestionWithSectionMeta,
} from "@/types/questions";
import classes from "./OnboardingQuestionnaire.module.css";
import Disclaimer from "./components/disclaimer/Disclaimer";
import QuestionComponent from "./components/question/Question";
import Review from "./components/review/Review";
import { evaluateConditionalDisplay } from "./utils/helper";
import { buildValidationSchema } from "./utils/validation";

const OnboardingQuestionnaire = () => {
  const user = useAppSelector(selectProfile);
  const navigate = useNavigate();
  const { data: crucialQuestions } = useGetCrucialQuestionnaire();
  const { mutateAsync: saveAnswers } = useSaveAnswers();
  const { mutateAsync: completeOnboarding } = useCompleteOnboarding();

  React.useEffect(() => {
    if (user?.is_onboarded) {
      navigate(COACH);
    }
  }, [user, navigate]);

  const modifiedCrucialQuestions: QuestionWithSectionMeta[] =
    React.useMemo(() => {
      if (!crucialQuestions) return [];
      return crucialQuestions.flatMap((section) =>
        section.questions.map((question) => ({
          ...question,
          section_title: section.title,
          section_description: section.description,
          section_icon: section.icon,
        })),
      );
    }, [crucialQuestions]);

  const validationSchema = React.useMemo(
    () => buildValidationSchema(modifiedCrucialQuestions),
    [modifiedCrucialQuestions],
  );

  const formik = useFormik<FormValues>({
    initialValues: Object.fromEntries(
      modifiedCrucialQuestions.map((q) => [
        q.id,
        q.input_type === INPUT_TYPE.MULTI_SELECT
          ? (q.default_value ?? [])
          : (q.default_value ?? ""),
      ]),
    ),
    enableReinitialize: true, // Crucial: Re-initializes form when questions fetch is complete
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (!user?.id) {
        return;
      }
      try {
        await saveAnswers({
          userId: user?.id,
          answers: values,
        });
        await completeOnboarding({ userId: user?.id });
        navigate(COACH);
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const handleStepNext = async (currentQuestionId: string) => {
    await formik.setFieldTouched(currentQuestionId, true, false);
    const errors = await formik.validateForm();
    return !errors[currentQuestionId];
  };

  return (
    <div className={classes.onboardingQuestionnaireContainer}>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={() => formik.handleSubmit()}
        backButtonText="Previous"
        nextButtonText="Next"
        progressIndicator={STEPPER_PROGRESS.LINE}
        size={STEPPER_SIZE.FULLSCREEN}
        showCancelButton
        handleCancel={() => navigate(DASHBOARD)}
      >
        <Step backButtonText="Cancel" nextButtonText="Agree and continue">
          <Disclaimer />
        </Step>

        {modifiedCrucialQuestions?.map((question) => {
          return question.conditional_display ? (
            evaluateConditionalDisplay(
              question.conditional_display.operator,
              formik.values[question.conditional_display.depends_on],
              question.conditional_display.value,
            ) ? (
              <Step
                key={question.id}
                backButtonText="Previous"
                onNext={() => handleStepNext(question.id)}
              >
                <QuestionComponent formik={formik} question={question} />
              </Step>
            ) : null
          ) : (
            <Step
              key={question.id}
              backButtonText="Previous"
              onNext={() => handleStepNext(question.id)}
            >
              <QuestionComponent formik={formik} question={question} />
            </Step>
          );
        })}
        <Step
          backButtonText="Previous"
          nextButtonText={formik.isSubmitting ? "Submitting..." : "Submit"}
        >
          <Review />
        </Step>
      </Stepper>
    </div>
  );
};

export default OnboardingQuestionnaire;
