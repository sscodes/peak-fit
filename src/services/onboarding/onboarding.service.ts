// onboarding.service.ts
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import type { Questionnaire, QuestionSection } from "../../types/questions";
import type { QuestionnaireData } from "../../types/profile";

export interface OnboardingResponse<T = QuestionSection[]> {
  data: T | null;
  error: PostgrestError | Error | null;
}

export interface SaveAnswersPayload {
  userId: string;
  answers: Record<string, QuestionnaireData>;
}

export interface OnboardingProgress {
  totalQuestions: number;
  answeredQuestions: number;
  progressPercentage: number;
  crucialAnswered: number;
  crucialTotal: number;
}

/**
 * OnboardingService - Handles all Supabase onboarding-related operations
 */
export class OnboardingService {
  private toError(error: unknown): PostgrestError | Error {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error
    ) {
      return error as PostgrestError;
    }
    return error instanceof Error ? error : new Error(String(error));
  }

  /**
   * Fetch the complete questionnaire structure
   * Returns sections ordered by display_order
   */
  async getQuestionnaire(): Promise<OnboardingResponse<Questionnaire>> {
    try {
      const { data, error } = await supabase
        .from("onboarding_questions")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      // Transform database rows into Questionnaire format
      const questionnaire: Questionnaire = (data || []).map((section) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        icon: section.icon,
        questions: section.questions,
      }));

      return { data: questionnaire, error: null };
    } catch (error: unknown) {
      console.error("Failed to fetch questionnaire:", error);
      return { data: null, error: this.toError(error) };
    }
  }

  /**
   * Get only crucial questions from the questionnaire
   * Returns filtered questionnaire with only crucial questions
   */
  async getCrucialQuestionnaire(): Promise<OnboardingResponse<Questionnaire>> {
    try {
      const { data: questionnaire, error } = await this.getQuestionnaire();

      if (error) throw error;
      if (!questionnaire) throw new Error("Questionnaire not found");

      // Filter to include only sections that have crucial questions
      const crucialQuestionnaire: Questionnaire = questionnaire
        .map((section) => ({
          ...section,
          questions: section.questions.filter((question) => question.crucial),
        }))
        .filter((section) => section.questions.length > 0); // Remove empty sections

      return { data: crucialQuestionnaire, error: null };
    } catch (error: unknown) {
      console.error("Failed to fetch crucial questionnaire:", error);
      return { data: null, error: this.toError(error) };
    }
  }

  /**
   * Fetch a single section by ID
   */
  async getQuestionSection(
    sectionId: string,
  ): Promise<OnboardingResponse<QuestionSection>> {
    try {
      const { data, error } = await supabase
        .from("onboarding_questions")
        .select("*")
        .eq("id", sectionId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error(`Section ${sectionId} not found`);
      }

      const section: QuestionSection = {
        id: data.id,
        title: data.title,
        description: data.description,
        icon: data.icon,
        questions: data.questions,
      };

      return { data: section, error: null };
    } catch (error: unknown) {
      console.error(`Failed to fetch section ${sectionId}:`, error);
      return { data: null, error: this.toError(error) };
    }
  }

  /**
   * Save a single answer to user's profile
   * Uses atomic RPC (prevents race conditions)
   */
  async saveAnswer(
    userId: string,
    questionId: string,
    answerData: QuestionnaireData,
  ): Promise<{ error: PostgrestError | null }> {
    try {
      const { error } = await supabase.rpc("update_questionnaire_answer", {
        user_id: userId,
        question_id: questionId,
        answer_data: answerData,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: unknown) {
      console.error(`Failed to save answer for question ${questionId}:`, error);
      return { error: error as PostgrestError };
    }
  }

  /**
   * Save multiple answers at once
   * Uses atomic server-side merge (prevents race conditions)
   */
  async saveAnswers(
    payload: SaveAnswersPayload,
  ): Promise<{ error: PostgrestError | null }> {
    try {
      const { userId, answers } = payload;

      // Atomic server-side merge via RPC
      const { error } = await supabase.rpc("update_multiple_answers", {
        user_id: userId,
        answers_data: answers,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: unknown) {
      console.error("Failed to save answers:", error);
      return { error: error as PostgrestError };
    }
  }

  /**
   * Calculate onboarding progress
   * Returns completion percentage and crucial question status
   */
  async getProgress(
    userId: string,
  ): Promise<{ data: OnboardingProgress | null; error: Error | null }> {
    try {
      // Fetch questionnaire structure
      const { data: questionnaire, error: questionnaireError } =
        await this.getQuestionnaire();

      if (questionnaireError || !questionnaire) {
        throw new Error("Failed to fetch questionnaire");
      }

      // Fetch user's answers
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("questionnaire_data")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const answers = profile?.questionnaire_data || {};

      // Count total and answered questions
      let totalQuestions = 0;
      let answeredQuestions = 0;
      let crucialTotal = 0;
      let crucialAnswered = 0;

      questionnaire.forEach((section) => {
        section.questions.forEach((question) => {
          totalQuestions++;

          if (question.crucial) {
            crucialTotal++;
          }

          const answer = answers[question.id];
          if (answer && answer.is_answered) {
            answeredQuestions++;

            if (question.crucial) {
              crucialAnswered++;
            }
          }
        });
      });

      const progressPercentage =
        totalQuestions > 0
          ? Math.round((answeredQuestions / totalQuestions) * 100)
          : 0;

      return {
        data: {
          totalQuestions,
          answeredQuestions,
          progressPercentage,
          crucialTotal,
          crucialAnswered,
        },
        error: null,
      };
    } catch (error: unknown) {
      console.error("Failed to calculate progress:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }

  /**
   * Mark onboarding as complete
   * Sets is_onboarded flag to true
   */
  async completeOnboarding(
    userId: string,
  ): Promise<{ error: PostgrestError | null }> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      return { error: null };
    } catch (error: unknown) {
      console.error("Failed to complete onboarding:", error);
      return { error: error as PostgrestError };
    }
  }

  /**
   * Helper: Check if user has completed onboarding
   * Returns the is_onboarded status from user's profile
   */
  async isOnboardingComplete(
    userId: string,
  ): Promise<{ isComplete: boolean; error: Error | null }> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_onboarded")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (!profile) {
        throw new Error("Profile not found");
      }

      return {
        isComplete: profile.is_onboarded || false,
        error: null,
      };
    } catch (error: unknown) {
      console.error("Failed to check onboarding status:", error);
      return {
        isComplete: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }

  /**
   * Helper: Get user-friendly error message
   */
  getErrorMessage(error: unknown): string {
    if (!error) return "";

    if (typeof error === "object" && error !== null && "message" in error) {
      const pgError = error as PostgrestError;

      // Custom error messages for common cases
      if (pgError.code === "23505") return "Duplicate entry found";
      if (pgError.code === "23503") return "Referenced record not found";
      if (pgError.code === "42501") return "Insufficient permissions";

      return pgError.message || "Database operation failed";
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  }
}
