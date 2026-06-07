import { $authHost } from "@/api"
import type { 
  IAdminProfile, 
  IAdminProfileUpdate, 
  IChangePasswordRequest, 
  IUserProfile, 
  IUserProfileUpdate 
} from "./profile.types"

export const profileServiceApi = {
  // --- Admin Profile Endpoints ---
  getAdminProfile: async (): Promise<IAdminProfile> => {
    const { data } = await $authHost.get<IAdminProfile>("/admins/profile")
    return data
  },
  
  updateAdminProfile: async (payload: IAdminProfileUpdate): Promise<IAdminProfile> => {
    const { data } = await $authHost.put<IAdminProfile>("/admins/profile", payload)
    return data
  },

  patchAdminProfile: async (payload: IAdminProfileUpdate): Promise<IAdminProfile> => {
    const { data } = await $authHost.patch<IAdminProfile>("/admins/profile", payload)
    return data
  },

  // --- Change Password ---
  changePassword: async (payload: IChangePasswordRequest): Promise<void> => {
    const { data } = await $authHost.post<void>("/change-password", payload)
    return data
  },

  // --- Regular User Profile Endpoints ---
  getUserProfile: async (): Promise<IUserProfile> => {
    const { data } = await $authHost.get<IUserProfile>("/profile")
    return data
  },

  updateUserProfile: async (payload: IUserProfileUpdate): Promise<IUserProfile> => {
    const { data } = await $authHost.put<IUserProfile>("/profile", payload)
    return data
  },

  patchUserProfile: async (payload: IUserProfileUpdate): Promise<IUserProfile> => {
    const { data } = await $authHost.patch<IUserProfile>("/profile", payload)
    return data
  }
}
