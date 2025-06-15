// src/pages/Home/Home.tsx
import React, { useState } from 'react';
import {
  Scene,
  Sidebar,
  WorkoutDetails,
  NoSelectionMessage,
  ZoomControls,
} from '../components';
import workouts from '../../../data/workouts';
import type { Workout } from '../../../data/types';
import useFilteredWorkouts from '../../../hooks/useFilteredWorkouts';
import SegmentedMuscleModel from '../components/Model/segmented-muscle-model/SegmentedMuscleModel';

// Import CSS modules
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const { searchTerm, setSearchTerm, filteredWorkouts } =
    useFilteredWorkouts(workouts);

  // Path to your segmented model file
  const MODEL_PATH = '/models/human_anatomy_segmented.glb';

  // Force re-render when workout changes
  const [modelKey, setModelKey] = useState(0);

  const handleWorkoutChange = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModelKey((prev) => prev + 1);
  };

  return (
    <div className={styles.workoutVisualizer}>
      {/* Left sidebar for workout selection */}
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredWorkouts={filteredWorkouts}
        selectedWorkout={selectedWorkout}
        setSelectedWorkout={handleWorkoutChange}
      />

      {/* Main 3D view */}
      <div className={styles.mainView}>
        <Scene>
          {/* Segmented model that works with separate meshes */}
          <SegmentedMuscleModel
            key={modelKey}
            path={MODEL_PATH}
            scale={0.75}
            position={[0, 0, 0]}
            primaryMuscles={
              selectedWorkout ? selectedWorkout.primaryMuscles : []
            }
            secondaryMuscles={
              selectedWorkout ? selectedWorkout.secondaryMuscles : []
            }
            autoRotate={!selectedWorkout}
          />
        </Scene>

        {/* Workout details overlay */}
        {selectedWorkout && <WorkoutDetails workout={selectedWorkout} />}

        {/* Message when no workout is selected */}
        {!selectedWorkout && <NoSelectionMessage />}

        {/* Zoom controls */}
        <ZoomControls />
      </div>
    </div>
  );
};

export default Home;
