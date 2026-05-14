import type {
  AuthChangeEvent,
  AuthError,
  Session,
  User,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type {
  AuthResponse,
  LoginPayload,
  SignUpPayload,
} from "@/types/auth";

/**
 * AuthService - Handles all Supabase auth-related operations
 * Mirrors WorkoutService pattern for consistency
 */
export class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp(data: SignUpPayload): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return {
        user: authData.user,
        session: authData.session, // Will be null until email confirmed
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: LoginPayload): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<{
    session: Session | null;
    error: AuthError | null;
  }> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error: error as AuthError };
    }
  }

  /**
   * Get current user (fetches fresh user data)
   */
  async getCurrentUser(): Promise<{
    user: User | null;
    error: AuthError | null;
  }> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
  ): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Update user password (requires current session)
   */
  async updatePassword(newPassword: string): Promise<{
    user: User | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  /**
   * Update user email (will send confirmation to new email)
   */
  async updateEmail(newEmail: string): Promise<{
    user: User | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmation(
    email: string,
  ): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Exchange auth code for session (OAuth/magic link flows)
   */
  async exchangeCodeForSession(code: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<{
    session: Session | null;
    error: AuthError | null;
  }> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error: error as AuthError };
    }
  }

  /**
   * Set up auth state change listener
   * Returns unsubscribe function
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ): { unsubscribe: () => void } {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return { unsubscribe: () => subscription.unsubscribe() };
  }

  /**
   * Helper: Check if user needs to confirm email
   */
  isWaitingForEmailConfirmation(user: User | null): boolean {
    return user !== null && user.email_confirmed_at === null;
  }

  /**
   * Helper: Check if response requires email confirmation
   */
  requiresEmailConfirmation(response: AuthResponse): boolean {
    return response.session === null && response.user !== null;
  }

  /**
   * Helper: Get user-friendly error message
   */
  /**
   * Helper: Get user-friendly error message
   */
  getErrorMessage(error: unknown): string {
    if (!error) return "";

    // Type guard to check if it's an AuthError
    if (typeof error === "object" && error !== null && "message" in error) {
      const authError = error as AuthError;

      // Custom error messages for common cases
      const errorMessages: Record<string, string> = {
        "Invalid login credentials": "Invalid email or password",
        "Email not confirmed": "Please confirm your email address",
        "User already registered": "An account with this email already exists",
        "User not found": "No account found with this email",
        "Invalid password": "Invalid email or password",
      };

      return errorMessages[authError.message] || authError.message;
    }

    // Fallback for non-AuthError types
    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  }
}
