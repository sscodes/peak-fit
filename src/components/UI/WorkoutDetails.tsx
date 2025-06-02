// src/components/UI/WorkoutDetails.tsx
import React from 'react';
import { type Workout } from '../../data/types';
import muscleGroups from '../../data/muscleGroups';

interface WorkoutDetailsProps {
  workout: Workout;
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ workout }) => {
  return (
    <div className="workout-details">
      <h2>{workout.name}</h2>
      <div className="muscle-groups">
        <div className="muscle-group primary">
          <div className="color-indicator"></div>
          <h3>Primary Muscles:</h3>
          <ul>
            {workout.primaryMuscles.map(muscleId => {
              const muscle = muscleGroups.find(m => m.id === muscleId);
              return muscle && <li key={muscleId}>{muscle.name}</li>;
            })}
          </ul>
        </div>
        
        <div className="muscle-group secondary">
          <div className="color-indicator"></div>
          <h3>Secondary Muscles:</h3>
          <ul>
            {workout.secondaryMuscles.map(muscleId => {
              const muscle = muscleGroups.find(m => m.id === muscleId);
              return muscle && <li key={muscleId}>{muscle.name}</li>;
            })}
          </ul>
        </div>
      </div>
      
      <div className="instructions">
        <h3>Instructions:</h3>
        <p>{workout.instructions}</p>
      </div>
    </div>
  );
};

export default WorkoutDetails;