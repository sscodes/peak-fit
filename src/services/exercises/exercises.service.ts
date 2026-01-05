// src/services/exercises.service.ts

import type {
  ExerciseDBExercise,
  ExerciseServiceConfig,
} from "../../data/types";

/**
 * ExercisesService - Handles all ExerciseDB API calls
 */
export class ExercisesService {
  private config: ExerciseServiceConfig;

  constructor() {
    // Initialize with environment variables
    this.config = {
      apiKey: import.meta.env.VITE_RAPIDAPI_KEY || "",
      apiHost: "exercisedb.p.rapidapi.com",
      baseUrl: "https://exercisedb.p.rapidapi.com",
    };

    if (!this.config.apiKey) {
      console.warn("⚠️ VITE_RAPIDAPI_KEY not found in environment variables");
    }
  }

  /**
   * Common headers for all API requests
   */
  private getHeaders(): HeadersInit {
    return {
      "X-RapidAPI-Key": this.config.apiKey,
      "X-RapidAPI-Host": this.config.apiHost,
    };
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchAPI<T>(
    endpoint: string,
    params: URLSearchParams = new URLSearchParams()
  ): Promise<T> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}${endpoint}?${params.toString()}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get all exercises (1300+)
   * Endpoint: GET /exercises
   */
  async getAllExercises(): Promise<ExerciseDBExercise[]> {
    const params = new URLSearchParams({
      offset: "0",
      limit: "0", // or whatever maximum you want
      sortMethod: "id",
      sortOrder: "ascending",
    });
    return this.fetchAPI<ExerciseDBExercise[]>("/exercises", params);
  }

  /**
   * Get exercise by ID
   * Endpoint: GET /exercises/exercise/{id}
   */
  async getExerciseById(id: string): Promise<ExerciseDBExercise> {
    return this.fetchAPI<ExerciseDBExercise>(`/exercises/exercise/${id}`);
  }

  /**
   * Get exercises by body part
   * Endpoint: GET /exercises/body_part/{body_part}
   * @param body_part - e.g., "back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"
   */
  async getExercisesByBodyPart(
    body_part: string
  ): Promise<ExerciseDBExercise[]> {
    return this.fetchAPI<ExerciseDBExercise[]>(
      `/exercises/body_part/${body_part}`
    );
  }

  /**
   * Get exercises by equipment
   * Endpoint: GET /exercises/equipment/{equipment}
   * @param equipment - e.g., "barbell", "dumbbell", "body weight", "cable", "machine"
   */
  async getExercisesByEquipment(
    equipment: string
  ): Promise<ExerciseDBExercise[]> {
    return this.fetchAPI<ExerciseDBExercise[]>(
      `/exercises/equipment/${equipment}`
    );
  }

  /**
   * Get exercises by target muscle
   * Endpoint: GET /exercises/target/{target}
   * @param target - e.g., "biceps", "triceps", "quads", "glutes", "abs"
   */
  async getExercisesByTarget(target: string): Promise<ExerciseDBExercise[]> {
    return this.fetchAPI<ExerciseDBExercise[]>(`/exercises/target/${target}`);
  }

  /**
   * Get exercises by name (search)
   * Endpoint: GET /exercises/name/{name}
   */
  async searchExercisesByName(name: string): Promise<ExerciseDBExercise[]> {
    return this.fetchAPI<ExerciseDBExercise[]>(`/exercises/name/${name}`);
  }

  /**
   * Get list of all body parts
   * Endpoint: GET /exercises/bodyPartList
   */
  async getBodyPartList(): Promise<string[]> {
    return this.fetchAPI<string[]>("/exercises/bodyPartList");
  }

  /**
   * Get list of all equipment types
   * Endpoint: GET /exercises/equipmentList
   */
  async getEquipmentList(): Promise<string[]> {
    return this.fetchAPI<string[]>("/exercises/equipmentList");
  }

  /**
   * Get list of all target muscles
   * Endpoint: GET /exercises/targetList
   */
  async getTargetMuscleList(): Promise<string[]> {
    return this.fetchAPI<string[]>("/exercises/targetList");
  }

  /**
   * Get paginated exercises
   * @param limit - Number of exercises per page (default: 10)
   * @param offset - Starting position (default: 0)
   */
  async getExercisesPaginated(
    limit: number = 10,
    offset: number = 0
  ): Promise<ExerciseDBExercise[]> {
    return this.fetchAPI<ExerciseDBExercise[]>(
      `/exercises?limit=${limit}&offset=${offset}`
    );
  }
}
