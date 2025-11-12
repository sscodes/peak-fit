// src/lib/supabaseAuth.ts
import { supabase } from './supabase';
import type {
  Session,
  User,
  AuthError,
  AuthChangeEvent,
} from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: AuthError | null;
}

/**
 * Supabase Auth Helper Functions
 * These functions handle authentication operations and return consistent response formats
 */
export const supabaseAuth = {
  /**
   * Sign up a new user with email and password
   */
  async signUp({
    email,
    password,
    fullName,
  }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session, // Will be null until email confirmed
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
  },

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
  },

  /**
   * Get the current session (checks localStorage and validates)
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
  },

  /**
   * Get current user (fetches fresh user data from Supabase)
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
  },

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
        captchaToken: undefined,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  /**
   * Update user password (requires current session)
   */
  async updatePassword(
    newPassword: string
  ): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  },

  /**
   * Update user email (will send confirmation to new email)
   */
  async updateEmail(
    newEmail: string
  ): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  },

  /**
   * Resend confirmation email
   */
  async resendConfirmation(
    email: string
  ): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  /**
   * Exchange auth code for session (for OAuth or magic link flows)
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
  },

  /**
   * Set up auth state change listener
   * Returns unsubscribe function
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): { unsubscribe: () => void } {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return { unsubscribe: () => subscription.unsubscribe() };
  },

  /**
   * Refresh the current session (force token refresh)
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
  },

  /**
   * Check if user needs to confirm email
   */
  isWaitingForEmailConfirmation(user: User | null): boolean {
    return user?.email_confirmed_at === null;
  },

  /**
   * Get auth error message for display
   */
  getErrorMessage(error: AuthError | null): string {
    if (!error) return '';

    return error.message;
  },
};
