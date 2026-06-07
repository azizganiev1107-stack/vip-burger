import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ordersServiceApi } from "./orders.api"
import type { 
  IOrderCreate, 
  IOrderPatch, 
  IOrderUpdate, 
  IOrderListParams,
  IProductCreate,
  IProductPatch,
  IProductUpdate,
  IProductListParams
} from "./orders.types"

// --- Keys for caching ---
export const ORDERS_KEYS = {
  orders: {
    all: ["orders"] as const,
    lists: () => [...ORDERS_KEYS.orders.all, "list"] as const,
    list: (params?: IOrderListParams) => [...ORDERS_KEYS.orders.lists(), params] as const,
    details: () => [...ORDERS_KEYS.orders.all, "detail"] as const,
    detail: (id: number) => [...ORDERS_KEYS.orders.details(), id] as const,
  },
  products: {
    all: ["products"] as const,
    lists: () => [...ORDERS_KEYS.products.all, "list"] as const,
    list: (params?: IProductListParams) => [...ORDERS_KEYS.products.lists(), params] as const,
    details: () => [...ORDERS_KEYS.products.all, "detail"] as const,
    detail: (id: number) => [...ORDERS_KEYS.products.details(), id] as const,
  }
}

// ==========================================
// ORDERS HOOKS
// ==========================================
export const useGetOrders = (params?: IOrderListParams) => {
  return useQuery({
    queryKey: ORDERS_KEYS.orders.list(params),
    queryFn: () => ordersServiceApi.getOrders(params),
  })
}

export const useGetOrderById = (id: number) => {
  return useQuery({
    queryKey: ORDERS_KEYS.orders.detail(id),
    queryFn: () => ordersServiceApi.getOrderById(id),
    enabled: !!id,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IOrderCreate) => ordersServiceApi.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.orders.lists() })
    }
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IOrderUpdate }) => 
      ordersServiceApi.updateOrder(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.orders.lists() })
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.orders.detail(variables.id) })
    }
  })
}

export const usePatchOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IOrderPatch }) => 
      ordersServiceApi.patchOrder(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.orders.lists() })
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.orders.detail(variables.id) })
    }
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersServiceApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.orders.lists() })
    }
  })
}

// ==========================================
// PRODUCTS HOOKS
// ==========================================
export const useGetProducts = (params?: IProductListParams) => {
  return useQuery({
    queryKey: ORDERS_KEYS.products.list(params),
    queryFn: () => ordersServiceApi.getProducts(params),
  })
}

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: ORDERS_KEYS.products.detail(id),
    queryFn: () => ordersServiceApi.getProductById(id),
    enabled: !!id,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IProductCreate) => ordersServiceApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.products.lists() })
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IProductUpdate }) => 
      ordersServiceApi.updateProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.products.lists() })
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.products.detail(variables.id) })
    }
  })
}

export const usePatchProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IProductPatch }) => 
      ordersServiceApi.patchProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.products.lists() })
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.products.detail(variables.id) })
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersServiceApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.products.lists() })
    }
  })
}