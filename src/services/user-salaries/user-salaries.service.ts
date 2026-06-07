import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userSalariesServiceApi } from "./user-salaries.api"
import type { 
  IUserSalaryCreate, 
  IUserSalaryPatch, 
  IUserSalaryUpdate, 
  IUserSalaryListParams 
} from "./user-salaries.types"

// --- Keys for caching ---
export const USER_SALARIES_KEYS = {
  all: ["user-salaries"] as const,
  lists: () => [...USER_SALARIES_KEYS.all, "list"] as const,
  list: (params?: IUserSalaryListParams) => [...USER_SALARIES_KEYS.lists(), params] as const,
  details: () => [...USER_SALARIES_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_SALARIES_KEYS.details(), id] as const,
}

// --- Queries ---
export const useGetUserSalaries = (params?: IUserSalaryListParams) => {
  return useQuery({
    queryKey: USER_SALARIES_KEYS.list(params),
    queryFn: () => userSalariesServiceApi.getUserSalaries(params),
  })
}

export const useGetUserSalaryById = (id: number) => {
  return useQuery({
    queryKey: USER_SALARIES_KEYS.detail(id),
    queryFn: () => userSalariesServiceApi.getUserSalaryById(id),
    enabled: !!id,
  })
}

// --- Mutations ---
export const useCreateUserSalary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IUserSalaryCreate) => userSalariesServiceApi.createUserSalary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SALARIES_KEYS.lists() })
    }
  })
}

export const useUpdateUserSalary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUserSalaryUpdate }) => 
      userSalariesServiceApi.updateUserSalary(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_SALARIES_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: USER_SALARIES_KEYS.detail(variables.id) })
    }
  })
}

export const usePatchUserSalary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUserSalaryPatch }) => 
      userSalariesServiceApi.patchUserSalary(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_SALARIES_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: USER_SALARIES_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteUserSalary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userSalariesServiceApi.deleteUserSalary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SALARIES_KEYS.lists() })
    }
  })
}