import { useMutation, useQuery } from '@tanstack/react-query' 
import apiClient from '../apiClient'
import type { CartItem, ShippingAddress } from '../types/Cart'
import type { Order } from '../types/Order'
import type { UserInfo } from '../types/UserInfo'


export const useGetOrderDetailsQuery = (id: string, userInfo: UserInfo) =>
  useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: async () =>
      (
        await apiClient.get<Order>(`api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
      ).data,
  })

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[]
      shippingAddress: ShippingAddress
      paymentMethod: string
      itemsPrice: number
      shippingPrice: number
      taxPrice: number
      discount?: number
      totalPrice: number
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `/api/orders`,
          order
        )
      ).data,
  })

  export const useGetOrderHistoryQuery = () =>
     useQuery({
       queryKey: ['order-history'],
       queryFn: async () =>
         (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
       refetchOnMount: 'always',
       refetchOnWindowFocus: 'always',
     })
     export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async ({
      orderId,
      paymentResult,
      token,
    }: {
      orderId: string
      paymentResult?: object
      token: string
    }) =>
      (
        await apiClient.put<Order>(
          `/api/orders/${orderId}/pay`,
          paymentResult || {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      ).data,
  })

  export const useDeleteOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (await apiClient.delete(`/api/orders/${orderId}`)).data,
  })

export const useDeleteAllOrdersMutation = () =>
  useMutation({
    mutationFn: async () =>
      (await apiClient.delete(`/api/orders`)).data,
  })
