import React from "react";
import { useNavigate } from "react-router";
import { Step, Stepper } from "../../../../components/stepper/Stepper";
import { COACH, DASHBOARD } from "../../../../helpers/getters";
import { STEPPER_PROGRESS, STEPPER_SIZE } from "../../../../helpers/types";
import { useAppSelector } from "../../../../hooks/redux";
import { useGetCrucialQuestionnaire } from "../../../../services/onboarding/onboarding.data";
import { selectProfile } from "../../../../store/authSlice";
import type {
  Questionnaire,
  QuestionWithSectionMeta,
} from "../../../../types/questions";
import classes from "./OnboardingQuestionnaire.module.css";
import Disclaimer from "./components/disclaimer/Disclaimer";
import QuestionComponent from "./components/question/Question";

const OnboardingQuestionnaire = () => {
  const user = useAppSelector(selectProfile);
  const navigate = useNavigate();
  const { data: crucialQuestions } = useGetCrucialQuestionnaire();

  React.useEffect(() => {
    if (user?.is_onboarded) {
      navigate(COACH);
    }
  }, [user, navigate]);

  const modifiedCrucialQuestions = React.useMemo(() => {
    if (!crucialQuestions) return [];
    return extractQuestionsWithSectionMeta(crucialQuestions);
  }, [crucialQuestions]);

  function extractQuestionsWithSectionMeta(
    questionnaire: Questionnaire,
  ): QuestionWithSectionMeta[] {
    return questionnaire.flatMap((section) =>
      section.questions.map((question) => ({
        ...question,
        section_title: section.title,
        section_description: section.description,
        section_icon: section.icon,
      })),
    );
  }

  return (
    <div className={classes.onboardingQuestionnaireContainer}>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={() => {}}
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

        {modifiedCrucialQuestions.map((question, index) => (
          <Step key={index} backButtonText="Previous" nextButtonText="Next">
            <QuestionComponent question={question} />
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default OnboardingQuestionnaire;
