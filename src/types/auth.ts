import type { AuthError, Session, User } from "@supabase/supabase-js";
import type { Profile } from "./profile";

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notifications?: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
  };
  timezone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Profile | null;
  accessToken: string | null;
  isInitialized: boolean;
}

export interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: AuthError | null;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Generic error type for auth operations
export type AuthErrorType = AuthError | Error | unknown;
