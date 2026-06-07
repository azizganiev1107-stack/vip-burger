import { $authHost } from "@/api"
import type { 
  ITransactionCategory, 
  ITransactionCategoryCreate, 
  ITransactionCategoryPatch, 
  ITransactionCategoryUpdate, 
  ITransactionCategoryListParams, 
  ITransactionCategoryListResponse,
  ITransaction,
  ITransactionCreate,
  ITransactionPatch,
  ITransactionUpdate,
  ITransactionListParams,
  ITransactionListResponse
} from "./finance.types"

export const financeServiceApi = {
  // --- CATEGORIES ---
  // GET /api/v1/finance/categories/
  getCategories: async (params?: ITransactionCategoryListParams): Promise<ITransactionCategoryListResponse> => {
    const { data } = await $authHost.get<ITransactionCategoryListResponse>("/finance/categories/", { params })
    return data
  },

  // POST /api/v1/finance/categories/
  createCategory: async (payload: ITransactionCategoryCreate): Promise<ITransactionCategory> => {
    const { data } = await $authHost.post<ITransactionCategory>("/finance/categories/", payload)
    return data
  },

  // GET /api/v1/finance/categories/{id}/
  getCategoryById: async (id: number): Promise<ITransactionCategory> => {
    const { data } = await $authHost.get<ITransactionCategory>(`/finance/categories/${id}/`)
    return data
  },

  // PUT /api/v1/finance/categories/{id}/
  updateCategory: async (id: number, payload: ITransactionCategoryUpdate): Promise<ITransactionCategory> => {
    const { data } = await $authHost.put<ITransactionCategory>(`/finance/categories/${id}/`, payload)
    return data
  },

  // PATCH /api/v1/finance/categories/{id}/
  patchCategory: async (id: number, payload: ITransactionCategoryPatch): Promise<ITransactionCategory> => {
    const { data } = await $authHost.patch<ITransactionCategory>(`/finance/categories/${id}/`, payload)
    return data
  },

  // DELETE /api/v1/finance/categories/{id}/
  deleteCategory: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/finance/categories/${id}/`)
    return data
  },

  // --- TRANSACTIONS ---
  // GET /api/v1/finance/transactions/
  getTransactions: async (params?: ITransactionListParams): Promise<ITransactionListResponse> => {
    const { data } = await $authHost.get<ITransactionListResponse>("/finance/transactions/", { params })
    return data
  },

  // POST /api/v1/finance/transactions/
  createTransaction: async (payload: ITransactionCreate): Promise<ITransaction> => {
    const { data } = await $authHost.post<ITransaction>("/finance/transactions/", payload)
    return data
  },

  // GET /api/v1/finance/transactions/{id}/
  getTransactionById: async (id: number): Promise<ITransaction> => {
    const { data } = await $authHost.get<ITransaction>(`/finance/transactions/${id}/`)
    return data
  },

  // PUT /api/v1/finance/transactions/{id}/
  updateTransaction: async (id: number, payload: ITransactionUpdate): Promise<ITransaction> => {
    const { data } = await $authHost.put<ITransaction>(`/finance/transactions/${id}/`, payload)
    return data
  },

  // PATCH /api/v1/finance/transactions/{id}/
  patchTransaction: async (id: number, payload: ITransactionPatch): Promise<ITransaction> => {
    const { data } = await $authHost.patch<ITransaction>(`/finance/transactions/${id}/`, payload)
    return data
  },

  // DELETE /api/v1/finance/transactions/{id}/
  deleteTransaction: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/finance/transactions/${id}/`)
    return data
  }
}
