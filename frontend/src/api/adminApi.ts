import { Product } from '@/types/Product'
import { User } from '@/types/User'
import { Order } from '@/types/Order'
import { Blog } from '@/types/Blog'
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

export async function createProduct(product: Product) {
  const res = await apiClient.post('/api/products', product, {
    headers: authHeader(),
  })
  return res.data
}

export async function updateProduct(id: string, product: Product) {
  const { data } = await apiClient.put<Product>(
    `/api/admin/products/${id}`,
    product,
    { headers: authHeader() }
  )
  return data
}

// ✅ UPLOAD IMAGE - Chỉ định nghĩa 1 lần
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)
  try {
    const { data } = await apiClient.post<{ image: string }>(
      '/upload', // ← apiClient đã có /api prefix
      formData,
      {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return data.image
  } catch (error) {
    console.error('❌ Upload error:', error)
    throw error
  }
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

// === BLOGS ===
export const getAllBlogs = async () => {
  const { data } = await apiClient.get('/api/admin/blogs')
  return data
}

export const getBlogById = async (id: string) => {
  const { data } = await apiClient.get(`/api/admin/blogs/${id}`)
  return data
}

export const createBlog = async (blogData: Partial<Blog>) => {
  const { data } = await apiClient.post('/api/admin/blogs', blogData, {
    headers: authHeader(),
  })
  return data
}

export const updateBlog = async (id: string, blogData: Partial<Blog>) => {
  const { data } = await apiClient.put(`/api/admin/blogs/${id}`, blogData, {
    headers: authHeader(),
  })
  return data
}

export const deleteBlog = async (id: string) => {
  const { data } = await apiClient.delete(`/api/admin/blogs/${id}`, {
    headers: authHeader(),
  })
  return data
}

// === PUBLIC BLOGS ===
export const getPublicBlogs = async () => {
  const { data } = await apiClient.get('/api/admin/blogs/public/all')
  return data
}

export const getPublicBlogById = async (id: string) => {
  const { data } = await apiClient.get(`/api/admin/blogs/public/${id}`)
  return data
}