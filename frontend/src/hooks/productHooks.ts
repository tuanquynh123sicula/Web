import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import type { Product } from '../types/Product'

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await apiClient.get<Product[]>(`/api/products`)
      if (!data) throw new Error('No product data received')
      return data
    },
  })

export const useGetProductDetailsBySlugQuery = (slug?: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required')
      const { data } = await apiClient.get<Product>(`/api/products/slug/${slug}`)
      if (!data) throw new Error('No product data received')
      return data
    },
    enabled: !!slug, 
  })
