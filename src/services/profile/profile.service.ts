import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { profileServiceApi } from "./profile.api"
import type { 
  IAdminProfileUpdate, 
  IChangePasswordRequest, 
  IUserProfileUpdate 
} from "./profile.types"

// --- Keys for caching ---
export const PROFILE_KEYS = {
  adminProfile: ["adminProfile"] as const,
  userProfile: ["userProfile"] as const,
}

// --- Admin Profile Hooks ---
export const useGetAdminProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.adminProfile,
    queryFn: profileServiceApi.getAdminProfile,
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

// --- Regular User Profile Hooks ---
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.userProfile,
    queryFn: profileServiceApi.getUserProfile,
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
