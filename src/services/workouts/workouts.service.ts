// src/services/workouts.service.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { MuscleGroup, Workout } from "../../types/workout";

/**
 * Service Configuration
 */
interface WorkoutServiceConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * WorkoutService - Handles all Supabase workout-related API calls
 */
export class WorkoutService {
  private supabase: SupabaseClient;
  private config: WorkoutServiceConfig;

  constructor() {
    // Initialize with environment variables
    this.config = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    };

    if (!this.config.supabaseUrl || !this.config.supabaseAnonKey) {
      console.warn(
        "⚠️ Supabase credentials not found in environment variables"
      );
    }

    // Create Supabase client
    this.supabase = createClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey
    );
  }

  /**
   * Get all workouts (1324 total)
   * Note: Returns all workouts in one call
   */
  async getAllWorkouts(): Promise<Workout[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .order("name");

    if (error) {
      console.error("Failed to fetch all workouts:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get workout by ID
   */
  async getWorkoutById(id: string): Promise<Workout | null> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Failed to fetch workout ${id}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Get workouts by body part
   * @param body_part - e.g., "back", "chest", "upper legs"
   */
  async getWorkoutsByBodyPart(body_part: string): Promise<Workout[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .eq("body_part", body_part)
      .order("name");

    if (error) {
      console.error(
        `Failed to fetch workouts for body part ${body_part}:`,
        error
      );
      throw error;
    }

    return data || [];
  }

  /**
   * Get workouts by equipment
   * @param equipment - e.g., "barbell", "dumbbell", "body weight"
   */
  async getWorkoutsByEquipment(equipment: string): Promise<Workout[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .eq("equipment", equipment)
      .order("name");

    if (error) {
      console.error(
        `Failed to fetch workouts for equipment ${equipment}:`,
        error
      );
      throw error;
    }

    return data || [];
  }

  /**
   * Get workouts by primary muscle
   * Uses array contains operator to find workouts targeting specific muscle
   */
  async getWorkoutsByMuscle(muscle_id: string): Promise<Workout[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .contains("primary_muscles", [muscle_id])
      .order("name");

    if (error) {
      console.error(`Failed to fetch workouts for muscle ${muscle_id}:`, error);
      throw error;
    }

    return data || [];
  }

  /**
   * Search workouts by name (case-insensitive)
   */
  async searchWorkoutsByName(name: string): Promise<Workout[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name");

    if (error) {
      console.error(`Failed to search workouts for "${name}":`, error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get list of all unique body parts
   */
  async getBodyPartList(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("body_part")
      .not("body_part", "is", null);

    if (error) {
      console.error("Failed to fetch body parts:", error);
      throw error;
    }

    // Extract unique body parts
    const bodyParts = [...new Set(data.map((item) => item.body_part))].sort();
    return bodyParts;
  }

  /**
   * Get list of all unique equipment types
   */
  async getEquipmentList(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("equipment")
      .not("equipment", "is", null);

    if (error) {
      console.error("Failed to fetch equipment list:", error);
      throw error;
    }

    // Extract unique equipment types
    const equipment = [...new Set(data.map((item) => item.equipment))].sort();
    return equipment;
  }

  /**
   * Get list of all unique difficulty levels
   */
  async getDifficultyList(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("difficulty")
      .not("difficulty", "is", null);

    if (error) {
      console.error("Failed to fetch difficulty levels:", error);
      throw error;
    }

    // Extract unique difficulty levels
    const difficulties = [
      ...new Set(data.map((item) => item.difficulty)),
    ].sort();
    return difficulties;
  }

  /**
   * Get paginated workouts
   * @param limit - Number of workouts per page
   * @param offset - Starting position
   */
  async getWorkoutsPaginated(
    limit: number = 20,
    offset: number = 0
  ): Promise<Workout[]> {
    const { data, error } = await this.supabase
      .from("workouts")
      .select("*")
      .order("name")
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Failed to fetch paginated workouts:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get workouts with filters
   * Combines multiple filter criteria
   */
  async getWorkoutsFiltered(filters: {
    body_part?: string;
    equipment?: string;
    difficulty?: string;
    muscle_id?: string;
  }): Promise<Workout[]> {
    let query = this.supabase.from("workouts").select("*");

    if (filters.body_part) {
      query = query.eq("body_part", filters.body_part);
    }

    if (filters.equipment) {
      query = query.eq("equipment", filters.equipment);
    }

    if (filters.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    if (filters.muscle_id) {
      query = query.contains("primary_muscles", [filters.muscle_id]);
    }

    query = query.order("name");

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch filtered workouts:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get total workout count
   */
  async getWorkoutCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from("workouts")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to fetch workout count:", error);
      throw error;
    }

    return count || 0;
  }

  /**
   * Get all muscle groups for 3D visualization mapping
   */
  async getAllMuscleGroups(): Promise<MuscleGroup[]> {
    const { data, error } = await this.supabase
      .from("muscle_groups")
      .select("*");

    if (error) {
      console.error("Failed to fetch muscle groups:", error);
      throw error;
    }

    return data || [];
  }
}
