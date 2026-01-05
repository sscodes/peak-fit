// src/data/muscleGroups.ts
import { type MuscleGroup } from "./types";

/**
 * Comprehensive muscle groups database for fitness and workout programming
 *
 * Structure:
 * - Primary anatomical groups (15) - Main muscle groups
 * - Subdivided groups (8) - Specific training targets (upper chest, front delts, etc.)
 * - Functional groups (5) - Movement-based groupings (push, pull, etc.)
 *
 * Total: 31 muscle group definitions using 29 unique meshes
 */

// ============================================
// PRIMARY ANATOMICAL GROUPS (Original 15)
// ============================================

const muscleGroups: MuscleGroup[] = [
  // CHEST
  {
    id: "pecs",
    name: "Pectorals (Chest)",
    mesh_names: [
      "chest_clavicular_head",
      "chest_costal_head",
      "chest_sternal_head",
    ],
  },

  // SHOULDERS
  {
    id: "deltoids",
    name: "Deltoids (Shoulders)",
    mesh_names: [
      "shoulders_front_deltoid",
      "shoulders_side_deltoid",
      "shoulders_rear_deltoid",
    ],
  },
  {
    id: "rotator_cuff",
    name: "Rotator Cuff",
    mesh_names: ["shoulders_rotator_cuff"],
  },

  // ARMS
  {
    id: "biceps",
    name: "Biceps",
    mesh_names: ["biceps_long_head", "biceps_short_head", "biceps_brachialis"],
  },
  {
    id: "triceps",
    name: "Triceps",
    mesh_names: [
      "triceps_lateral_head",
      "triceps_long_head",
      "triceps_medial_head",
    ],
  },
  {
    id: "forearms",
    name: "Forearms",
    mesh_names: [
      "forearms_brachioradialis",
      "forearms_wrist_extensors",
      "forearms_wrist_flexors",
    ],
  },

  // CORE
  {
    id: "abs",
    name: "Abdominals",
    mesh_names: [
      "abs_rectus_abdominis",
      "abs_external_obliques",
      "abc_serratus_anterior",
    ],
  },

  // BACK
  {
    id: "lats",
    name: "Latissimus Dorsi (Lats)",
    mesh_names: ["back_lats"],
  },
  {
    id: "traps",
    name: "Trapezius",
    mesh_names: [
      "shoulders_upper_traps",
      "back_middle_traps",
      "back_lower_traps",
    ],
  },
  {
    id: "erector_spinae",
    name: "Erector Spinae (Lower Back)",
    mesh_names: ["back_erector_spinae"],
  },

  // LEGS
  {
    id: "quads",
    name: "Quadriceps",
    mesh_names: ["legs_quads"],
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    mesh_names: ["legs_hamstrings"],
  },
  {
    id: "glutes",
    name: "Gluteus (Buttocks)",
    mesh_names: ["legs_glutes"],
  },
  {
    id: "calves",
    name: "Calves",
    mesh_names: ["legs_calves"],
  },
  {
    id: "adductors",
    name: "Adductors (Inner Thigh)",
    mesh_names: ["legs_adductors"],
  },

  // ============================================
  // SUBDIVIDED GROUPS (For Specific Training)
  // ============================================

  // Chest subdivisions
  {
    id: "upper_chest",
    name: "Upper Chest",
    mesh_names: ["chest_clavicular_head"],
  },
  {
    id: "mid_chest",
    name: "Mid Chest",
    mesh_names: ["chest_costal_head"],
  },
  {
    id: "lower_chest",
    name: "Lower Chest",
    mesh_names: ["chest_sternal_head"],
  },

  // Shoulder subdivisions
  {
    id: "front_delts",
    name: "Front Deltoids",
    mesh_names: ["shoulders_front_deltoid"],
  },
  {
    id: "side_delts",
    name: "Side Deltoids",
    mesh_names: ["shoulders_side_deltoid"],
  },
  {
    id: "rear_delts",
    name: "Rear Deltoids",
    mesh_names: ["shoulders_rear_deltoid"],
  },

  // Core subdivisions
  {
    id: "obliques",
    name: "Obliques",
    mesh_names: ["abs_external_obliques"],
  },
  {
    id: "six_pack",
    name: "Rectus Abdominis (Six Pack)",
    mesh_names: ["abs_rectus_abdominis"],
  },

  // ============================================
  // FUNCTIONAL GROUPS (Movement Patterns)
  // ============================================

  {
    id: "push_muscles",
    name: "Push Muscles",
    mesh_names: [
      // Chest
      "chest_clavicular_head",
      "chest_costal_head",
      "chest_sternal_head",
      // Shoulders
      "shoulders_front_deltoid",
      "shoulders_side_deltoid",
      "shoulders_rear_deltoid",
      // Triceps
      "triceps_lateral_head",
      "triceps_long_head",
      "triceps_medial_head",
    ],
  },

  {
    id: "pull_muscles",
    name: "Pull Muscles",
    mesh_names: [
      // Back
      "back_lats",
      "back_middle_traps",
      "back_lower_traps",
      "shoulders_upper_traps",
      // Biceps
      "biceps_long_head",
      "biceps_short_head",
      "biceps_brachialis",
      // Forearms
      "forearms_brachioradialis",
      "forearms_wrist_extensors",
      "forearms_wrist_flexors",
    ],
  },

  {
    id: "core",
    name: "Core (Complete)",
    mesh_names: [
      "abs_rectus_abdominis",
      "abs_external_obliques",
      "abc_serratus_anterior",
      "back_erector_spinae",
    ],
  },

  {
    id: "upper_body",
    name: "Upper Body",
    mesh_names: [
      // Chest
      "chest_clavicular_head",
      "chest_costal_head",
      "chest_sternal_head",
      // Back
      "back_lats",
      "back_middle_traps",
      "back_lower_traps",
      "shoulders_upper_traps",
      // Shoulders
      "shoulders_front_deltoid",
      "shoulders_side_deltoid",
      "shoulders_rear_deltoid",
      "shoulders_rotator_cuff",
      // Arms
      "biceps_long_head",
      "biceps_short_head",
      "biceps_brachialis",
      "triceps_lateral_head",
      "triceps_long_head",
      "triceps_medial_head",
      "forearms_brachioradialis",
      "forearms_wrist_extensors",
      "forearms_wrist_flexors",
    ],
  },

  {
    id: "lower_body",
    name: "Lower Body",
    mesh_names: [
      "legs_quads",
      "legs_hamstrings",
      "legs_glutes",
      "legs_calves",
      "legs_adductors",
    ],
  },

  // ============================================
  // ADDITIONAL COMPOUND GROUPS
  // ============================================

  {
    id: "posterior_chain",
    name: "Posterior Chain",
    mesh_names: [
      "legs_hamstrings",
      "legs_glutes",
      "back_erector_spinae",
      "back_lats",
      "back_middle_traps",
      "back_lower_traps",
    ],
  },

  {
    id: "upper_back",
    name: "Upper Back",
    mesh_names: [
      "back_lats",
      "back_middle_traps",
      "back_lower_traps",
      "shoulders_upper_traps",
      "shoulders_rear_deltoid",
    ],
  },

  {
    id: "arms",
    name: "Arms (Complete)",
    mesh_names: [
      "biceps_long_head",
      "biceps_short_head",
      "biceps_brachialis",
      "triceps_lateral_head",
      "triceps_long_head",
      "triceps_medial_head",
      "forearms_brachioradialis",
      "forearms_wrist_extensors",
      "forearms_wrist_flexors",
    ],
  },
];

export default muscleGroups;

/**
 * USAGE GUIDE:
 *
 * Primary Groups (15):
 * - Use for standard exercise mapping from ExerciseDB
 * - Example: "target: biceps" → biceps group
 *
 * Subdivided Groups (8):
 * - Use for specialized exercises (incline bench → upper_chest)
 * - Use for targeted workout programs
 * - Example: "Shoulder day focusing on rear delts"
 *
 * Functional Groups (5):
 * - Use for workout split programming (Push/Pull/Legs)
 * - Use for full-body visualizations
 * - Example: "Show all muscles worked in a push day"
 *
 * Compound Groups (3):
 * - Use for exercise categories (deadlifts → posterior_chain)
 * - Use for workout analysis
 */
