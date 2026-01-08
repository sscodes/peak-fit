import clsx from "clsx";
import type { Workout } from "../../../../../types/workout";
import classes from "./WorkoutInstructions.module.css";

interface WorkoutInstructionsProps {
  workout: Workout;
}

const WorkoutInstructions = ({ workout }: WorkoutInstructionsProps) => {
  return (
    <div className={classes.workoutInstructions}>
      <div className={classes.instructions}>
        <div className={clsx(classes.instructionsLabel, "heading-3")}>
          Instructions:
        </div>
        <ul>
          {workout.instructions.map((instruction, index) => (
            <li
              key={`${instruction.substring(0, 20)}-${index}`}
              className="body-regular"
            >
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutInstructions;
