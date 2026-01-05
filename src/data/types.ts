// src/data/types.ts

export interface MuscleGroup {
  id: string;
  name: string;
  mesh_names: string[]; // Names of the meshes in the 3D model that correspond to this muscle
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  primary_muscles: string[]; // IDs of primary muscles worked
  secondary_muscles: string[]; // IDs of secondary muscles worked
  instructions: string[];
  body_part?: string;
  equipment?: string;
  difficulty?: string;
  category?: string;
}
