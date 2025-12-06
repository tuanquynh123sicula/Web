import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/apiClient'

export const useGetCompareQuery = () => {
  return useQuery({
    queryKey: ['compare'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/compare')
      return data
    },
  })
}

export const useAddToCompareMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: { productId: string; variantIndex?: number }) => {
      const { data } = await apiClient.post('/api/compare', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compare'] })
    },
  })
}

export const useUpdateCompareVariantMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: { compareId: string; variantIndex: number }) => {
      const { data } = await apiClient.put(`/api/compare/${payload.compareId}`, {
        variantIndex: payload.variantIndex,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compare'] })
    },
  })
}

export const useRemoveFromCompareMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (compareId: string) => {
      const { data } = await apiClient.delete(`/api/compare/${compareId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compare'] })
    },
  })
}

export const useRemoveByProductIdMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await apiClient.delete(`/api/compare/product/${productId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compare'] })
    },
  })
}

export const useCheckCompareMutation = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await apiClient.post(`/api/compare/check/${productId}`)
      return data
    },
  })
}