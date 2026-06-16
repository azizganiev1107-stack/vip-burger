import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { branchesServiceApi } from "./branches.api"
import type { IBranch, IListParams, IListResponse } from "./branches.types"

// --- Keys for caching ---
export const BRANCHES_KEYS = {
  all: ["branches"] as const,
  lists: () => [...BRANCHES_KEYS.all, "list"] as const,
  list: (params?: IListParams) => [...BRANCHES_KEYS.lists(), params] as const,
  details: () => [...BRANCHES_KEYS.all, "detail"] as const,
  detail: (id: number) => [...BRANCHES_KEYS.details(), id] as const,
}

// --- Queries ---
export const useGetBranches = (params?: IListParams, options?: any) => {
  return useQuery<IListResponse<IBranch>, Error>({
    queryKey: BRANCHES_KEYS.list(params),
    queryFn: () => branchesServiceApi.getAll(params),
    ...options
  })
}

export const useGetBranchById = (id: number, options?: any) => {
  return useQuery<IBranch, Error>({
    queryKey: BRANCHES_KEYS.detail(id),
    queryFn: () => branchesServiceApi.getById(id),
    enabled: !!id,
    ...options
  })
}

// --- Mutations ---
export const useCreateBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<IBranch>) => branchesServiceApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS.lists() })
    }
  })
}

export const useUpdateBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<IBranch> }) => 
      branchesServiceApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS.detail(variables.id) })
    }
  })
}

export const usePatchBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<IBranch> }) => 
      branchesServiceApi.patch(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => branchesServiceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEYS.lists() })
    }
  })
}
