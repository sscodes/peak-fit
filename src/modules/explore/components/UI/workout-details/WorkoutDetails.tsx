// src/components/UI/WorkoutDetails.tsx
import React from 'react';
import type { Workout } from '../../../../../data/types';
import muscleGroups from '../../../../../data/muscleGroups';
import styles from './WorkoutDetails.module.css';

interface WorkoutDetailsProps {
  workout: Workout;
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ workout }) => {
  return (
    <div className={styles.workoutDetails}>
      <h2>{workout.name}</h2>
      <div className={styles.muscleGroups}>
        <div className={`${styles.muscleGroup} ${styles.primary}`}>
          <div className={styles.colorIndicator}></div>
          <h3>Primary Muscles:</h3>
          <ul>
            {workout.primaryMuscles.map((muscleId) => {
              const muscle = muscleGroups.find((m) => m.id === muscleId);
              return muscle && <li key={muscleId}>{muscle.name}</li>;
            })}
          </ul>
        </div>

        <div className={`${styles.muscleGroup} ${styles.secondary}`}>
          <div className={styles.colorIndicator}></div>
          <h3>Secondary Muscles:</h3>
          <ul>
            {workout.secondaryMuscles.map((muscleId) => {
              const muscle = muscleGroups.find((m) => m.id === muscleId);
              return muscle && <li key={muscleId}>{muscle.name}</li>;
            })}
          </ul>
        </div>
      </div>

      <div className={styles.instructions}>
        <h3>Instructions:</h3>
        <p>{workout.instructions}</p>
      </div>
    </div>
  );
};

export default WorkoutDetails;
