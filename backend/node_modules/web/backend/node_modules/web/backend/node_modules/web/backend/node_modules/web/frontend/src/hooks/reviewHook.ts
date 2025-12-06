import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/apiClient'

export const useGetReviewsQuery = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/reviews/${productId}`)
      return data
    },
  })
}

export const useCreateReviewMutation = () => {
  return useMutation({
    mutationFn: async (review: {
      productId: string
      rating: number
      title: string
      comment: string
    }) => {
      const { data } = await apiClient.post('/api/reviews', review)
      return data
    },
  })
}

export const useDeleteReviewMutation = () => {
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data } = await apiClient.delete(`/api/reviews/${reviewId}`)
      return data
    },
  })
}

export const useHelpfulReviewMutation = () => {
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data } = await apiClient.patch(`/api/reviews/${reviewId}/helpful`)
      return data
    },
  })
}