// src/services/auth/auth.service.ts
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabaseAuth } from '../../lib/supabaseAuth';
import { supabaseProfile } from '../../lib/supabaseProfile';

/**
 * Auth Service Class - Wrapper around Supabase auth functions
 * This maintains compatibility with your existing service pattern
 * while using Supabase under the hood
 */
export class AuthService {
  /**
   * Create a new user account
   */
  async createUser(payload: {
    email: string;
    password: string;
    fullName?: string;
  }) {
    const { user, session, error } = await supabaseAuth.signUp({
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
    });

    if (error) {
      throw error;
    }

    return { user, session };
  }

  /**
   * Sign in a user
   */
  async loginUser(credentials: { email: string; password: string }) {
    const { user, session, error } = await supabaseAuth.signIn({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    return { user, session };
  }

  /**
   * Sign out the current user
   */
  async logout() {
    const { error } = await supabaseAuth.signOut();

    if (error) {
      throw error;
    }

    return { success: true };
  }

  /**
   * Update user password
   */
  async updateUserPassword(newPassword: string) {
    const { user, error } = await supabaseAuth.updatePassword(newPassword);

    if (error) {
      throw error;
    }

    return { user };
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string) {
    const { error } = await supabaseAuth.sendPasswordResetEmail(email);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string) {
    const { error } = await supabaseAuth.resendConfirmation(email);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    const { session, error } = await supabaseAuth.getSession();

    if (error) {
      throw error;
    }

    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { user, error } = await supabaseAuth.getCurrentUser();

    if (error) {
      throw error;
    }

    return user;
  }

  /**
   * Refresh the current session
   */
  async refreshSession() {
    const { session, error } = await supabaseAuth.refreshSession();

    if (error) {
      throw error;
    }

    return session;
  }

  /**
   * Update user email
   */
  async updateUserEmail(newEmail: string) {
    const { user, error } = await supabaseAuth.updateEmail(newEmail);

    if (error) {
      throw error;
    }

    return { user };
  }

  /**
   * Exchange auth code for session (OAuth flow)
   */
  async exchangeCodeForSession(code: string) {
    const { user, session, error } = await supabaseAuth.exchangeCodeForSession(
      code
    );

    if (error) {
      throw error;
    }

    return { user, session };
  }

  /**
   * Check if user needs email confirmation
   */
  isWaitingForEmailConfirmation(user: User | null): boolean {
    return supabaseAuth.isWaitingForEmailConfirmation(user);
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error: any): string {
    return supabaseAuth.getErrorMessage(error);
  }

  /**
   * Set up auth state change listener
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return supabaseAuth.onAuthStateChange(callback);
  }
}

/**
 * Profile Service Class - Wrapper around Supabase profile functions
 */
export class ProfileService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabaseProfile.getProfile(userId);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile() {
    const { data, error } = await supabaseProfile.getCurrentUserProfile();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabaseProfile.updateProfile(
      userId,
      updates
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update basic info
   */
  async updateBasicInfo(userId: string, info: any) {
    const { data, error } = await supabaseProfile.updateBasicInfo(userId, info);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update health & medical info
   */
  async updateHealthMedical(userId: string, healthData: any) {
    const { data, error } = await supabaseProfile.updateHealthMedical(
      userId,
      healthData
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update fitness assessment
   */
  async updateFitnessAssessment(userId: string, assessment: any) {
    const { data, error } = await supabaseProfile.updateFitnessAssessment(
      userId,
      assessment
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update goals
   */
  async updateGoals(userId: string, goals: any) {
    const { data, error } = await supabaseProfile.updateGoals(userId, goals);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update training preferences
   */
  async updateTrainingPreferences(userId: string, preferences: any) {
    const { data, error } = await supabaseProfile.updateTrainingPreferences(
      userId,
      preferences
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update nutrition profile
   */
  async updateNutritionProfile(userId: string, nutritionData: any) {
    const { data, error } = await supabaseProfile.updateNutritionProfile(
      userId,
      nutritionData
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Complete onboarding
   */
  async completeOnboarding(userId: string) {
    const { data, error } = await supabaseProfile.completeOnboarding(userId);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(userId: string, file: File) {
    const { url, error } = await supabaseProfile.uploadAvatar(userId, file);

    if (error) {
      throw error;
    }

    return url;
  }

  /**
   * Get profile completion percentage
   */
  async getProfileCompletion(userId: string) {
    return await supabaseProfile.getProfileCompletion(userId);
  }

  /**
   * Check if user needs medical clearance
   */
  async needsMedicalClearance(userId: string) {
    return await supabaseProfile.needsMedicalClearance(userId);
  }

  /**
   * Get user's AI context for workout generation
   */
  async getUserAIContext(userId: string) {
    return await supabaseProfile.getUserAIContext(userId);
  }
}

// Export singleton instances
export const authService = new AuthService();
export const profileService = new ProfileService();
