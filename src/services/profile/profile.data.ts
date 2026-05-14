import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { DASHBOARD } from "@/helpers/getters";
import { useAppDispatch } from "@/hooks/redux";
import { ProfileService } from "./profile.service";
import { updateProfile } from "@/store/authSlice";
import type { Profile } from "@/types/profile";
import { profileKeys } from "@/services/query-key-factory";
import { notifyError } from "@/helpers/helper";

/**
 * Singleton instance of ProfileService
 */
const profileService = new ProfileService();

/**
 * Helper function to handle profile errors
 */
export const handleProfileError = (error: unknown) => {
  const errorMessage = profileService.getErrorMessage(error as Error);
  notifyError(errorMessage);
  return errorMessage;
};

/**
 * Hook: Get user profile by ID
 */
export const useGetProfile = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: async () => {
      const { data, error } = await profileService.getProfile(userId);
      if (error) throw error;
      if (!data) throw new Error("Profile not found");
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get current user's profile
 */
export const useGetCurrentProfile = () => {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: async () => {
      const { data, error } = await profileService.getCurrentUserProfile();
      if (error) throw error;
      if (!data) throw new Error("Profile not found");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Update profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<Profile>;
    }) => {
      const { data, error } = await profileService.updateProfile(
        userId,
        updates,
      );

      if (error) throw error;
      if (!data) throw new Error("Failed to update profile");

      return data;
    },
    onSuccess: (data) => {
      // Update profile in Redux
      dispatch(updateProfile(data));

      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.current(),
      });
    },
    onError: (error: unknown) => {
      handleProfileError(error);
    },
  });
};

/**
 * Hook: Complete onboarding
 */
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data, error } = await profileService.completeOnboarding(userId);

      if (error) throw error;
      if (!data) throw new Error("Failed to complete onboarding");

      return data;
    },
    onSuccess: (data) => {
      // Update profile in Redux
      dispatch(updateProfile({ is_onboarded: true }));

      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.current(),
      });

      // Navigate to dashboard
      navigate(DASHBOARD);
    },
    onError: (error: unknown) => {
      handleProfileError(error);
    },
  });
};

/**
 * Hook: Upload avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const { url, error } = await profileService.uploadAvatar(userId, file);

      if (error) throw error;
      if (!url) throw new Error("Failed to upload avatar");

      return { avatar: url };
    },
    onSuccess: (data, variables) => {
      // Update profile in Redux
      dispatch(updateProfile({ avatar: data.avatar }));

      // Invalidate profile queries
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.current(),
      });
    },
    onError: (error: unknown) => {
      handleProfileError(error);
    },
  });
};

/**
 * Hook: Get profile completion percentage
 */
export const useProfileCompletion = (userId: string) => {
  return useQuery({
    queryKey: profileKeys.completion(userId),
    queryFn: () => profileService.getProfileCompletion(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
