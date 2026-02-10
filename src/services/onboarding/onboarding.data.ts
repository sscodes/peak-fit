// onboarding.data.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { DASHBOARD } from "../../helpers/getters";
import { notifyError } from "../../helpers/helper";
import { useAppDispatch } from "../../hooks/redux";
import { updateProfile } from "../../store/authSlice";
import type { QuestionnaireData } from "../../types/profile";
import { onboardingKeys, profileKeys } from "../query-key-factory";
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
  notifyError(errorMessage);
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
 * Uses atomic direct JSONB update (no race conditions)
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
        queryKey: profileKeys.detail(variables.userId),
      });
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
    },
  });
};

/**
 * Hook: Save multiple answers
 * Uses atomic server-side merge (prevents race conditions)
 * Works for both onboarding completion and profile bulk updates
 */
export const useSaveAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveAnswersPayload) => {
      const { error } = await onboardingService.saveAnswers(payload);

      if (error) throw error;

      return payload;
    },
    onSuccess: (data) => {
      // Invalidate progress and profile queries
      queryClient.invalidateQueries({
        queryKey: onboardingKeys.progress(data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(data.userId),
      });
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
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
        queryKey: profileKeys.detail(data.userId),
      });

      // Navigate to dashboard
      navigate(DASHBOARD);
    },
    onError: (error: unknown) => {
      handleOnboardingError(error);
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
