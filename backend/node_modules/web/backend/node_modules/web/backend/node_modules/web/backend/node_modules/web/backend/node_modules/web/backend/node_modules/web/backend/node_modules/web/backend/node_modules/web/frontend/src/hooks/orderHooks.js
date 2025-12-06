import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
export const useGetOrderDetailsQuery = (id, userInfo) => useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await apiClient.get(`api/orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
    })).data,
});
export const useCreateOrderMutation = () => useMutation({
    mutationFn: async (order) => (await apiClient.post(`/api/orders`, order)).data,
});
export const useGetOrderHistoryQuery = () => useQuery({
    queryKey: ['order-history'],
    queryFn: async () => (await apiClient.get(`/api/orders/mine`)).data,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
});
export const usePayOrderMutation = () => useMutation({
    mutationFn: async ({ orderId, paymentResult, token, }) => (await apiClient.put(`/api/orders/${orderId}/pay`, paymentResult || {}, {
        headers: { Authorization: `Bearer ${token}` },
    })).data,
});
export const useDeleteOrderMutation = () => useMutation({
    mutationFn: async (orderId) => (await apiClient.delete(`/api/orders/${orderId}`)).data,
});
export const useDeleteAllOrdersMutation = () => useMutation({
    mutationFn: async () => (await apiClient.delete(`/api/orders`)).data,
});
export const useGetRecentOrdersQuery = (limit) => useQuery({
    queryKey: ['orders', 'recent', limit],
    queryFn: async () => (await apiClient.get(`/api/orders/mine?limit=${limit}`)).data,
});
