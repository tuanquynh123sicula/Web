import { Product } from '@/types/Product'
import { User } from '@/types/User'
import { Order } from '@/types/Order'
import apiClient from '../apiClient'

export const authHeader = () => {
  const raw = localStorage.getItem('userInfo')
  const token: string | undefined = raw ? JSON.parse(raw).token : undefined
  return token ? { Authorization: `Bearer ${token}` } : {}
}


export const getAllProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>('/api/products/admin', {
    headers: authHeader(),
  })
  return data
}

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/products/${id}`, { headers: authHeader() })
}

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/api/admin/users', {
    headers: authHeader(),
  })
  return data
}

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/users/${id}`, { headers: authHeader() })
}

export const getAllOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>('/api/admin/orders', {
    headers: authHeader(),
  })
  return data
}

export const createProduct = async (data: {
  name: string
  price: number
  image: string
  brand: string
  category: string
  countInStock: number
  description: string
  rating?: number
  numReviews?: number
}) => {
  const res = await apiClient.post('/api/products', data, {
    headers: authHeader(),
  })
  return res.data
}


export const updateProduct = async (
  id: string,
  updates: Partial<Product>
): Promise<Product> => {
  const { data } = await apiClient.put<Product>(
    `/api/admin/products/${id}`,
    updates,
    { headers: authHeader() }
  )
  return data
}
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await apiClient.post<{ image: string }>(
  '/api/upload',
  formData,
  {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  }
)
return data.image

}

export const updateOrderStatus = async (id: string, status: string) => {
  const { data } = await apiClient.patch(
    `/api/admin/orders/${id}/status`,
    { status },
    { headers: authHeader() }
  )
  return data
}

export const updateUserRoleTier = async (
  id: string,
  payload: { isAdmin: boolean; tier: 'regular' | 'vip' | 'new' }
) => {
  const { data } = await apiClient.patch(`/api/admin/users/${id}/role`, payload, {
    headers: authHeader(),
  })
  return data
}

export const getUserOrders = async (id: string) => {
  const { data } = await apiClient.get(`/api/admin/users/${id}/orders`, {
    headers: authHeader(),
  })
  return data
}