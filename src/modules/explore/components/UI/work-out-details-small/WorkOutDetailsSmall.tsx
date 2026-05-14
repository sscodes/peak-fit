import clsx from "clsx";
import React, { useRef, useState } from "react";
import { SlInfo, SlClose } from "react-icons/sl";
import type { MuscleGroup, Workout } from "@/types/workout";
import classes from "./WorkOutDetailsSmall.module.css";

interface WorkOutDetailsSmallProps {
  selectedWorkout: Workout;
  muscleGroups: MuscleGroup[];
}

const WorkOutDetailsSmall: React.FC<WorkOutDetailsSmallProps> = ({
  selectedWorkout,
  muscleGroups,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      className={`${classes.slideUpPanel} ${isOpen ? classes.open : ""}`}
    >
      {/* Handle area */}
      <div className={classes.handle} onClick={() => setIsOpen(true)}>
        <SlInfo className={classes.icon} />
      </div>

      {/* Content area */}
      <div className={classes.content}>
        <div className={classes.headerSection}>
          <div className={clsx(classes.header, "heading-3")}>Quick Info</div>
          <SlClose className={classes.icon} onClick={() => setIsOpen(false)} />
        </div>
        <div className={classes.container}>
          <div className={classes.workoutMeta}>
            <div className={classes.metaItem}>
              <div className="heading-6">Workout:</div>
              <div className={clsx(classes.metaItemValue, "heading-6")}>
                {selectedWorkout.name}
              </div>
            </div>
            <div className={classes.metaItem}>
              <div className="heading-6">Difficulty:</div>
              <div className={clsx(classes.metaItemValue, "heading-6")}>
                {selectedWorkout.difficulty}
              </div>
            </div>
            <div className={classes.metaItem}>
              <div className="heading-6">Body Part:</div>
              <div className={clsx(classes.metaItemValue, "heading-6")}>
                {selectedWorkout.body_part}
              </div>
            </div>
            <div className={classes.metaItem}>
              <div className="heading-6">Equipment:</div>
              <div className={clsx(classes.metaItemValue, "heading-6")}>
                {selectedWorkout.equipment}
              </div>
            </div>
            <div className={classes.metaItem}>
              <div className="heading-6">Category:</div>
              <div className={clsx(classes.metaItemValue, "heading-6")}>
                {selectedWorkout.category}
              </div>
            </div>
          </div>
          <div className="body-regular">{selectedWorkout.description}</div>
          <div className={classes.muscleGroups}>
            <div className={`${classes.muscleGroup} ${classes.primary}`}>
              <div className={classes.headerMusclesLabel}>
                <div className={classes.colorIndicator}></div>
                <div className="heading-6">Primary Muscles:</div>
              </div>
              <ul>
                {selectedWorkout.primary_muscles.map((muscleId) => {
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

            {selectedWorkout.secondary_muscles.length > 0 && (
              <div className={`${classes.muscleGroup} ${classes.secondary}`}>
                <div className={classes.headerMusclesLabel}>
                  <div className={classes.colorIndicator}></div>
                  <div className="heading-6">Secondary Muscles:</div>
                </div>
                <ul>
                  {selectedWorkout.secondary_muscles.map((muscleId) => {
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
          <div className={classes.instructions}>
            <div className={clsx(classes.instructionsLabel, "heading-3")}>
              Instructions:
            </div>
            <ul>
              {selectedWorkout.instructions.map((instruction, index) => (
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
      </div>
    </div>
  );
};

export default WorkOutDetailsSmall;
