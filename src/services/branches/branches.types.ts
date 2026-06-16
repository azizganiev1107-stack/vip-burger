export interface IBranch {
  id: number
  name: string
  address?: string
  phone?: string
  is_active?: boolean
  created_at?: string
  [key: string]: any
}

export interface IListParams {
  limit?: number
  page?: number
  search?: string
  [key: string]: any
}

export interface IListResponse<T> {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: T[]
}
