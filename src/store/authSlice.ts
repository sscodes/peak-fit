// src/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { RootState } from './index';

// Define your Profile type based on the database schema
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  body_fat_percentage?: number;
  fitness_level?: string;
  primary_goal?: string;
  training_days_per_week?: number;
  training_location?: string;
  onboarding_completed: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  // JSONB fields
  health_medical?: any;
  movement_assessment?: any;
  equipment_access?: any;
  nutrition_profile?: any;
  // Add other profile fields as needed
}

export interface AuthState {
  isAuthenticated: boolean;
  user: SupabaseUser | null;  // Supabase auth.users data
  profile: UserProfile | null; // Your public.profiles data
  session: Session | null;     // Full Supabase session (includes tokens)
  isInitialized: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  profile: null,
  session: null,
  isInitialized: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set complete auth data after sign in/up
    setAuthData: (state, action: PayloadAction<{
      session: Session;
      profile?: UserProfile;
    }>) => {
      const { session, profile } = action.payload;
      state.isAuthenticated = true;
      state.session = session;
      state.user = session.user;
      state.profile = profile || null;
      state.isLoading = false;
    },

    // Update just the profile data
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    // Update Supabase user metadata
    updateUser: (state, action: PayloadAction<SupabaseUser>) => {
      state.user = action.payload;
      if (state.session) {
        state.session.user = action.payload;
      }
    },

    // Clear all auth data on logout
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.profile = null;
      state.session = null;
      state.isLoading = false;
      // Note: Supabase client will handle clearing localStorage
    },

    // Initialize auth on app load
    initializeAuth: (state, action: PayloadAction<{
      session: Session | null;
      profile?: UserProfile | null;
    }>) => {
      const { session, profile } = action.payload;
      if (session) {
        state.isAuthenticated = true;
        state.session = session;
        state.user = session.user;
        state.profile = profile || null;
      }
      state.isInitialized = true;
      state.isLoading = false;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set initialized flag
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },

    // Update onboarding status
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      if (state.profile) {
        state.profile.onboarding_completed = action.payload;
      }
    },

    // Handle auth error
    setAuthError: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.profile = null;
      state.session = null;
      state.isLoading = false;
    },
  },
});

export const {
  setAuthData,
  updateProfile,
  updateUser,
  clearAuth,
  initializeAuth,
  setLoading,
  setInitialized,
  setOnboardingCompleted,
  setAuthError,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState): SupabaseUser | null => 
  state.auth.user;
export const selectProfile = (state: RootState): UserProfile | null =>
  state.auth.profile;
export const selectSession = (state: RootState): Session | null =>
  state.auth.session;
export const selectIsInitialized = (state: RootState): boolean =>
  state.auth.isInitialized;
export const selectIsLoading = (state: RootState): boolean =>
  state.auth.isLoading;
export const selectOnboardingCompleted = (state: RootState): boolean =>
  state.auth.profile?.onboarding_completed || false;

export default authSlice.reducer;