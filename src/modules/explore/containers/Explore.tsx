// src/pages/Explore/Explore.tsx
import React, { useState } from "react";
import useFilteredWorkouts from "../../../hooks/useFilteredWorkouts";
import {
  useMuscleGroups,
  usePaginatedWorkouts,
} from "../../../services/workouts/workouts.data";
import type { Workout } from "../../../types/workout";
import {
  NoSelectionMessage,
  Scene,
  Sidebar,
  WorkoutDetails,
} from "../components";
import SegmentedMuscleModel from "../components/Model/segmented-muscle-model/SegmentedMuscleModel";
import styles from "./Explore.module.css";

const Explore: React.FC = () => {
  const { data: workouts, isSuccess: isSuccessWorkouts } =
    usePaginatedWorkouts();
  const { data: muscleGroups, isSuccess: isSuccessMuscleGroups } =
    useMuscleGroups();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const { searchTerm, setSearchTerm, filteredWorkouts } = useFilteredWorkouts(
    workouts ?? []
  );

  // Path to your segmented model file
  const MODEL_PATH = "/models/human_anatomy_segmented.glb";

  // Force re-render when workout changes
  const [modelKey, setModelKey] = useState(0);

  const handleWorkoutChange = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModelKey((prev) => prev + 1);
  };

  return (
    isSuccessWorkouts &&
    isSuccessMuscleGroups && (
      <div className={styles.workoutVisualizer}>
        {/* Left sidebar for workout selection */}
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredWorkouts={searchTerm.length > 0 ? filteredWorkouts : workouts}
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
                selectedWorkout ? selectedWorkout.primary_muscles : []
              }
              secondaryMuscles={
                selectedWorkout ? selectedWorkout.secondary_muscles : []
              }
              autoRotate={!selectedWorkout}
              muscleGroups={muscleGroups}
            />
          </Scene>

          {/* Workout details overlay */}
          {selectedWorkout && (
            <WorkoutDetails
              workout={selectedWorkout}
              muscleGroups={muscleGroups}
            />
          )}

          {/* Message when no workout is selected */}
          {!selectedWorkout && <NoSelectionMessage />}
        </div>
      </div>
    )
  );
};

export default Explore;
