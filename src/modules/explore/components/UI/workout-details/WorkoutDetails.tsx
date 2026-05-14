import React from "react";
import type { MuscleGroup, Workout } from "@/types/workout";
import classes from "./WorkoutDetails.module.css";
import clsx from "clsx";

interface WorkoutDetailsProps {
  workout: Workout;
  muscleGroups: MuscleGroup[];
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({
  workout,
  muscleGroups,
}) => {
  return (
    <div className={classes.workoutDetails}>
      <div className={clsx(classes.workoutName, "heading-2")}>
        {workout.name}
      </div>
      <div className={classes.workoutMeta}>
        <div className={classes.metaItem}>
          <div className="heading-7">Difficulty:</div>
          <div className={clsx(classes.metaItemValue, "heading-7")}>
            {workout.difficulty}
          </div>
        </div>
        <div className={classes.metaItem}>
          <div className="heading-7">Body Part:</div>
          <div className={clsx(classes.metaItemValue, "heading-7")}>
            {workout.body_part}
          </div>
        </div>
        <div className={classes.metaItem}>
          <div className="heading-7">Equipment:</div>
          <div className={clsx(classes.metaItemValue, "heading-7")}>
            {workout.equipment}
          </div>
        </div>
        <div className={classes.metaItem}>
          <div className="heading-7">Category:</div>
          <div className={clsx(classes.metaItemValue, "heading-7")}>
            {workout.category}
          </div>
        </div>
      </div>
      <div className="body-regular">{workout.description}</div>
      <div className={classes.muscleGroups}>
        {workout.primary_muscles.length > 0 && (
          <div className={`${classes.muscleGroup} ${classes.primary}`}>
            <div className={classes.headerMusclesLabel}>
              <div className={classes.colorIndicator}></div>
              <div className="heading-6">Primary Muscles:</div>
            </div>
            <ul>
              {workout.primary_muscles.map((muscleId) => {
                const muscle = muscleGroups.find((m) => m.id === muscleId);
                return (
                  muscle && (
                    <li key={muscleId} className="body-regular">
                      {muscle.name}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}

        {workout.secondary_muscles.length > 0 && (
          <div className={`${classes.muscleGroup} ${classes.secondary}`}>
            <div className={classes.headerMusclesLabel}>
              <div className={classes.colorIndicator}></div>
              <div className="heading-6">Secondary Muscles:</div>
            </div>
            <ul>
              {workout.secondary_muscles.map((muscleId) => {
                const muscle = muscleGroups.find((m) => m.id === muscleId);
                return (
                  muscle && (
                    <li key={muscleId} className="body-regular">
                      {muscle.name}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetails;
