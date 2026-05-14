import { MODEL_PATH } from "@/helpers/constants";
import type { MuscleGroup, Workout } from "@/types/workout";
import Scene from "@/modules/explore/components/Canvas";
import SegmentedMuscleModel from "@/modules/explore/components/Model/segmented-muscle-model/SegmentedMuscleModel";

interface ModelViewerProps {
  selectedWorkout: Workout | null;
  modelKey: number;
  muscleGroups: MuscleGroup[];
}

const ModelViewer = ({
  selectedWorkout,
  modelKey,
  muscleGroups,
}: ModelViewerProps) => {
  return (
    <Scene>
      <SegmentedMuscleModel
        key={modelKey}
        path={MODEL_PATH}
        scale={0.75}
        position={[0, 0, 0]}
        primaryMuscles={selectedWorkout ? selectedWorkout.primary_muscles : []}
        secondaryMuscles={
          selectedWorkout ? selectedWorkout.secondary_muscles : []
        }
        autoRotate={!selectedWorkout}
        muscleGroups={muscleGroups}
      />
    </Scene>
  );
};

export default ModelViewer;
