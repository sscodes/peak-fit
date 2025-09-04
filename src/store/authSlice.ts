import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { AuthState, User, AuthResponse } from '../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthResponse>) => {
      const { user, access_token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.accessToken = access_token;
      sessionStorage.setItem('access_token', access_token);
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      sessionStorage.removeItem('access_token');
    },

    initializeAuth: (state, action: PayloadAction<AuthResponse | null>) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
      }
      state.isInitialized = true;
    },

    setInitialized: (state) => {
      state.isInitialized = true;
    },

    // TaskMate specific actions
    // updateLastActive: (state) => {
    //   if (state.user) {
    //     state.user.lastActive = new Date().toISOString();
    //   }
    // },

    // incrementLoginStreak: (state) => {
    //   if (state.user) {
    //     state.user.loginStreak = (state.user.loginStreak || 0) + 1;
    //   }
    // },

    // updateOnboardingStatus: (
    //   state,
    //   action: PayloadAction<User['onboardingStatus']>
    // ) => {
    //   if (state.user) {
    //     state.user.onboardingStatus = action.payload;
    //   }
    // },
  },
});

export const {
  setAuthData,
  updateUser,
  clearAuth,
  initializeAuth,
  setInitialized,
  //   updateLastActive,
  //   incrementLoginStreak,
  //   updateOnboardingStatus,
} = authSlice.actions;

// Selectors with proper typing
export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;
export const selectIsInitialized = (state: RootState): boolean =>
  state.auth.isInitialized;
// export const selectOnboardingStatus = (
//   state: RootState
// ): User['onboardingStatus'] | undefined => state.auth.user?.onboardingStatus;

export default authSlice.reducer;
