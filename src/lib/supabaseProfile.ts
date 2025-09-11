// src/lib/supabaseProfile.ts
import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// Types based on your database schema
export interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  body_fat_percentage?: number;
  occupation?: string;
  job_activity_level?: string;
  sleep_hours?: number;
  sleep_quality?: number;
  stress_level?: number;
  alcohol_consumption?: string;
  fitness_level?: string;
  training_history?: string;
  resting_heart_rate?: number;
  primary_goal?: string;
  goal_importance?: number;
  goal_target_date?: string;
  training_days_per_week?: number;
  session_duration?: string;
  preferred_training_time?: string;
  schedule_consistency?: string;
  training_location?: string;
  training_pace?: string;
  coaching_tone?: string;
  variety_preference?: string;
  health_medical?: any;
  movement_assessment?: any;
  secondary_goals?: any[];
  goal_specifics?: any;
  equipment_access?: any;
  exercise_preferences?: any;
  nutrition_profile?: any;
  recovery_profile?: any;
  safety_limits?: any;
  tracking_preferences?: any;
  psychology_profile?: any;
  onboarding_completed?: boolean;
  avatar_url?: string;
  wearable_device?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
  last_workout_at?: string;
}

export interface ProfileResponse<T = ProfileData> {
  data: T | null;
  error: PostgrestError | null;
}

export interface ProfilesResponse<T = ProfileData> {
  data: T[] | null;
  error: PostgrestError | null;
}

/**
 * Supabase Profile Helper Functions
 * Handle all profile-related database operations
 */
export const supabaseProfile = {
  /**
   * Get a user's profile by ID
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Ensure onboarding_completed has a default value
      const profile = data ? {
        ...data,
        onboarding_completed: data.onboarding_completed ?? false
      } : null;
      
      return { data: profile, error: null };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Get current user's profile (uses auth session)
   */
  async getCurrentUserProfile(): Promise<ProfileResponse> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error('No user found');

      return await this.getProfile(user.id);
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Create a new profile (usually not needed due to trigger)
   */
  async createProfile(profileData: Partial<ProfileData>): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Update profile with partial data
   */
  async updateProfile(
    userId: string,
    updates: Partial<ProfileData>
  ): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Update basic info (Section A)
   */
  async updateBasicInfo(
    userId: string,
    info: {
      full_name?: string;
      age?: number;
      gender?: string;
      height_cm?: number;
      weight_kg?: number;
      body_fat_percentage?: number;
    }
  ): Promise<ProfileResponse> {
    return this.updateProfile(userId, info);
  },

  /**
   * Update health & medical info (Section B - JSONB)
   */
  async updateHealthMedical(
    userId: string,
    healthData: {
      medical_conditions?: string[];
      medications?: string[];
      surgeries?: any[];
      injuries?: any[];
      pregnancy_status?: string;
      smoking_status?: string;
      allergies?: string[];
      requires_clearance?: boolean;
    }
  ): Promise<ProfileResponse> {
    try {
      // Get current health_medical data
      const { data: profile } = await this.getProfile(userId);
      const currentHealth = profile?.health_medical || {};

      // Merge with new data
      const updatedHealth = {
        ...currentHealth,
        ...healthData,
        updated_at: new Date().toISOString(),
      };

      return this.updateProfile(userId, { health_medical: updatedHealth });
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Update fitness assessment (Section D)
   */
  async updateFitnessAssessment(
    userId: string,
    assessment: {
      fitness_level?: string;
      training_history?: string;
      resting_heart_rate?: number;
      movement_assessment?: any;
    }
  ): Promise<ProfileResponse> {
    return this.updateProfile(userId, assessment);
  },

  /**
   * Update goals (Section E)
   */
  async updateGoals(
    userId: string,
    goals: {
      primary_goal?: string;
      secondary_goals?: string[];
      goal_importance?: number;
      goal_target_date?: string;
      goal_specifics?: any;
    }
  ): Promise<ProfileResponse> {
    return this.updateProfile(userId, goals);
  },

  /**
   * Update training preferences (Section F, G, H)
   */
  async updateTrainingPreferences(
    userId: string,
    preferences: {
      training_days_per_week?: number;
      session_duration?: string;
      preferred_training_time?: string;
      schedule_consistency?: string;
      training_location?: string;
      training_pace?: string;
      coaching_tone?: string;
      variety_preference?: string;
      equipment_access?: any;
      exercise_preferences?: any;
    }
  ): Promise<ProfileResponse> {
    return this.updateProfile(userId, preferences);
  },

  /**
   * Update nutrition profile (Section I)
   */
  async updateNutritionProfile(
    userId: string,
    nutritionData: any
  ): Promise<ProfileResponse> {
    try {
      const { data: profile } = await this.getProfile(userId);
      const currentNutrition = profile?.nutrition_profile || {};

      const updatedNutrition = {
        ...currentNutrition,
        ...nutritionData,
        updated_at: new Date().toISOString(),
      };

      return this.updateProfile(userId, { nutrition_profile: updatedNutrition });
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Complete onboarding
   */
  async completeOnboarding(userId: string): Promise<ProfileResponse> {
    return this.updateProfile(userId, { 
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      // Extract file extension safely
      const lastDotIndex = file.name.lastIndexOf('.');
      let fileExt: string;
      
      if (lastDotIndex > 0 && lastDotIndex < file.name.length - 1) {
        // Has extension
        const ext = file.name.substring(lastDotIndex + 1).toLowerCase();
        // Validate extension length and use common image formats
        if (ext.length <= 5 && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
          fileExt = ext;
        } else {
          // Invalid or unusual extension, determine from MIME type
          fileExt = this.getExtensionFromMimeType(file.type);
        }
      } else {
        // No extension, determine from MIME type
        fileExt = this.getExtensionFromMimeType(file.type);
      }
      
      const fileName = `${userId}/avatar.${fileExt}`;

      // Upload to Supabase Storage with content type
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type || `image/${fileExt}`,
          cacheControl: '3600' // 1 hour cache
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with avatar URL
      await this.updateProfile(userId, { avatar_url: data.publicUrl });

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  },

  /**
   * Helper to get file extension from MIME type
   */
  getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'image/tiff': 'tiff'
    };
    
    return mimeToExt[mimeType.toLowerCase()] || 'jpg'; // Default to jpg
  },

  /**
   * Get profile completion percentage
   */
  async getProfileCompletion(userId: string): Promise<number> {
    try {
      const { data: profile } = await this.getProfile(userId);
      if (!profile) return 0;

      const sections = {
        basic: ['full_name', 'age', 'gender', 'height_cm', 'weight_kg'],
        health: ['health_medical'],
        fitness: ['fitness_level', 'training_history'],
        goals: ['primary_goal', 'goal_importance'],
        preferences: ['training_days_per_week', 'session_duration', 'training_location'],
      };

      let completed = 0;
      let total = 0;

      Object.values(sections).flat().forEach(field => {
        total++;
        if (profile[field as keyof ProfileData] !== null && 
            profile[field as keyof ProfileData] !== undefined) {
          completed++;
        }
      });

      return Math.round((completed / total) * 100);
    } catch (error) {
      return 0;
    }
  },

  /**
   * Get profiles by criteria (admin use)
   */
  async getProfilesByCriteria(criteria: {
    fitness_level?: string;
    primary_goal?: string;
    training_location?: string;
    limit?: number;
  }): Promise<ProfilesResponse> {
    try {
      let query = supabase.from('profiles').select('*');

      if (criteria.fitness_level) {
        query = query.eq('fitness_level', criteria.fitness_level);
      }
      if (criteria.primary_goal) {
        query = query.eq('primary_goal', criteria.primary_goal);
      }
      if (criteria.training_location) {
        query = query.eq('training_location', criteria.training_location);
      }
      if (criteria.limit) {
        query = query.limit(criteria.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Check if user needs medical clearance
   */
  async needsMedicalClearance(userId: string): Promise<boolean> {
    try {
      const { data: profile } = await this.getProfile(userId);
      return profile?.health_medical?.requires_clearance || false;
    } catch {
      return false;
    }
  },

  /**
   * Get user's AI context for workout generation
   */
  async getUserAIContext(userId: string): Promise<any> {
    try {
      const { data: profile } = await this.getProfile(userId);
      if (!profile) return null;

      // Structure data for AI consumption
      return {
        demographics: {
          age: profile.age,
          gender: profile.gender,
          weight_kg: profile.weight_kg,
          height_cm: profile.height_cm,
          body_fat_percentage: profile.body_fat_percentage,
        },
        fitness: {
          level: profile.fitness_level,
          history: profile.training_history,
          resting_heart_rate: profile.resting_heart_rate,
          movement_capabilities: profile.movement_assessment,
        },
        goals: {
          primary: profile.primary_goal,
          secondary: profile.secondary_goals,
          importance: profile.goal_importance,
          target_date: profile.goal_target_date,
          specifics: profile.goal_specifics,
        },
        preferences: {
          days_per_week: profile.training_days_per_week,
          session_duration: profile.session_duration,
          training_time: profile.preferred_training_time,
          location: profile.training_location,
          pace: profile.training_pace,
          tone: profile.coaching_tone,
          variety: profile.variety_preference,
          equipment: profile.equipment_access,
        },
        health: profile.health_medical,
        nutrition: profile.nutrition_profile,
        recovery: profile.recovery_profile,
        safety: profile.safety_limits,
      };
    } catch (error) {
      console.error('Error getting AI context:', error);
      return null;
    }
  },
};