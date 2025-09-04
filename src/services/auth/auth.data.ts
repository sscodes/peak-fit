import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AUTH_HOME, HOME } from '../../helpers/getters';
import { useAppDispatch } from '../../hooks/redux';
import { clearAuth, setAuthData } from '../../store/authSlice';
import type { AuthResponse, SignUpPayload } from '../../types/auth';
import { authKeys } from '../query-key-factory';
import { authService } from './auth.service';

// interface ApiError {
//   message: string;
//   code: string;
//   status: number;
//   errors?: {
//     field: string;
//     message: string;
//   }[];
// }

// Create User (Sign Up)
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ user }: { user: SignUpPayload }) => {
      const response = await authService.createUser(user);
      const data = await response.json();
      if (!response.ok || response.status >= 400) {
        throw new Error(data.message);
      }
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      // Store in Redux instead of localStorage
      dispatch(
        setAuthData({
          user: data.user,
          access_token: data.access_token,
        })
      );

      queryClient.invalidateQueries({
        queryKey: authKeys.createUser(),
        refetchType: 'none',
      });

      navigate(HOME);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// Login User
export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      user,
    }: {
      user: { email: string; password: string };
    }) => {
      const response = await authService.loginUser(user);
      const data = await response.json();
      if (!response.ok || response.status >= 400) {
        throw new Error(data.message);
      }
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      // Store in Redux instead of localStorage
      dispatch(
        setAuthData({
          user: data.user,
          access_token: data.access_token,
        })
      );

      queryClient.invalidateQueries({ queryKey: authKeys.loginUser() });

      navigate(HOME);

      // Navigate based on onboarding status
      // if (data.user.onboardingStatus === 'completed') {
      //   navigate(HOME);
      // } else {
      //   navigate(
      //     `/onboarding/${
      //       data.user.onboardingStatus || 'personality-assessment'
      //     }`
      //   );
      // }
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// Update User Password
export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      sessionToken,
      newPassword,
    }: {
      sessionToken: string;
      newPassword: string;
    }) => {
      const response = await authService.updateUserPassword({
        session_id: sessionToken,
        new_password: newPassword,
      });

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      const hasJson = contentType?.includes('application/json');

      if (!response.ok || response.status >= 400) {
        const errorData = hasJson
          ? await response.json()
          : { message: 'Request failed' };
        throw new Error(errorData.message);
      }

      // For success, check if there's JSON to parse
      if (hasJson && response.status !== 204) {
        return await response.json();
      }

      // Return a success indicator for empty responses
      return { success: true, message: 'Password reset successful' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.updateUserPassword(),
      });
      navigate(AUTH_HOME);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// // Delete User
// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: async ({
//       token,
//       userId,
//     }: {
//       token: string;
//       userId: string;
//     }) => {
//       const response = await authService.deleteUser(token, userId);
//       const data = await response.json();
//       if (!response.ok || response.status >= 400) {
//         throw new Error(data.message);
//       }
//       return data;
//     },
//     onSuccess: () => {
//       dispatch(clearAuth());
//       queryClient.invalidateQueries({ queryKey: authKeys.deleteUser() });
//       navigate('/login');
//     },
//     onError: (err) => {
//       console.error(err);
//     },
//   });
// };

// Send OTP Mail
export const useSendOTPMail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await authService.sendOTPMail(email);

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      const hasJson = contentType?.includes('application/json');

      if (!response.ok || response.status >= 400) {
        const errorData = hasJson
          ? await response.json()
          : { message: 'Request failed' };
        throw new Error(errorData.detail);
      }

      // For success, check if there's JSON to parse
      if (hasJson && response.status !== 204) {
        return await response.json();
      }

      // Return a success indicator for empty responses
      return { success: true, message: 'OTP sent successfully' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sendOTPMail() });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useCheckOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ otp }: { otp: string }) => {
      const response = await authService.checkOTP(otp);
      const data = await response.json();
      if (!response.ok || response.status >= 400) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.checkOTP() });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

// Fetch Current User (for session validation)
export const useCurrentUser = (options?: { enabled?: boolean }) => {
  // const dispatch = useAppDispatch();

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token');
      }

      const response = await authService.fetchCurrentUser();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return { ...data, access_token: token } as AuthResponse;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Logout
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authService.logout();
      return response.ok;
    },
    onSuccess: () => {
      dispatch(clearAuth());
      queryClient.clear();
      navigate(AUTH_HOME);
    },
    onError: () => {
      // Even on error, clear local state
      dispatch(clearAuth());
      queryClient.clear();
      navigate(AUTH_HOME);
    },
  });
};
