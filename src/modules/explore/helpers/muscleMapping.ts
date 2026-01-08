/**
 * Comprehensive muscle mapping between ExerciseDB terminology and your custom 3D model mesh names
 */

/**
 * Maps ExerciseDB "target" names (standardized) to your muscle group IDs
 * Based on actual ExerciseDB data: 19 unique target values
 */
const TARGET_TO_MUSCLE_ID: Record<string, string[]> = {
  // Core muscles
  abs: ["abs"],
  "serratus anterior": ["abs"], // Serratus is part of your abs group

  // Chest
  pectorals: ["pecs"],

  // Back
  lats: ["lats"],
  traps: ["traps"],
  "upper back": ["upper_back"], // Use the compound group
  spine: ["erector_spinae"],
  "levator scapulae": ["traps"], // Part of upper trap region

  // Shoulders
  delts: ["deltoids"],

  // Arms
  biceps: ["biceps"],
  triceps: ["triceps"],
  forearms: ["forearms"],

  // Legs
  quads: ["quads"],
  hamstrings: ["hamstrings"],
  glutes: ["glutes"],
  calves: ["calves"],
  adductors: ["adductors"],
  abductors: ["glutes"], // Abductors are primarily glute medius/minimus

  // Special cases
  "cardiovascular system": [], // No specific mesh to highlight
};

/**
 * Maps ExerciseDB "secondaryMuscles" names (descriptive/generic) to your muscle group IDs
 * Based on actual ExerciseDB data: 40 unique secondary muscle values
 */
const SECONDARY_MUSCLE_TO_ID: Record<string, string[]> = {
  // Core variations
  abs: ["abs"],
  core: ["abs"],
  abdominals: ["abs"],
  obliques: ["abs"],
  "serratus anterior": ["abs"],
  "lower abs": ["abs"],

  // Chest variations
  chest: ["pecs"],
  pectorals: ["pecs"],
  pecs: ["pecs"],
  "upper chest": ["upper_chest"],

  // Back variations
  lats: ["lats"],
  "latissimus dorsi": ["lats"],
  "lower back": ["erector_spinae"],
  "erector spinae": ["erector_spinae"],
  "spinal erectors": ["erector_spinae"],
  back: ["lats", "traps"],
  "upper back": ["upper_back"],
  traps: ["traps"],
  trapezius: ["traps"],
  rhomboids: ["traps"], // Part of middle trap region
  "levator scapulae": ["traps"],

  // Shoulder variations
  shoulders: ["deltoids"],
  delts: ["deltoids"],
  deltoids: ["deltoids"],
  "rear deltoids": ["rear_delts"],
  "rotator cuff": ["rotator_cuff"],

  // Arm variations
  biceps: ["biceps"],
  triceps: ["triceps"],
  forearms: ["forearms"],
  brachialis: ["biceps"], // Part of biceps group in your model
  brachioradialis: ["forearms"],
  "wrist flexors": ["forearms"],
  "wrist extensors": ["forearms"],
  wrists: ["forearms"],
  "grip muscles": ["forearms"],
  hands: ["forearms"],

  // Leg variations
  quads: ["quads"],
  quadriceps: ["quads"],
  hamstrings: ["hamstrings"],
  glutes: ["glutes"],
  gluteus: ["glutes"],
  calves: ["calves"],
  gastrocnemius: ["calves"],
  soleus: ["calves"],
  shins: ["calves"], // Tibialis anterior (front of shin, close enough to calves)

  // Inner/outer thigh
  adductors: ["adductors"],
  "inner thighs": ["adductors"],
  groin: ["adductors"],
  abductors: ["glutes"],
  "outer thighs": ["glutes"],

  // Hip region (generic terms)
  "hip flexors": ["abs", "quads"], // Involves rectus femoris (quad) and iliopsoas (abs region)
  hips: ["glutes", "adductors"],

  // Stabilizers and extremities
  "ankle stabilizers": [], // No specific mesh
  ankles: [], // No specific mesh
  feet: [], // No specific mesh
  sternocleidomastoid: [], // Neck muscle, not in your model

  // Catch-all (don't highlight)
  stabilizers: [],
  "cardiovascular system": [],
};

/**
 * Normalizes muscle names from ExerciseDB
 * Handles case variations, plurals, and common aliases
 */
function normalizeMuscleNames(muscleName: string): string {
  return muscleName.toLowerCase().trim().replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Converts ExerciseDB target muscle to your muscle group IDs
 */
export function mapTargetToMuscleIds(target: string): string[] {
  const normalized = normalizeMuscleNames(target);
  return TARGET_TO_MUSCLE_ID[normalized] || [];
}

/**
 * Converts ExerciseDB secondary muscle names to your muscle group IDs
 * Handles the inconsistent naming in secondaryMuscles array
 */
export function mapSecondaryMusclesToIds(secondaryMuscles: string[]): string[] {
  const muscleIds = new Set<string>();

  secondaryMuscles.forEach((muscle) => {
    const normalized = normalizeMuscleNames(muscle);
    const ids = SECONDARY_MUSCLE_TO_ID[normalized];

    if (ids && ids.length > 0) {
      ids.forEach((id) => muscleIds.add(id));
    } else {
      // Log unmapped muscles for debugging
      console.warn(`⚠️ Unmapped secondary muscle: "${muscle}"`);
    }
  });

  return Array.from(muscleIds);
}








// ----------------------------------------------------------------------------------------------------------------------------------------------------








/**
 * Gets all mesh names for a given muscle group ID
 */
export function getMeshNamesForMuscleId(
  muscleId: string,
  muscleGroups: Array<{ id: string; mesh_names: string[] }>
): string[] {
  const group = muscleGroups.find((g) => g.id === muscleId);
  return group?.mesh_names || [];
}

/**
 * Complete transformation: ExerciseDB exercise → mesh names for 3D highlighting
 */
export function getHighlightedMeshes(
  target: string,
  secondaryMuscles: string[],
  muscleGroups: Array<{ id: string; mesh_names: string[] }>
): {
  primaryMeshes: string[];
  secondaryMeshes: string[];
} {
  // Map target to muscle IDs
  const primaryMuscleIds = mapTargetToMuscleIds(target);

  // Map secondary muscles to muscle IDs
  const secondaryMuscleIds = mapSecondaryMusclesToIds(secondaryMuscles);

  // Remove duplicates (if secondary includes primary)
  const uniqueSecondaryIds = secondaryMuscleIds.filter(
    (id) => !primaryMuscleIds.includes(id)
  );

  // Convert muscle IDs to mesh names
  const primaryMeshes = primaryMuscleIds.flatMap((id) =>
    getMeshNamesForMuscleId(id, muscleGroups)
  );

  const secondaryMeshes = uniqueSecondaryIds.flatMap((id) =>
    getMeshNamesForMuscleId(id, muscleGroups)
  );

  return {
    primaryMeshes,
    secondaryMeshes,
  };
}

/**
 * Validates if a muscle name is recognized
 * Useful for debugging and data quality checks
 */
export function isRecognizedMuscle(muscleName: string): boolean {
  const normalized = normalizeMuscleNames(muscleName);
  return (
    normalized in TARGET_TO_MUSCLE_ID || normalized in SECONDARY_MUSCLE_TO_ID
  );
}

/**
 * Gets all unrecognized muscles from a list
 * Useful for identifying gaps in your mapping
 */
export function getUnrecognizedMuscles(muscleNames: string[]): string[] {
  return muscleNames.filter((name) => !isRecognizedMuscle(name));
}

/**
 * Statistics helper for debugging
 */
export function getMappingStats(
  exercises: Array<{ target: string; secondaryMuscles: string[] }>
) {
  const allSecondaryMuscles = new Set<string>();
  const unmappedMuscles = new Set<string>();

  exercises.forEach((exercise) => {
    exercise.secondaryMuscles.forEach((muscle) => {
      const normalized = normalizeMuscleNames(muscle);
      allSecondaryMuscles.add(normalized);

      if (!isRecognizedMuscle(muscle)) {
        unmappedMuscles.add(normalized);
      }
    });
  });

  return {
    totalUniqueSecondaryMuscles: allSecondaryMuscles.size,
    unmappedCount: unmappedMuscles.size,
    unmappedMuscles: Array.from(unmappedMuscles),
    coveragePercent: (
      ((allSecondaryMuscles.size - unmappedMuscles.size) /
        allSecondaryMuscles.size) *
      100
    ).toFixed(1),
  };
}
