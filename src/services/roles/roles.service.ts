import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rolesServiceApi } from "./roles.api"
import type { 
  IRoleCreate, 
  IRolePatch, 
  IRoleUpdate, 
  IRoleListParams 
} from "./roles.types"

// --- Keys for caching ---
export const ROLES_KEYS = {
  all: ["roles"] as const,
  lists: () => [...ROLES_KEYS.all, "list"] as const,
  list: (params?: IRoleListParams) => [...ROLES_KEYS.lists(), params] as const,
  details: () => [...ROLES_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ROLES_KEYS.details(), id] as const,
}

// --- Queries ---
export const useGetRoles = (params?: IRoleListParams) => {
  return useQuery({
    queryKey: ROLES_KEYS.list(params),
    queryFn: () => rolesServiceApi.getRoles(params),
  })
}

export const useGetRoleById = (id: number) => {
  return useQuery({
    queryKey: ROLES_KEYS.detail(id),
    queryFn: () => rolesServiceApi.getRoleById(id),
    enabled: !!id,
  })
}

// --- Mutations ---
export const useCreateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IRoleCreate) => rolesServiceApi.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEYS.lists() })
    }
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IRoleUpdate }) => 
      rolesServiceApi.updateRole(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ROLES_KEYS.detail(variables.id) })
    }
  })
}

export const usePatchRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IRolePatch }) => 
      rolesServiceApi.patchRole(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ROLES_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => rolesServiceApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEYS.lists() })
    }
  })
}