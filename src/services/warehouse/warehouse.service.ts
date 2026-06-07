import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  warehouseCategoriesApi,
  warehouseInventoryApi,
  warehouseItemsApi,
  warehouseMovementsApi,
  warehouseSuppliersApi,
  warehouseUnitsApi,
  warehousesApi
} from "./warehouse.api"
import type { IListParams } from "./warehouse.types"

// --- Helper for generating Query Keys ---
function createKeys(baseKey: string) {
  return {
    all: [baseKey] as const,
    lists: () => [...createKeys(baseKey).all, "list"] as const,
    list: (params?: IListParams) => [...createKeys(baseKey).lists(), params] as const,
    details: () => [...createKeys(baseKey).all, "detail"] as const,
    detail: (id: number) => [...createKeys(baseKey).details(), id] as const,
  }
}

const KEYS = {
  categories: createKeys("warehouse_categories"),
  inventory: createKeys("warehouse_inventory"),
  items: createKeys("warehouse_items"),
  movements: createKeys("warehouse_movements"),
  suppliers: createKeys("warehouse_suppliers"),
  units: createKeys("warehouse_units"),
  warehouses: createKeys("warehouses"),
}

// --- Helper for generating React Query Hooks ---
function createCrudHooks<T>(apiObj: any, keysObj: any) {
  return {
    useGetList: (params?: IListParams) => useQuery({
      queryKey: keysObj.list(params),
      queryFn: () => apiObj.getAll(params),
    }),
    useGetById: (id: number, enabled = true) => useQuery({
      queryKey: keysObj.detail(id),
      queryFn: () => apiObj.getById(id),
      enabled: !!id && enabled,
    }),
    useCreate: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (payload: Partial<T>) => apiObj.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keysObj.lists() })
      })
    },
    useUpdate: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<T> }) => apiObj.update(id, payload),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: keysObj.lists() })
          queryClient.invalidateQueries({ queryKey: keysObj.detail(variables.id) })
        }
      })
    },
    usePatch: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<T> }) => apiObj.patch(id, payload),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: keysObj.lists() })
          queryClient.invalidateQueries({ queryKey: keysObj.detail(variables.id) })
        }
      })
    },
    useDelete: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (id: number) => apiObj.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keysObj.lists() })
      })
    }
  }
}

// Hooks Exports
export const {
  useGetList: useGetWarehouseCategories,
  useGetById: useGetWarehouseCategoryById,
  useCreate: useCreateWarehouseCategory,
  usePatch: usePatchWarehouseCategory,
  useDelete: useDeleteWarehouseCategory
} = createCrudHooks<any>(warehouseCategoriesApi, KEYS.categories)

export const {
  useGetList: useGetWarehouseInventory,
  useGetById: useGetWarehouseInventoryById,
  usePatch: usePatchWarehouseInventory,
  // inventory typically doesn't have create/delete exposed or it is driven by movements
} = createCrudHooks<any>(warehouseInventoryApi, KEYS.inventory)

export const {
  useGetList: useGetWarehouseItems,
  useGetById: useGetWarehouseItemById,
  useCreate: useCreateWarehouseItem,
  usePatch: usePatchWarehouseItem,
  useDelete: useDeleteWarehouseItem
} = createCrudHooks<any>(warehouseItemsApi, KEYS.items)

export const {
  useGetList: useGetWarehouseMovements,
  useGetById: useGetWarehouseMovementById,
  useCreate: useCreateWarehouseMovement,
} = createCrudHooks<any>(warehouseMovementsApi, KEYS.movements)

export const {
  useGetList: useGetWarehouseSuppliers,
  useGetById: useGetWarehouseSupplierById,
  useCreate: useCreateWarehouseSupplier,
  usePatch: usePatchWarehouseSupplier,
  useDelete: useDeleteWarehouseSupplier
} = createCrudHooks<any>(warehouseSuppliersApi, KEYS.suppliers)

export const {
  useGetList: useGetWarehouseUnits,
  useGetById: useGetWarehouseUnitById,
  useCreate: useCreateWarehouseUnit,
  usePatch: usePatchWarehouseUnit,
  useDelete: useDeleteWarehouseUnit
} = createCrudHooks<any>(warehouseUnitsApi, KEYS.units)

export const {
  useGetList: useGetWarehouses,
  useGetById: useGetWarehouseById,
  useCreate: useCreateWarehouse,
  usePatch: usePatchWarehouse,
  useDelete: useDeleteWarehouse
} = createCrudHooks<any>(warehousesApi, KEYS.warehouses)
