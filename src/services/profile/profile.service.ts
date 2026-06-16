import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { profileServiceApi } from "./profile.api"
import type { 
  IAdminProfile,
  IAdminProfileUpdate, 
  IChangePasswordRequest, 
  IUserProfile,
  IUserProfileUpdate 
} from "./profile.types"

// --- Keys for caching ---
export const PROFILE_KEYS = {
  adminProfile: ["adminProfile"] as const,
  userProfile: ["userProfile"] as const,
}

// --- Admin Profile Hooks ---
export const useGetAdminProfile = (options?: any) => {
  return useQuery<IAdminProfile, Error>({
    queryKey: PROFILE_KEYS.adminProfile,
    queryFn: profileServiceApi.getAdminProfile,
    ...options
  })
}

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IAdminProfileUpdate) => profileServiceApi.updateAdminProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.adminProfile })
    }
  })
}

export const usePatchAdminProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IAdminProfileUpdate) => profileServiceApi.patchAdminProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.adminProfile })
    }
  })
}

// --- Change Password Hook ---
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: IChangePasswordRequest) => profileServiceApi.changePassword(payload),
  })
}

export const useGetUserProfile = (options?: any) => {
  return useQuery<IUserProfile, Error>({
    queryKey: PROFILE_KEYS.userProfile,
    queryFn: profileServiceApi.getUserProfile,
    ...options
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IUserProfileUpdate) => profileServiceApi.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.userProfile })
    }
  })
}

export const usePatchUserProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IUserProfileUpdate) => profileServiceApi.patchUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.userProfile })
    }
  })
}
