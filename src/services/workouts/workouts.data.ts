// src/data/workouts.data.ts
import {
  useInfiniteQuery,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { MuscleGroup, Workout } from "../../types/workout";
import { workoutKeys } from "../query-key-factory";
import { WorkoutService } from "./workouts.service";

/**
 * Singleton instance of WorkoutsService
 */
const ws = new WorkoutService();

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
export const useInfiniteWorkouts = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...workoutKeys.lists(), "infinite", limit],
    queryFn: ({ pageParam = 0 }) => ws.getWorkoutsPaginated(limit, pageParam),
    initialPageParam: 0, // Add this - required in React Query v5+
    getNextPageParam: (lastPage, allPages) => {
      // If last page has full limit, there might be more
      if (lastPage.length === limit) {
        return allPages.length * limit;
      }
      return undefined; // No more pages
    },
    staleTime: 1000 * 60 * 30,
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
    enabled: !!name.length,
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
