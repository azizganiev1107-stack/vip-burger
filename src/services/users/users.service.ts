import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usersServiceApi } from "./users.api"
import type { 
  IUserCreate, 
  IUserPatch, 
  IUserUpdate, 
  IUserListParams 
} from "./users.types"

// --- Keys for caching ---
export const USERS_KEYS = {
  all: ["users"] as const,
  lists: () => [...USERS_KEYS.all, "list"] as const,
  list: (params?: IUserListParams) => [...USERS_KEYS.lists(), params] as const,
  details: () => [...USERS_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USERS_KEYS.details(), id] as const,
}

// --- Queries ---
export const useGetUsers = (params?: IUserListParams) => {
  return useQuery({
    queryKey: USERS_KEYS.list(params),
    queryFn: () => usersServiceApi.getUsers(params),
  })
}

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: () => usersServiceApi.getUserById(id),
    enabled: !!id,
  })
}

// --- Mutations ---
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IUserCreate) => usersServiceApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUserUpdate }) => 
      usersServiceApi.updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(variables.id) })
    }
  })
}

export const usePatchUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUserPatch }) => 
      usersServiceApi.patchUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersServiceApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() })
    }
  })
}
