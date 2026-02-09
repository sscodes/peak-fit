// query-key-factory.ts

import type { QueryClient } from "@tanstack/react-query";

/**
 * Query Key Factory
 * Centralized query key management for React Query
 * Ensures consistent and type-safe query keys across the application
 */

export const authKeys = {
  all: ["auth"] as const,
  createUser: () => [...authKeys.all, "create-user"] as const,
  loginUser: () => [...authKeys.all, "login-user"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
  updateUserPassword: () => [...authKeys.all, "update-password"] as const,
  sendOTPMail: () => [...authKeys.all, "send-OTP"] as const,
  checkOTP: () => [...authKeys.all, "check-OTP"] as const,
  deleteUser: () => [...authKeys.all, "delete-user"] as const,
  session: () => [...authKeys.all, "session"] as const,
  refreshSession: () => [...authKeys.all, "refresh-session"] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
  detail: (userId: string) => [...profileKeys.all, "user", userId] as const,
  current: () => [...profileKeys.all, "current"] as const,
  completion: (userId: string) =>
    [...profileKeys.all, "user", userId, "completion"] as const,
  aiContext: (userId: string) =>
    [...profileKeys.all, "user", userId, "ai-context"] as const,
  avatar: (userId: string) =>
    [...profileKeys.all, "user", userId, "avatar"] as const,
};

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
  userSessions: (userId: string) =>
    [...workoutKeys.all, "sessions", "user", userId] as const,
};

export const onboardingKeys = {
  all: ["onboarding"] as const,
  questionnaire: () => [...onboardingKeys.all, "questionnaire"] as const,
  crucialQuestionnaire: () => [...onboardingKeys.all, 'questionnaire', 'crucial'] as const,
  sections: () => [...onboardingKeys.all, "section"] as const,
  section: (id: string) => [...onboardingKeys.sections(), id] as const,
  progress: (userId: string) =>
    [...onboardingKeys.all, "progress", userId] as const,
  isComplete: (userId: string) =>
    [...onboardingKeys.all, "is-complete", userId] as const,
};

// Helper function to invalidate all queries for a specific domain
export const invalidateAuthQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: authKeys.all });
};

export const invalidateProfileQueries = (
  queryClient: QueryClient,
  userId?: string,
) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
  } else {
    queryClient.invalidateQueries({ queryKey: profileKeys.all });
  }
};

export const invalidateWorkoutQueries = (
  queryClient: QueryClient,
  userId?: string,
) => {
  if (userId) {
    queryClient.invalidateQueries({
      queryKey: workoutKeys.userSessions(userId),
    });
  } else {
    queryClient.invalidateQueries({ queryKey: workoutKeys.all });
  }
};
