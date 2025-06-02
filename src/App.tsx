// src/App.tsx
import React, { useState } from 'react';
import {
  Scene,
  Sidebar,
  WorkoutDetails,
  NoSelectionMessage,
  ZoomControls,
} from './components';
import workouts from './data/workouts';
import { type Workout } from './data/types';
import useFilteredWorkouts from './hooks/useFilteredWorkouts';
import './App.css';

// Import the segmented model component
import SegmentedMuscleModel from './components/Model/SegmentedMuscleModel';

const App: React.FC = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const { searchTerm, setSearchTerm, filteredWorkouts } =
    useFilteredWorkouts(workouts);

  // Path to your new segmented model file
  const MODEL_PATH = '/models/human_anatomy_segmented.glb'; // Update this path

  // Force re-render when workout changes
  const [modelKey, setModelKey] = useState(0);

  const handleWorkoutChange = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModelKey((prev) => prev + 1);
  };

  return (
    <div className='workout-visualizer'>
      {/* Left sidebar for workout selection */}
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredWorkouts={filteredWorkouts}
        selectedWorkout={selectedWorkout}
        setSelectedWorkout={handleWorkoutChange}
      />

      {/* Main 3D view */}
      <div className='main-view'>
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

export default App;
