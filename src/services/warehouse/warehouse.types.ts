export interface IWarehouseCategory {
  id: number
  name?: string
  description?: string
  [key: string]: any
}

export interface IWarehouseInventory {
  id: number
  item?: number
  warehouse?: number
  quantity?: number | string
  [key: string]: any
}

export interface IWarehouseItem {
  id: number
  name?: string
  category?: number
  unit?: number
  supplier?: number
  price?: string
  [key: string]: any
}

export interface IWarehouseMovement {
  id: number
  item?: number
  quantity?: number | string
  from_warehouse?: number
  to_warehouse?: number
  type?: string
  [key: string]: any
}

export interface IWarehouseSupplier {
  id: number
  name?: string
  phone?: string
  address?: string
  [key: string]: any
}

export interface IWarehouseUnit {
  id: number
  name?: string
  code?: string
  [key: string]: any
}

export interface IWarehouse {
  id: number
  name?: string
  location?: string
  [key: string]: any
}

// Basic list params
export interface IListParams {
  limit?: number
  page?: number
  search?: string
  [key: string]: any
}

// Responses
export interface IListResponse<T> {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: T[]
}
