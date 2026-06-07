import { $authHost } from "@/api"
import type { 
  IOrder, 
  IOrderCreate, 
  IOrderPatch, 
  IOrderUpdate, 
  IOrderListParams, 
  IOrderListResponse,
  IProduct,
  IProductCreate,
  IProductPatch,
  IProductUpdate,
  IProductListParams,
  IProductListResponse
} from "./orders.types"

export const ordersServiceApi = {
  // --- ORDERS ---
  // GET /api/v1/order/orders/
  getOrders: async (params?: IOrderListParams): Promise<IOrderListResponse> => {
    const { data } = await $authHost.get<IOrderListResponse>("/order/orders/", { params })
    return data
  },

  // POST /api/v1/order/orders/
  createOrder: async (payload: IOrderCreate): Promise<IOrder> => {
    const { data } = await $authHost.post<IOrder>("/order/orders/", payload)
    return data
  },

  // GET /api/v1/order/orders/{id}/
  getOrderById: async (id: number): Promise<IOrder> => {
    const { data } = await $authHost.get<IOrder>(`/order/orders/${id}/`)
    return data
  },

  // PUT /api/v1/order/orders/{id}/
  updateOrder: async (id: number, payload: IOrderUpdate): Promise<IOrder> => {
    const { data } = await $authHost.put<IOrder>(`/order/orders/${id}/`, payload)
    return data
  },

  // PATCH /api/v1/order/orders/{id}/
  patchOrder: async (id: number, payload: IOrderPatch): Promise<IOrder> => {
    const { data } = await $authHost.patch<IOrder>(`/order/orders/${id}/`, payload)
    return data
  },

  // DELETE /api/v1/order/orders/{id}/
  deleteOrder: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/order/orders/${id}/`)
    return data
  },

  // --- PRODUCTS ---
  // GET /api/v1/order/products/
  getProducts: async (params?: IProductListParams): Promise<IProductListResponse> => {
    const { data } = await $authHost.get<IProductListResponse>("/order/products/", { params })
    return data
  },

  // POST /api/v1/order/products/
  createProduct: async (payload: IProductCreate): Promise<IProduct> => {
    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('price', payload.price)
    if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active))
    if (payload.description) formData.append('description', payload.description)
    if (payload.image instanceof File) formData.append('image', payload.image)
    
    const { data } = await $authHost.post<IProduct>("/order/products/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // GET /api/v1/order/products/{id}/
  getProductById: async (id: number): Promise<IProduct> => {
    const { data } = await $authHost.get<IProduct>(`/order/products/${id}/`)
    return data
  },

  // PUT /api/v1/order/products/{id}/
  updateProduct: async (id: number, payload: IProductUpdate): Promise<IProduct> => {
    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('price', payload.price)
    if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active))
    if (payload.description) formData.append('description', payload.description)
    if (payload.image instanceof File) formData.append('image', payload.image)

    const { data } = await $authHost.put<IProduct>(`/order/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // PATCH /api/v1/order/products/{id}/
  patchProduct: async (id: number, payload: IProductPatch): Promise<IProduct> => {
    const formData = new FormData()
    if (payload.name) formData.append('name', payload.name)
    if (payload.price) formData.append('price', payload.price)
    if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active))
    if (payload.description) formData.append('description', payload.description)
    if (payload.image instanceof File) formData.append('image', payload.image)

    const { data } = await $authHost.patch<IProduct>(`/order/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // DELETE /api/v1/order/products/{id}/
  deleteProduct: async (id: number): Promise<void> => {
    const { data } = await $authHost.delete<void>(`/order/products/${id}/`)
    return data
  }
}