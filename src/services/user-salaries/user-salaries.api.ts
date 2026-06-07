import { $authHost } from "@/api"
import type { 
  IUserSalary, 
  IUserSalaryCreate, 
  IUserSalaryPatch, 
  IUserSalaryUpdate, 
  IUserSalaryListParams, 
  IUserSalaryListResponse 
} from "./user-salaries.types"

export const userSalariesServiceApi = {
  // GET /api/v1/admins/user-salaries
  getUserSalaries: async (params?: IUserSalaryListParams): Promise<IUserSalaryListResponse> => {
    const { data } = await $authHost.get<IUserSalaryListResponse>("/admins/user-salaries", { params })
    return data
  },

  // POST /api/v1/admins/user-salaries
  createUserSalary: async (payload: IUserSalaryCreate): Promise<IUserSalary> => {
    const { data } = await $authHost.post<IUserSalary>("/admins/user-salaries", payload)
    return data
  },

  // GET /api/v1/admins/user-salaries/{id}
  getUserSalaryById: async (id: number): Promise<IUserSalary> => {
    const { data } = await $authHost.get<IUserSalary>(`/admins/user-salaries/${id}`)
    return data
  },

  // PUT /api/v1/admins/user-salaries/{id}
  updateUserSalary: async (id: number, payload: IUserSalaryUpdate): Promise<IUserSalary> => {
    const { data } = await $authHost.put<IUserSalary>(`/admins/user-salaries/${id}`, payload)
    return data
  },

  // PATCH /api/v1/admins/user-salaries/{id}
  patchUserSalary: async (id: number, payload: IUserSalaryPatch): Promise<IUserSalary> => {
    const { data } = await $authHost.patch<IUserSalary>(`/admins/user-salaries/${id}`, payload)
    return data
  },

  // DELETE /api/v1/admins/user-salaries/{id}
  deleteUserSalary: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/admins/user-salaries/${id}`)
    return data
  }
}