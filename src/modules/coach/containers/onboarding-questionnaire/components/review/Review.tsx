import { clsx } from "clsx";
import classes from "./Review.module.css";

const Review = () => {
  return (
    <div className={classes.reviewContainer}>
      <div className={clsx(classes.review, classes.step)}>
        <div className={clsx(classes.title, "heading-1")}>
          You're Almost there!
        </div>
        <p className={clsx(classes.reviewContent, "body-large")}>
          You're about to share the details that will help us start tailoring
          workouts and guidance to suit you better.
        </p>
        <p className={clsx(classes.reviewContent, "body-large")}>
          You can <b>update or change any of your answers anytime</b> by going
          to: <b>Settings → Profile → "Help Us Know You"</b>
        </p>
        <p className={clsx(classes.reviewContent, "body-large")}>
          What you've answered so far covers the essentials to get started. If
          you'd like even{" "}
          <b>more personalized workout plans, advice, and insights,</b>
          we encourage you to complete the rest of your profile by visiting the
          same section later.
        </p>
        <p className={clsx(classes.reviewContent, "body-large")}>
          Every bit of information helps our AI understand you better and make
          smarter recommendations.
        </p>
        <p className={clsx(classes.reviewContent, "body-large")}>
          <b>
            All the best on your fitness journey — we're excited to be part of
            it! 💪
          </b>
        </p>
      </div>
    </div>
  );
};

export default Review;
