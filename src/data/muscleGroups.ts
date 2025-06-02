// src/data/muscleGroups.ts
import { type MuscleGroup } from './types';

// Precise muscle groups database matching your Blender segmented model names
const muscleGroups: MuscleGroup[] = [
  {
    id: 'pecs',
    name: 'Pectorals (Chest)',
    meshNames: [
      'chest_clavicular_head',
      'chest_costal_head',
      'chest_sternal_head',
    ],
  },
  {
    id: 'deltoids',
    name: 'Deltoids (Shoulders)',
    meshNames: [
      'shoulders_front_deltoid',
      'shoulders_side_deltoid',
      'shoulders_rear_deltoid',
    ],
  },
  {
    id: 'biceps',
    name: 'Biceps',
    meshNames: ['biceps_long_head', 'biceps_short_head', 'biceps_brachialis'],
  },
  {
    id: 'triceps',
    name: 'Triceps',
    meshNames: [
      'triceps_lateral_head',
      'triceps_long_head',
      'triceps_medial_head',
    ],
  },
  {
    id: 'abs',
    name: 'Abdominals',
    meshNames: [
      'abs_rectus_abdominis',
      'abs_external_obliques',
      'abc_serratus_anterior',
    ],
  },
  {
    id: 'lats',
    name: 'Latissimus Dorsi (Back)',
    meshNames: ['back_lats'],
  },
  {
    id: 'quads',
    name: 'Quadriceps',
    meshNames: ['legs_quads'],
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    meshNames: ['legs_hamstrings'],
  },
  {
    id: 'glutes',
    name: 'Gluteus (Buttocks)',
    meshNames: ['legs_glutes'],
  },
  {
    id: 'calves',
    name: 'Calves',
    meshNames: ['legs_calves'],
  },
  {
    id: 'forearms',
    name: 'Forearms',
    meshNames: [
      'forearms_brachioradialis',
      'forearms_wrist_extensors',
      'forearms_wrist_flexors',
    ],
  },
  {
    id: 'traps',
    name: 'Trapezius',
    meshNames: [
      'shoulders_upper_traps',
      'back_middle_traps',
      'back_lower_traps',
    ],
  },
  // Additional muscle groups that might be useful for more comprehensive workouts
  {
    id: 'erector_spinae',
    name: 'Erector Spinae (Lower Back)',
    meshNames: ['back_erector_spinae'],
  },
  {
    id: 'rotator_cuff',
    name: 'Rotator Cuff',
    meshNames: ['shoulders_rotator_cuff'],
  },
  {
    id: 'adductors',
    name: 'Adductors (Inner Thigh)',
    meshNames: ['legs_adductors'],
  },
];

export default muscleGroups;
