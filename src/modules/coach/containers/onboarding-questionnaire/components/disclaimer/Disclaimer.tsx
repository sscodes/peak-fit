import clsx from "clsx";
import classes from "./Disclaimer.module.css";

const Disclaimer = () => {
  return (
    <div className={classes.disclaimerContainer}>
      <div className={clsx(classes.disclaimer, classes.step)}>
        <div className={clsx(classes.title, "heading-1")}>Before We Begin</div>
        <p className={clsx(classes.disclaimerContent, "body-large")}>
          To help us create workout plans that actually work for you, we'll ask
          a few simple questions about your body, lifestyle, and fitness goals.
        </p>
        <p className={clsx(classes.disclaimerContent, "body-large")}>
          Nothing scary — no tests, no jargon, no pressure. Just basic details
          that help our AI understand who you are, instead of giving you a
          one-size-fits-all workout.
        </p>
        <div className={clsx(classes.disclaimerContent, "body-large")}>
          Why this matters 👇
          <ul>
            <li>Everyone's body is different</li>
            <li>
              A generic workout can be ineffective — or even <b>unsafe</b>
            </li>
            <li>
              Personal details help us tailor intensity, exercises, pace, and
              recovery to <i>you</i>
            </li>
          </ul>
        </div>
        <p className={clsx(classes.disclaimerContent, "body-large")}>
          You can get started with just a few essentials. If you'd like, you can
          share more details later to help us fine-tune your plan even further.
        </p>
        <p className={clsx(classes.disclaimerContent, "body-large")}>
          We only use this information to improve your fitness experience.
        </p>
        <p className={clsx(classes.disclaimerContent, "body-large")}>
          Let's build a fitness plan that fits your life 💪
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
