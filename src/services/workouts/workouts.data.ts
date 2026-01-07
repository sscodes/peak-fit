// src/data/workouts.data.ts
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { WorkoutService } from "./workouts.service";
import type { MuscleGroup, Workout } from "../../types/workout";

/**
 * Singleton instance of WorkoutsService
 */
const ws = new WorkoutService();

/**
 * Query Keys for React Query caching
 */
export const workoutKeys = {
  all: ["workouts"] as const,
  lists: () => [...workoutKeys.all, "list"] as const,
  list: (filters: string) => [...workoutKeys.lists(), { filters }] as const,
  details: () => [...workoutKeys.all, "detail"] as const,
  detail: (id: string) => [...workoutKeys.details(), id] as const,
  body_part: (body_part: string) =>
    [...workoutKeys.all, "body_part", body_part] as const,
  equipment: (equipment: string) =>
    [...workoutKeys.all, "equipment", equipment] as const,
  target: (target: string) => [...workoutKeys.all, "target", target] as const,
  search: (name: string) => [...workoutKeys.all, "search", name] as const,
  metadata: {
    bodyParts: ["workouts", "metadata", "body-parts"] as const,
    equipment: ["workouts", "metadata", "equipment"] as const,
    targets: ["workouts", "metadata", "targets"] as const,
  },
  muscleGroupLists: () => [...workoutKeys.all, "muscle-groups"] as const,
};

/**
 * Hook: Get all workouts (1300+)
 * ⚠️ Use with caution - large dataset
 */
export const useGetAllWorkouts = (
  options?: Omit<UseQueryOptions<Workout[], Error>, "queryKey" | "queryFn">
): UseQueryResult<Workout[], Error> => {
  return useQuery<Workout[], Error>({
    queryKey: workoutKeys.lists(),
    queryFn: () => ws.getAllWorkouts(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours (formerly cacheTime)
    ...options,
  });
};

/**
 * Hook: Get paginated workouts
 * Recommended for initial loading
 */
export const usePaginatedWorkouts = (
  limit: number = 20,
  offset: number = 0,
  options?: Omit<UseQueryOptions<Workout[], Error>, "queryKey" | "queryFn">
): UseQueryResult<Workout[], Error> => {
  return useQuery<Workout[], Error>({
    queryKey: [...workoutKeys.lists(), "paginated", limit, offset],
    queryFn: () => ws.getWorkoutsPaginated(limit, offset),
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Get workouts by body part
 */
export const useWorkoutsByBodyPart = (
  body_part: string,
  options?: Omit<UseQueryOptions<Workout[], Error>, "queryKey" | "queryFn">
): UseQueryResult<Workout[], Error> => {
  return useQuery<Workout[], Error>({
    queryKey: workoutKeys.body_part(body_part),
    queryFn: () => ws.getWorkoutsByBodyPart(body_part),
    enabled: !!body_part,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Get workouts by equipment
 */
export const useWorkoutsByEquipment = (
  equipment: string,
  options?: Omit<UseQueryOptions<Workout[], Error>, "queryKey" | "queryFn">
): UseQueryResult<Workout[], Error> => {
  return useQuery<Workout[], Error>({
    queryKey: workoutKeys.equipment(equipment),
    queryFn: () => ws.getWorkoutsByEquipment(equipment),
    enabled: !!equipment,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Search workouts by name
 */
export const useSearchWorkouts = (
  name: string,
  options?: Omit<UseQueryOptions<Workout[], Error>, "queryKey" | "queryFn">
): UseQueryResult<Workout[], Error> => {
  return useQuery<Workout[], Error>({
    queryKey: workoutKeys.search(name),
    queryFn: () => ws.searchWorkoutsByName(name),
    enabled: !!name && name.length >= 2, // Only search with 2+ characters
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
};

/**
 * Hook: Get list of all body parts
 */
export const useBodyPartList = (
  options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">
): UseQueryResult<string[], Error> => {
  return useQuery<string[], Error>({
    queryKey: workoutKeys.metadata.bodyParts,
    queryFn: () => ws.getBodyPartList(),
    staleTime: Infinity, // Body parts list rarely changes
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Hook: Get list of all equipment types
 */
export const useEquipmentList = (
  options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">
): UseQueryResult<string[], Error> => {
  return useQuery<string[], Error>({
    queryKey: workoutKeys.metadata.equipment,
    queryFn: () => ws.getEquipmentList(),
    staleTime: Infinity, // Equipment list rarely changes
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Fetch all muscle groups
 * Used for: Muscle group selector, 3D model initialization
 */
export function useMuscleGroups(
  options?: Omit<UseQueryOptions<MuscleGroup[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: workoutKeys.muscleGroupLists(),
    queryFn: () => ws.getAllMuscleGroups(),
    staleTime: 1000 * 60 * 30, // 30 minutes - muscle groups rarely change
    gcTime: 1000 * 60 * 60, // 1 hour cache
    ...options,
  });
}

/**
 * Utility: Get the service instance directly
 * Use this for imperative calls outside React components
 */
export const getWorkoutsService = () => ws;
