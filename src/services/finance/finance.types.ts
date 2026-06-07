import type { IUser } from "../users"

// --- Finance Categories ---
export interface ITransactionCategory {
  id: number
  name: string
  is_active: boolean
  created_at: string
}

export interface ITransactionCategoryCreate {
  name: string
  is_active?: boolean
}

export type ITransactionCategoryUpdate = ITransactionCategoryCreate
export type ITransactionCategoryPatch = Partial<ITransactionCategoryCreate>

export interface ITransactionCategoryListParams {
  name?: string
  limit?: number
}

export interface ITransactionCategoryListResponse {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: ITransactionCategory[]
}

// --- Finance Transactions ---
export type TransactionType = 'income' | 'expense' | string
export type PaymentMethod = 'cash' | 'card' | 'transfer' | string

export interface ITransaction {
  id: number
  type: TransactionType
  amount: string
  payment_method: PaymentMethod
  category?: number | null
  category_details?: ITransactionCategory
  description?: string | null
  user?: number | null
  user_details?: IUser
  order?: number | null
  shift?: number | null
  date: string
}

export interface ITransactionCreate {
  type: TransactionType
  amount: string
  payment_method: PaymentMethod
  category?: number | null
  description?: string | null
  order?: number | null
  shift?: number | null
}

export type ITransactionUpdate = ITransactionCreate
export type ITransactionPatch = Partial<ITransactionCreate>

export interface ITransactionListParams {
  type?: TransactionType
  payment_method?: PaymentMethod
  category?: number
  user?: number
  limit?: number
  date_from?: string
  date_to?: string
}

export interface ITransactionListResponse {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: ITransaction[]
}
