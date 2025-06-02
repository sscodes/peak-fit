// src/data/types.ts

export interface MuscleGroup {
  id: string;
  name: string;
  meshNames: string[]; // Names of the meshes in the 3D model that correspond to this muscle
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  primaryMuscles: string[]; // IDs of primary muscles worked
  secondaryMuscles: string[]; // IDs of secondary muscles worked
  instructions: string;
}
