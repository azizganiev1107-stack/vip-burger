import { $authHost } from "@/api"
import type { 
  IRole, 
  IRoleCreate, 
  IRolePatch, 
  IRoleUpdate, 
  IRoleListParams, 
  IRoleListResponse 
} from "./roles.types"

export const rolesServiceApi = {
  // GET /api/v1/admins/roles
  getRoles: async (params?: IRoleListParams): Promise<IRoleListResponse> => {
    const { data } = await $authHost.get<IRoleListResponse>("/admins/roles", { params })
    return data
  },

  // POST /api/v1/admins/roles
  createRole: async (payload: IRoleCreate): Promise<IRole> => {
    const { data } = await $authHost.post<IRole>("/admins/roles", payload)
    return data
  },

  // GET /api/v1/admins/roles/{id}
  getRoleById: async (id: number): Promise<IRole> => {
    const { data } = await $authHost.get<IRole>(`/admins/roles/${id}`)
    return data
  },

  // PUT /api/v1/admins/roles/{id}
  updateRole: async (id: number, payload: IRoleUpdate): Promise<IRole> => {
    const { data } = await $authHost.put<IRole>(`/admins/roles/${id}`, payload)
    return data
  },

  // PATCH /api/v1/admins/roles/{id}
  patchRole: async (id: number, payload: IRolePatch): Promise<IRole> => {
    const { data } = await $authHost.patch<IRole>(`/admins/roles/${id}`, payload)
    return data
  },

  // DELETE /api/v1/admins/roles/{id}
  deleteRole: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/admins/roles/${id}`)
    return data
  }
}