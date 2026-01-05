// src/data/exercises.data.ts
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ExercisesService } from "./exercises.service";
import type { ExerciseDBExercise } from "../../data/types";

/**
 * Singleton instance of ExercisesService
 */
const es = new ExercisesService();

/**
 * Query Keys for React Query caching
 */
export const exerciseKeys = {
  all: ["exercises"] as const,
  lists: () => [...exerciseKeys.all, "list"] as const,
  list: (filters: string) => [...exerciseKeys.lists(), { filters }] as const,
  details: () => [...exerciseKeys.all, "detail"] as const,
  detail: (id: string) => [...exerciseKeys.details(), id] as const,
  body_part: (body_part: string) =>
    [...exerciseKeys.all, "body_part", body_part] as const,
  equipment: (equipment: string) =>
    [...exerciseKeys.all, "equipment", equipment] as const,
  target: (target: string) => [...exerciseKeys.all, "target", target] as const,
  search: (name: string) => [...exerciseKeys.all, "search", name] as const,
  metadata: {
    bodyParts: ["exercises", "metadata", "bodyParts"] as const,
    equipment: ["exercises", "metadata", "equipment"] as const,
    targets: ["exercises", "metadata", "targets"] as const,
  },
};

/**
 * Hook: Get all exercises (1300+)
 * ⚠️ Use with caution - large dataset
 */
export const useGetAllExercises = (
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise[], Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise[], Error> => {
  return useQuery<ExerciseDBExercise[], Error>({
    queryKey: exerciseKeys.lists(),
    queryFn: () => es.getAllExercises(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours (formerly cacheTime)
    ...options,
  });
};

/**
 * Hook: Get paginated exercises
 * Recommended for initial loading
 */
export const usePaginatedExercises = (
  limit: number = 20,
  offset: number = 0,
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise[], Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise[], Error> => {
  return useQuery<ExerciseDBExercise[], Error>({
    queryKey: [...exerciseKeys.lists(), "paginated", limit, offset],
    queryFn: () => es.getExercisesPaginated(limit, offset),
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Get exercise by ID
 */
export const useExerciseById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise, Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise, Error> => {
  return useQuery<ExerciseDBExercise, Error>({
    queryKey: exerciseKeys.detail(id),
    queryFn: () => es.getExerciseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
};

/**
 * Hook: Get exercises by body part
 */
export const useExercisesByBodyPart = (
  body_part: string,
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise[], Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise[], Error> => {
  return useQuery<ExerciseDBExercise[], Error>({
    queryKey: exerciseKeys.body_part(body_part),
    queryFn: () => es.getExercisesByBodyPart(body_part),
    enabled: !!body_part,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Get exercises by equipment
 */
export const useExercisesByEquipment = (
  equipment: string,
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise[], Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise[], Error> => {
  return useQuery<ExerciseDBExercise[], Error>({
    queryKey: exerciseKeys.equipment(equipment),
    queryFn: () => es.getExercisesByEquipment(equipment),
    enabled: !!equipment,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Get exercises by target muscle
 */
export const useExercisesByTarget = (
  target: string,
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise[], Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise[], Error> => {
  return useQuery<ExerciseDBExercise[], Error>({
    queryKey: exerciseKeys.target(target),
    queryFn: () => es.getExercisesByTarget(target),
    enabled: !!target,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

/**
 * Hook: Search exercises by name
 */
export const useSearchExercises = (
  name: string,
  options?: Omit<
    UseQueryOptions<ExerciseDBExercise[], Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ExerciseDBExercise[], Error> => {
  return useQuery<ExerciseDBExercise[], Error>({
    queryKey: exerciseKeys.search(name),
    queryFn: () => es.searchExercisesByName(name),
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
    queryKey: exerciseKeys.metadata.bodyParts,
    queryFn: () => es.getBodyPartList(),
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
    queryKey: exerciseKeys.metadata.equipment,
    queryFn: () => es.getEquipmentList(),
    staleTime: Infinity, // Equipment list rarely changes
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Hook: Get list of all target muscles
 */
export const useTargetMuscleList = (
  options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">
): UseQueryResult<string[], Error> => {
  return useQuery<string[], Error>({
    queryKey: exerciseKeys.metadata.targets,
    queryFn: () => es.getTargetMuscleList(),
    staleTime: Infinity, // Target muscles list rarely changes
    gcTime: Infinity,
    ...options,
  });
};

/**
 * Utility: Get the service instance directly
 * Use this for imperative calls outside React components
 */
export const getExercisesService = () => es;
