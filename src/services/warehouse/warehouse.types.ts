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
  item_details?: IWarehouseItem
  quantity?: number | string
  warehouse?: number
  warehouse_details?: IWarehouse
  destination_warehouse?: number
  destination_warehouse_details?: IWarehouse
  movement_type?: 'in' | 'out' | 'transfer' | string
  date?: string
  notes?: string
  user?: number
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
  branch?: any
  branch_id?: number | null
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
