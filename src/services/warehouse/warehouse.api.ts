import { $authHost } from "@/api"
import type { 
  IListParams, 
  IListResponse,
  IWarehouseCategory,
  IWarehouseInventory,
  IWarehouseItem,
  IWarehouseMovement,
  IWarehouseSupplier,
  IWarehouseUnit,
  IWarehouse
} from "./warehouse.types"

// --- Helper for generating CRUD api methods ---
function createCrudApi<T>(basePath: string) {
  return {
    getAll: async (params?: IListParams): Promise<IListResponse<T>> => {
      const { data } = await $authHost.get<IListResponse<T>>(basePath, { params })
      return data
    },
    getById: async (id: number): Promise<T> => {
      const { data } = await $authHost.get<T>(`${basePath}${id}/`)
      return data
    },
    create: async (payload: Partial<T>): Promise<T> => {
      const { data } = await $authHost.post<T>(basePath, payload)
      return data
    },
    update: async (id: number, payload: Partial<T>): Promise<T> => {
      const { data } = await $authHost.put<T>(`${basePath}${id}/`, payload)
      return data
    },
    patch: async (id: number, payload: Partial<T>): Promise<T> => {
      const { data } = await $authHost.patch<T>(`${basePath}${id}/`, payload)
      return data
    },
    delete: async (id: number): Promise<void> => {
      const { data } = await $authHost.delete<void>(`${basePath}${id}/`)
      return data
    }
  }
}

// APIs
export const warehouseCategoriesApi = createCrudApi<IWarehouseCategory>("/warehouse/categories/")
export const warehouseInventoryApi = createCrudApi<IWarehouseInventory>("/warehouse/inventory/")
export const warehouseItemsApi = createCrudApi<IWarehouseItem>("/warehouse/items/")
export const warehouseMovementsApi = createCrudApi<IWarehouseMovement>("/warehouse/movements/")
export const warehouseSuppliersApi = createCrudApi<IWarehouseSupplier>("/warehouse/suppliers/")
export const warehouseUnitsApi = createCrudApi<IWarehouseUnit>("/warehouse/units/")
export const warehousesApi = createCrudApi<IWarehouse>("/warehouse/warehouses/")
