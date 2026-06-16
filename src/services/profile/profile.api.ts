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
    const { data } = await $authHost.get<{ data: IAdminProfile }>("/admins/profile")
    return data.data
  },
  
  updateAdminProfile: async (payload: IAdminProfileUpdate): Promise<IAdminProfile> => {
    const { data } = await $authHost.put<{ data: IAdminProfile }>("/admins/profile", payload)
    return data.data
  },

  patchAdminProfile: async (payload: IAdminProfileUpdate): Promise<IAdminProfile> => {
    const { data } = await $authHost.patch<{ data: IAdminProfile }>("/admins/profile", payload)
    return data.data
  },

  // --- Change Password ---
  changePassword: async (payload: IChangePasswordRequest): Promise<void> => {
    const { data } = await $authHost.post<void>("/change-password", payload)
    return data
  },

  // --- Regular User Profile Endpoints ---
  getUserProfile: async (): Promise<IUserProfile> => {
    const { data } = await $authHost.get<{ data: IUserProfile }>("/profile")
    return data.data
  },

  updateUserProfile: async (payload: IUserProfileUpdate): Promise<IUserProfile> => {
    const { data } = await $authHost.put<{ data: IUserProfile }>("/profile", payload)
    return data.data
  },

  patchUserProfile: async (payload: IUserProfileUpdate): Promise<IUserProfile> => {
    const { data } = await $authHost.patch<{ data: IUserProfile }>("/profile", payload)
    return data.data
  }
}
