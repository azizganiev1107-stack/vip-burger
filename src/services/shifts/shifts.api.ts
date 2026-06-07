import { $authHost } from "@/api"
import type { 
  IShift, 
  IShiftCreate, 
  IShiftPatch, 
  IShiftUpdate, 
  IShiftListParams, 
  IShiftListResponse 
} from "./shifts.types"

export const shiftsServiceApi = {
  // GET /api/v1/shifts/
  getShifts: async (params?: IShiftListParams): Promise<IShiftListResponse> => {
    const { data } = await $authHost.get<IShiftListResponse>("/shifts/", { params })
    return data
  },

  // POST /api/v1/shifts/
  createShift: async (payload: IShiftCreate): Promise<IShift> => {
    const { data } = await $authHost.post<IShift>("/shifts/", payload)
    return data
  },

  // GET /api/v1/shifts/{id}/
  getShiftById: async (id: number): Promise<IShift> => {
    const { data } = await $authHost.get<IShift>(`/shifts/${id}/`)
    return data
  },

  // PUT /api/v1/shifts/{id}/
  updateShift: async (id: number, payload: IShiftUpdate): Promise<IShift> => {
    const { data } = await $authHost.put<IShift>(`/shifts/${id}/`, payload)
    return data
  },

  // PATCH /api/v1/shifts/{id}/
  patchShift: async (id: number, payload: IShiftPatch): Promise<IShift> => {
    const { data } = await $authHost.patch<IShift>(`/shifts/${id}/`, payload)
    return data
  },

  // DELETE /api/v1/shifts/{id}/
  deleteShift: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/shifts/${id}/`)
    return data
  }
}
