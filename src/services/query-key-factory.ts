// src/services/query-key-factory.ts

import type { QueryClient } from '@tanstack/react-query';

/**
 * Query Key Factory
 * Centralized query key management for React Query
 * Ensures consistent and type-safe query keys across the application
 */

export const authKeys = {
  all: ['auth'] as const,
  createUser: () => [...authKeys.all, 'createUser'] as const,
  loginUser: () => [...authKeys.all, 'loginUser'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
  updateUserPassword: () => [...authKeys.all, 'updatePassword'] as const,
  sendOTPMail: () => [...authKeys.all, 'sendOTP'] as const,
  checkOTP: () => [...authKeys.all, 'checkOTP'] as const,
  deleteUser: () => [...authKeys.all, 'deleteUser'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  refreshSession: () => [...authKeys.all, 'refreshSession'] as const,
};

export const profileKeys = {
  all: ['profile'] as const,
  byId: (userId: string) => [...profileKeys.all, 'user', userId] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  completion: (userId: string) =>
    [...profileKeys.all, 'user', userId, 'completion'] as const,
  aiContext: (userId: string) =>
    [...profileKeys.all, 'user', userId, 'aiContext'] as const,
  avatar: (userId: string) =>
    [...profileKeys.all, 'user', userId, 'avatar'] as const,
};

export const workoutKeys = {
  all: ['workout'] as const,
  sessions: () => [...workoutKeys.all, 'sessions'] as const,
  sessionById: (sessionId: string) =>
    [...workoutKeys.all, 'sessions', sessionId] as const,
  userSessions: (userId: string) =>
    [...workoutKeys.all, 'sessions', 'user', userId] as const,
  userSessionsByDate: (userId: string, date: string) =>
    [...workoutKeys.all, 'sessions', 'user', userId, date] as const,
  generated: () => [...workoutKeys.all, 'generated'] as const,
  generatedById: (workoutId: string) =>
    [...workoutKeys.all, 'generated', workoutId] as const,
};

export const onboardingKeys = {
  all: ['onboarding'] as const,
  progress: (userId: string) =>
    [...onboardingKeys.all, 'progress', userId] as const,
  section: (userId: string, section: string) =>
    [...onboardingKeys.all, 'section', userId, section] as const,
};

// Helper function to invalidate all queries for a specific domain
export const invalidateAuthQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: authKeys.all });
};

export const invalidateProfileQueries = (
  queryClient: QueryClient,
  userId?: string
) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: profileKeys.byId(userId) });
  } else {
    queryClient.invalidateQueries({ queryKey: profileKeys.all });
  }
};

export const invalidateWorkoutQueries = (
  queryClient: QueryClient,
  userId?: string
) => {
  if (userId) {
    queryClient.invalidateQueries({
      queryKey: workoutKeys.userSessions(userId),
    });
  } else {
    queryClient.invalidateQueries({ queryKey: workoutKeys.all });
  }
};
