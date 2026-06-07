import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { financeServiceApi } from "./finance.api"
import type { 
  ITransactionCategoryCreate, 
  ITransactionCategoryPatch, 
  ITransactionCategoryUpdate, 
  ITransactionCategoryListParams,
  ITransactionCreate,
  ITransactionPatch,
  ITransactionUpdate,
  ITransactionListParams
} from "./finance.types"

// --- Keys for caching ---
export const FINANCE_KEYS = {
  categories: {
    all: ["finance-categories"] as const,
    lists: () => [...FINANCE_KEYS.categories.all, "list"] as const,
    list: (params?: ITransactionCategoryListParams) => [...FINANCE_KEYS.categories.lists(), params] as const,
    details: () => [...FINANCE_KEYS.categories.all, "detail"] as const,
    detail: (id: number) => [...FINANCE_KEYS.categories.details(), id] as const,
  },
  transactions: {
    all: ["finance-transactions"] as const,
    lists: () => [...FINANCE_KEYS.transactions.all, "list"] as const,
    list: (params?: ITransactionListParams) => [...FINANCE_KEYS.transactions.lists(), params] as const,
    details: () => [...FINANCE_KEYS.transactions.all, "detail"] as const,
    detail: (id: number) => [...FINANCE_KEYS.transactions.details(), id] as const,
  }
}

// ==========================================
// CATEGORIES HOOKS
// ==========================================
export const useGetCategories = (params?: ITransactionCategoryListParams) => {
  return useQuery({
    queryKey: FINANCE_KEYS.categories.list(params),
    queryFn: () => financeServiceApi.getCategories(params),
  })
}

export const useGetCategoryById = (id: number) => {
  return useQuery({
    queryKey: FINANCE_KEYS.categories.detail(id),
    queryFn: () => financeServiceApi.getCategoryById(id),
    enabled: !!id,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ITransactionCategoryCreate) => financeServiceApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories.lists() })
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ITransactionCategoryUpdate }) => 
      financeServiceApi.updateCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories.lists() })
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories.detail(variables.id) })
    }
  })
}

export const usePatchCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ITransactionCategoryPatch }) => 
      financeServiceApi.patchCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories.lists() })
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories.detail(variables.id) })
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => financeServiceApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories.lists() })
    }
  })
}

// ==========================================
// TRANSACTIONS HOOKS
// ==========================================
export const useGetTransactions = (params?: ITransactionListParams) => {
  return useQuery({
    queryKey: FINANCE_KEYS.transactions.list(params),
    queryFn: () => financeServiceApi.getTransactions(params),
  })
}

export const useGetTransactionById = (id: number) => {
  return useQuery({
    queryKey: FINANCE_KEYS.transactions.detail(id),
    queryFn: () => financeServiceApi.getTransactionById(id),
    enabled: !!id,
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ITransactionCreate) => financeServiceApi.createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions.lists() })
    }
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ITransactionUpdate }) => 
      financeServiceApi.updateTransaction(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions.lists() })
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions.detail(variables.id) })
    }
  })
}

export const usePatchTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ITransactionPatch }) => 
      financeServiceApi.patchTransaction(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions.lists() })
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions.detail(variables.id) })
    }
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => financeServiceApi.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transactions.lists() })
    }
  })
}
