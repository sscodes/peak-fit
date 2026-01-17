import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import type { Profile } from "../../types/profile";
import { handleSupabaseError } from "../auth/auth.data";

export interface ProfileResponse<T = Profile> {
  data: T | null;
  error: PostgrestError | null;
}

export interface ProfilesResponse<T = Profile> {
  data: T[] | null;
  error: PostgrestError | null;
}

/**
 * ProfileService - Handles all Supabase profile-related operations
 */
export class ProfileService {
  /**
   * Get a user's profile by ID
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: error as PostgrestError };
    }
  }

  /**
   * Get current user's profile (uses auth session)
   */
  async getCurrentUserProfile(): Promise<ProfileResponse> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error("No user found");

      return await this.getProfile(user.id);
    } catch (error: unknown) {
      return { data: null, error: error as PostgrestError };
    }
  }

  /**
   * Update profile with partial data
   */
  async updateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: error as PostgrestError };
    }
  }

  /**
   * Complete onboarding
   */
  async completeOnboarding(userId: string): Promise<ProfileResponse> {
    return this.updateProfile(userId, {
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: Error | null }> {
    let uploadedFileName: string | null = null;

    try {
      // Extract file extension safely
      const lastDotIndex = file.name.lastIndexOf(".");
      let fileExt: string;

      if (lastDotIndex > 0 && lastDotIndex < file.name.length - 1) {
        // Has extension
        const ext = file.name.substring(lastDotIndex + 1).toLowerCase();
        // Validate extension length and use common image formats
        if (
          ext.length <= 5 &&
          ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)
        ) {
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
      uploadedFileName = fileName; // Track for cleanup

      // Upload to Supabase Storage with content type
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type || `image/${fileExt}`,
          cacheControl: "3600", // 1 hour cache
        });

      if (uploadError) {
        throw new Error(`Failed to upload avatar: ${uploadError.message}`);
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      if (!data.publicUrl) {
        throw new Error("Failed to get public URL for uploaded avatar");
      }

      // Update profile with avatar URL - MUST succeed or rollback
      const { error: updateError } = await this.updateProfile(userId, {
        avatar: data.publicUrl,
      });

      if (updateError) {
        // Profile update failed - clean up the uploaded file
        console.error(
          "Profile update failed, removing uploaded file:",
          updateError,
        );

        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove([fileName]);

        if (removeError) {
          console.error("Failed to remove orphaned avatar file:", removeError);
        }

        throw new Error(
          `Failed to update profile with avatar: ${updateError.message}`,
        );
      }

      return { url: data.publicUrl, error: null };
    } catch (error: unknown) {
      // If we uploaded a file but something failed, try to clean it up
      if (uploadedFileName) {
        try {
          const { error: removeError } = await supabase.storage
            .from("avatars")
            .remove([uploadedFileName]);

          if (removeError) {
            console.error(
              "Failed to clean up avatar after error:",
              removeError,
            );
          }
        } catch (cleanupError) {
          console.error("Error during avatar cleanup:", cleanupError);
        }
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while uploading avatar";

      return {
        url: null,
        error: new Error(errorMessage),
      };
    }
  }

  /**
   * Helper to get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
      "image/tiff": "tiff",
    };

    return mimeToExt[mimeType.toLowerCase()] || "jpg"; // Default to jpg
  }

  /**
   * Get profile completion percentage
   */
  async getProfileCompletion(userId: string): Promise<number> {
    try {
      const { data: profile } = await this.getProfile(userId);
      if (!profile) return 0;

      const sections = {
        basic: ["full_name", "age", "gender", "height_cm", "weight_kg"],
        health: ["health_medical"],
        fitness: ["fitness_level", "training_history"],
        goals: ["primary_goal", "goal_importance"],
        preferences: [
          "training_days_per_week",
          "session_duration",
          "training_location",
        ],
      };

      let completed = 0;
      let total = 0;

      Object.values(sections)
        .flat()
        .forEach((field) => {
          total++;
          if (
            profile[field as keyof Profile] !== null &&
            profile[field as keyof Profile] !== undefined
          ) {
            completed++;
          }
        });

      return Math.round((completed / total) * 100);
    } catch (error: unknown) {
      const apiError = handleSupabaseError(error);
      console.error("Get profile completion error:", apiError);
      throw apiError;
    }
  }

  /**
   * Check if user needs medical clearance
   */
  async needsMedicalClearance(userId: string): Promise<string> {
    try {
      const { data: profile } = await this.getProfile(userId);
      return (
        (profile?.questionnaire_data?.["health_medical"].value as string) ||
        "No"
      );
    } catch {
      return "No";
    }
  }

  /**
   * Helper to identify error type for better error handling
   */
  getErrorType(error: unknown): "auth" | "database" | "storage" | "unknown" {
    if (!error || typeof error !== "object") return "unknown";

    if ("code" in error && "details" in error && "hint" in error) {
      return "database"; // PostgrestError
    }
    if (
      "status" in error &&
      "name" in error &&
      typeof error.name === "string" &&
      error.name.includes("Auth")
    ) {
      return "auth"; // AuthError
    }
    if (
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("storage")
    ) {
      return "storage";
    }
    return "unknown";
  }

  /**
   * Helper: Get user-friendly error message
   */
  getErrorMessage(error: unknown): string {
    if (!error) return "";

    const errorType = this.getErrorType(error);

    // Type guard for error objects
    if (typeof error === "object" && error !== null) {
      switch (errorType) {
        case "database": {
          const dbError = error as PostgrestError;
          if (dbError.code === "23505") return "This record already exists";
          if (dbError.code === "23503") return "Referenced record not found";
          if (dbError.code === "42501") return "Insufficient permissions";
          return dbError.message || "Database operation failed";
        }
        case "auth": {
          const authError = error as AuthError;
          if (authError.message?.includes("not authenticated"))
            return "Please sign in first";
          return authError.message || "Authentication failed";
        }
        case "storage": {
          if ("message" in error && typeof error.message === "string") {
            if (error.message.includes("size")) return "File too large";
            if (error.message.includes("type")) return "Invalid file type";
          }
          return "File upload failed";
        }
        default:
          if ("message" in error && typeof error.message === "string") {
            return error.message;
          }
          return "An unexpected error occurred";
      }
    }

    return "An unexpected error occurred";
  }
}
