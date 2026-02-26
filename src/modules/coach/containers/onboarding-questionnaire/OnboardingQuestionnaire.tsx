import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router";
import { Step, Stepper } from "../../../../components/stepper/Stepper";
import { COACH, DASHBOARD } from "../../../../helpers/getters";
import { STEPPER_PROGRESS, STEPPER_SIZE } from "../../../../helpers/types";
import { useAppSelector } from "../../../../hooks/redux";
import { useGetCrucialQuestionnaire } from "../../../../services/onboarding/onboarding.data";
import { selectProfile } from "../../../../store/authSlice";
import type { Question, Questionnaire } from "../../../../types/questions";
import classes from "./OnboardingQuestionnaire.module.css";
import DatePickerExamples from "../../../../components/date-picker/Component";
import SliderExamples from "../../../../components/slider/Example";

type QuestionWithSectionMeta = Question & {
  section_title: string;
  section_description: string;
  section_icon: string;
};

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

  console.log("Crucial Questions:", modifiedCrucialQuestions);

  return (
    // <div className={classes.onboardingQuestionnaireContainer}>
    //   <Stepper
    //     initialStep={1}
    //     onFinalStepCompleted={() => {}}
    //     backButtonText="Previous"
    //     nextButtonText="Next"
    //     progressIndicator={STEPPER_PROGRESS.LINE}
    //     size={STEPPER_SIZE.FULLSCREEN}
    //     showCancelButton
    //     handleCancel={() => navigate(DASHBOARD)}
    //   >
    //     <Step backButtonText="Cancel" nextButtonText="Agree and continue">
    //       <div className={classes.disclaimerContainer}>
    //         <div className={clsx(classes.disclaimer, classes.step)}>
    //           <div className={clsx(classes.title, "heading-1")}>
    //             Before We Begin
    //           </div>
    //           <p className={clsx(classes.disclaimerContent, "body-large")}>
    //             To help us create workout plans that actually work for you,
    //             we'll ask a few simple questions about your body, lifestyle, and
    //             fitness goals.
    //           </p>
    //           <p className={clsx(classes.disclaimerContent, "body-large")}>
    //             Nothing scary — no tests, no jargon, no pressure. Just basic
    //             details that help our AI understand who you are, instead of
    //             giving you a one-size-fits-all workout.
    //           </p>
    //           <div className={clsx(classes.disclaimerContent, "body-large")}>
    //             Why this matters 👇
    //             <ul>
    //               <li>Everyone's body is different</li>
    //               <li>
    //                 A generic workout can be ineffective — or even <b>unsafe</b>
    //               </li>
    //               <li>
    //                 Personal details help us tailor intensity, exercises, pace,
    //                 and recovery to <i>you</i>
    //               </li>
    //             </ul>
    //           </div>
    //           <p className={clsx(classes.disclaimerContent, "body-large")}>
    //             You can get started with just a few essentials. If you'd like,
    //             you can share more details later to help us fine-tune your plan
    //             even further.
    //           </p>
    //           <p className={clsx(classes.disclaimerContent, "body-large")}>
    //             We only use this information to improve your fitness experience.
    //           </p>
    //           <p className={clsx(classes.disclaimerContent, "body-large")}>
    //             Let's build a fitness plan that fits your life 💪
    //           </p>
    //         </div>
    //       </div>
    //     </Step>

    //     <Step>
    //       <div className={classes.step}>
    //         <div className={clsx(classes.title, "heading-1")}>
    //           Welcome back!
    //         </div>
    //         <div className={clsx(classes.subTitle, "body-large")}>
    //           Let's pick up where you left off.
    //         </div>
    //       </div>
    //     </Step>
    //     <Step>
    //       <div className={classes.step}>
    //         <div className={clsx(classes.title, "heading-1")}>
    //           Welcome back!
    //         </div>
    //         <div className={clsx(classes.subTitle, "body-large")}>
    //           Let's pick up where you left off.
    //         </div>
    //       </div>
    //     </Step>
    //   </Stepper>
    // </div>
    <div>
      {/* <DatePickerExamples /> */}
      <SliderExamples />
    </div>
  );
};

export default OnboardingQuestionnaire;
