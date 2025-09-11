export interface User {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  // createdAt?: string;
  // updatedAt?: string;
  // // TaskMate specific fields
  // onboardingStatus?:
  //   | 'pending'
  //   | 'personality_assessment'
  //   | 'goals_setup'
  //   | 'completed';
  // preferences?: UserPreferences;
  // lastActive?: string;
  // loginStreak?: number;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
  };
  timezone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
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

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
