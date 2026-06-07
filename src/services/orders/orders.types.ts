// --- Products ---
export interface IProduct {
  id: number
  name: string
  description?: string | null
  price: string
  image?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IProductCreate {
  name: string
  description?: string | null
  price: string
  image?: string | File | null
  is_active?: boolean
}

export type IProductUpdate = IProductCreate
export type IProductPatch = Partial<IProductCreate>

export interface IProductListParams {
  name?: string
  is_active?: boolean
  limit?: number
  page?: number
}

export interface IProductListResponse {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: IProduct[]
}

export interface IOrder {
  id: number
  user?: number | null
  user_details?: any
  total_amount?: string
  phone?: string
  payment_type?: string
  is_paid?: boolean
  status?: string
  items?: any[]
  created_at?: string
  updated_at?: string
}

export interface IOrderItem {
  product: number
  quantity: number
  price?: string
}

export interface IOrderCreate {
  user?: number | null
  phone: string
  payment_type: string
  is_paid?: boolean
  status?: string
  total_amount?: string
  items: IOrderItem[]
}

export type IOrderUpdate = IOrderCreate
export type IOrderPatch = Partial<IOrderCreate>

export interface IOrderListParams {
  is_paid?: boolean
  end_date?: string
  limit?: number
  page?: number
}

export interface IOrderListResponse {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: IOrder[]
}