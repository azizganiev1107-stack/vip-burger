import { $authHost } from "@/api"
import type { 
  IUser, 
  IUserCreate, 
  IUserPatch, 
  IUserUpdate, 
  IUserListParams, 
  IUserListResponse 
} from "./users.types"

export const usersServiceApi = {
  // GET /api/v1/admins/users
  getUsers: async (params?: IUserListParams): Promise<IUserListResponse> => {
    const { data } = await $authHost.get<IUserListResponse>("/admins/users", { params })
    return data
  },

  // POST /api/v1/admins/users
  createUser: async (payload: IUserCreate): Promise<IUser> => {
    const { data } = await $authHost.post<IUser>("/admins/users", payload)
    return data
  },

  // GET /api/v1/admins/users/{id}
  getUserById: async (id: number): Promise<IUser> => {
    const { data } = await $authHost.get<IUser>(`/admins/users/${id}`)
    return data
  },

  // PUT /api/v1/admins/users/{id}
  updateUser: async (id: number, payload: IUserUpdate): Promise<IUser> => {
    const { data } = await $authHost.put<IUser>(`/admins/users/${id}`, payload)
    return data
  },

  // PATCH /api/v1/admins/users/{id}
  patchUser: async (id: number, payload: IUserPatch): Promise<IUser> => {
    const { data } = await $authHost.patch<IUser>(`/admins/users/${id}`, payload)
    return data
  },

  // DELETE /api/v1/admins/users/{id}
  deleteUser: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/admins/users/${id}`)
    return data
  }
}
