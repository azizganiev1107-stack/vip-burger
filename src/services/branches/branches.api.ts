import { $authHost } from "@/api"
import type { IBranch, IListParams, IListResponse } from "./branches.types"

export const branchesServiceApi = {
  // GET /api/v1/branches/branches/
  getAll: async (params?: IListParams): Promise<IListResponse<IBranch>> => {
    const { data } = await $authHost.get<IListResponse<IBranch>>("/branches/branches/", { params })
    return data
  },

  // POST /api/v1/branches/branches/
  create: async (payload: Partial<IBranch>): Promise<IBranch> => {
    const { data } = await $authHost.post<IBranch>("/branches/branches/", payload)
    return data
  },

  // GET /api/v1/branches/branches/{id}/
  getById: async (id: number): Promise<IBranch> => {
    const { data } = await $authHost.get<IBranch>(`/branches/branches/${id}/`)
    return data
  },

  // PUT /api/v1/branches/branches/{id}/
  update: async (id: number, payload: Partial<IBranch>): Promise<IBranch> => {
    const { data } = await $authHost.put<IBranch>(`/branches/branches/${id}/`, payload)
    return data
  },

  // PATCH /api/v1/branches/branches/{id}/
  patch: async (id: number, payload: Partial<IBranch>): Promise<IBranch> => {
    const { data } = await $authHost.patch<IBranch>(`/branches/branches/${id}/`, payload)
    return data
  },

  // DELETE /api/v1/branches/branches/{id}/
  delete: async (id: number): Promise<void> => {
    await $authHost.delete<void>(`/branches/branches/${id}/`)
  }
}
