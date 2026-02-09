// onboarding.data.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { DASHBOARD } from "../../helpers/getters";
import { useAppDispatch } from "../../hooks/redux";
import { updateProfile } from "../../store/authSlice";
import type { QuestionnaireData } from "../../types/profile";
import { onboardingKeys } from "../query-key-factory";
import {
  OnboardingService,
  type SaveAnswersPayload,
} from "./onboarding.service";

/**
 * Singleton instance of OnboardingService
 */
const onboardingService = new OnboardingService();

/**
 * Helper function to handle onboarding errors
 */
export const handleOnboardingError = (error: unknown) => {
  const errorMessage = onboardingService.getErrorMessage(error);
  console.error("Onboarding error:", errorMessage);
  return errorMessage;
};

/**
 * Hook: Get the complete questionnaire structure
 */
export const useGetQuestionnaire = () => {
  return useQuery({
    queryKey: onboardingKeys.questionnaire(),
    queryFn: async () => {
      const { data, error } = await onboardingService.getQuestionnaire();
      if (error) throw error;
      if (!data) throw new Error("Questionnaire not found");
      return data;
    },
    staleTime: Infinity, // Questionnaire rarely changes
    gcTime: Infinity, // Keep in cache indefinitely
  });
};

/**
 * Hook: Get only crucial questions from the questionnaire
 * Returns filtered questionnaire with crucial questions only
 */
export const useGetCrucialQuestionnaire = () => {
  return useQuery({
    queryKey: onboardingKeys.crucialQuestionnaire(),
    queryFn: async () => {
      const { data, error } = await onboardingService.getCrucialQuestionnaire();
      if (error) throw error;
      if (!data) throw new Error("Crucial questionnaire not found");
      return data;
    },
    staleTime: Infinity, // Questionnaire rarely changes
    gcTime: Infinity,
  });
};

/**
 * Hook: Get a single question section
 */
export const useGetQuestionSection = (sectionId: string) => {
  return useQuery({
    queryKey: onboardingKeys.section(sectionId),
    queryFn: async () => {
      const { data, error } =
        await onboardingService.getQuestionSection(sectionId);
      if (error) throw error;
      if (!data) throw new Error(`Section ${sectionId} not found`);
      return data;
    },
    enabled: !!sectionId,
    staleTime: Infinity,
  });
};

/**
 * Hook: Save a single answer
 * Uses direct JSONB update (efficient for single updates)
 * Used from profile page for individual question edits
 */
export const useSaveAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      questionId,
      answerData,
    }: {
      userId: string;
      questionId: string;
      answerData: QuestionnaireData;
    }) => {
      const { error } = await onboardingService.saveAnswer(
        userId,
        questionId,
        answerData,
      );

      if (error) throw error;

      return { questionId, answerData };
    },
    onSuccess: (_, variables) => {
      // Invalidate progress and profile queries
      queryClient.invalidateQueries({
        queryKey: onboardingKeys.progress(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
      throw error;
    },
  });
};

/**
 * Hook: Save multiple answers during ONBOARDING
 * Uses fetch + merge approach (efficient for bulk onboarding)
 * Primary method for completing onboarding (~22 crucial questions)
 */
export const useSaveAnswersOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveAnswersPayload) => {
      const { error } = await onboardingService.saveAnswersOnboarding(payload);

      if (error) throw error;

      return payload;
    },
    onSuccess: (data) => {
      // Invalidate progress and profile queries
      queryClient.invalidateQueries({
        queryKey: onboardingKeys.progress(data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", data.userId],
      });
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
      throw error;
    },
  });
};

/**
 * Hook: Save multiple answers from PROFILE page
 * Uses direct JSONB batch update (efficient for profile edits)
 * Works for any number of questions (1 to 50)
 */
export const useSaveAnswersProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveAnswersPayload) => {
      const { error } = await onboardingService.saveAnswersProfile(payload);

      if (error) throw error;

      return payload;
    },
    onSuccess: (data) => {
      // Invalidate progress and profile queries
      queryClient.invalidateQueries({
        queryKey: onboardingKeys.progress(data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", data.userId],
      });
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
      throw error;
    },
  });
};

/**
 * Hook: Get onboarding progress
 */
export const useGetProgress = (userId: string) => {
  return useQuery({
    queryKey: onboardingKeys.progress(userId),
    queryFn: async () => {
      const { data, error } = await onboardingService.getProgress(userId);
      if (error) throw error;
      if (!data) throw new Error("Failed to calculate progress");
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Complete onboarding
 * Marks is_onboarded as true and navigates to dashboard
 */
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { error } = await onboardingService.completeOnboarding(userId);

      if (error) throw error;

      return { userId };
    },
    onSuccess: (data) => {
      // Update Redux state
      dispatch(updateProfile({ is_onboarded: true }));

      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: onboardingKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", data.userId],
      });

      // Navigate to dashboard
      navigate(DASHBOARD);
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
      throw error;
    },
  });
};

/**
 * Hook: Check if onboarding is complete
 * Checks the is_onboarded field in user's profile
 */
export const useIsOnboardingComplete = (userId: string) => {
  return useQuery({
    queryKey: onboardingKeys.isComplete(userId),
    queryFn: async () => {
      const { isComplete, error } =
        await onboardingService.isOnboardingComplete(userId);

      if (error) throw error;

      return isComplete;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};