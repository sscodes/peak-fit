// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/setAuthData',
          'auth/initializeAuth',
          'auth/updateUser',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.session',
          'payload.profile',
          'payload.user',
        ],
        // Ignore these paths in the state
        ignoredPaths: ['auth.session', 'auth.user', 'auth.profile'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
