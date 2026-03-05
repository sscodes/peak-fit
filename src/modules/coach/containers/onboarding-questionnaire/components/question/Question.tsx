import clsx from "clsx";
import type { QuestionWithSectionMeta } from "../../../../../../types/questions";
import classes from "./Question.module.css";
import Input from "../../../../../../components/input/Input";
import Icon from "../../../../../../components/icon/Icon";

const Question = ({ question }: { question: QuestionWithSectionMeta }) => {
  console.log("Rendering Question Component with question:", question); // Debug log
  return (
    <div className={classes.step}>
      <div className={classes.subContainer}>
        <div className={classes.iconContainer}>
          <Icon name={question.section_icon} size={48} />
        </div>
        <div className={clsx(classes.title, "heading-1")}>
          {question.section_title}
        </div>
        <div className={clsx(classes.subTitle, "heading-5")}>
          {question.section_description}
        </div>
        <Input
          label={question.label}
          id={question.id}
          type={question.input_type}
        />
      </div>
    </div>
  );
};

export default Question;
