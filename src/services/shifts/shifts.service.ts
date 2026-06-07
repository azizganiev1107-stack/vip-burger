import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { shiftsServiceApi } from "./shifts.api"
import type { 
  IShiftCreate, 
  IShiftPatch, 
  IShiftUpdate, 
  IShiftListParams 
} from "./shifts.types"

export const SHIFTS_KEYS = {
  all: ["shifts"] as const,
  lists: () => [...SHIFTS_KEYS.all, "list"] as const,
  list: (params?: IShiftListParams) => [...SHIFTS_KEYS.lists(), params] as const,
  details: () => [...SHIFTS_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SHIFTS_KEYS.details(), id] as const,
}

export const useGetShifts = (params?: IShiftListParams) => {
  return useQuery({
    queryKey: SHIFTS_KEYS.list(params),
    queryFn: () => shiftsServiceApi.getShifts(params),
  })
}

export const useGetShiftById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: SHIFTS_KEYS.detail(id),
    queryFn: () => shiftsServiceApi.getShiftById(id),
    enabled: !!id && enabled,
  })
}

export const useCreateShift = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IShiftCreate) => shiftsServiceApi.createShift(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIFTS_KEYS.lists() })
    }
  })
}

export const useUpdateShift = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IShiftUpdate }) => 
      shiftsServiceApi.updateShift(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SHIFTS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: SHIFTS_KEYS.detail(variables.id) })
    }
  })
}

export const usePatchShift = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IShiftPatch }) => 
      shiftsServiceApi.patchShift(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SHIFTS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: SHIFTS_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteShift = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => shiftsServiceApi.deleteShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIFTS_KEYS.lists() })
    }
  })
}
