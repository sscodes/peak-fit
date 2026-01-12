import React from "react";
import { MODEL_PATH } from "../../../helpers/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  useInfiniteWorkouts,
  useMuscleGroups,
  useSearchWorkouts,
} from "../../../services/workouts/workouts.data";
import type { Workout } from "../../../types/workout";
import { Scene } from "../components";
import SegmentedMuscleModel from "../components/Model/segmented-muscle-model/SegmentedMuscleModel";
import {
  NoSelectionMessage,
  Sidebar,
  WorkoutDetails,
  WorkOutDetailsSmall,
  WorkoutInstructions,
} from "../components/UI";
import classes from "./Explore.module.css";

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedWorkout, setSelectedWorkout] = React.useState<Workout | null>(
    null
  );

  const debouncedSearch = useDebounce(searchTerm);

  const { data: filteredWorkouts, isFetching: isFilterWorkoutsFetching } =
    useSearchWorkouts(debouncedSearch);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess: isSuccessWorkouts,
  } = useInfiniteWorkouts(10);

  const workouts = data?.pages.flat() ?? [];
  const { data: muscleGroups, isSuccess: isSuccessMuscleGroups } =
    useMuscleGroups();

  // Force re-render when workout changes
  const [modelKey, setModelKey] = React.useState(0);

  const handleWorkoutChange = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModelKey((prev) => prev + 1);
  };

  const isMedium = useMediaQuery("825px");

  return (
    isSuccessWorkouts &&
    isSuccessMuscleGroups && (
      <div className={classes.workoutVisualizer}>
        {/* Left sidebar for workout selection */}
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredWorkouts={searchTerm.length > 0 ? filteredWorkouts : workouts}
          selectedWorkout={selectedWorkout}
          setSelectedWorkout={handleWorkoutChange}
          isFilterWorkoutsFetching={isFilterWorkoutsFetching}
          fetchNextPage={fetchNextPage} // Pass the function
          hasMore={hasNextPage ?? false} // Use hasNextPage from query
          isFetchingNextPage={isFetchingNextPage} // Pass loading state
        />

        {/* Main 3D view */}
        <div className={classes.mainView}>
          {/* Workout details overlay */}
          {!isMedium && selectedWorkout && (
            <WorkoutDetails
              workout={selectedWorkout}
              muscleGroups={muscleGroups}
            />
          )}
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

          {/* Workout instructions overlay */}
          {!isMedium && selectedWorkout && (
            <WorkoutInstructions workout={selectedWorkout} />
          )}

          {/* Message when no workout is selected */}
          {!selectedWorkout && <NoSelectionMessage />}
        </div>

        {/* Slide up panel for mobile - example content */}
        {isMedium && selectedWorkout && (
          <WorkOutDetailsSmall
            selectedWorkout={selectedWorkout}
            muscleGroups={muscleGroups}
          />
        )}
      </div>
    )
  );
};

export default Explore;
