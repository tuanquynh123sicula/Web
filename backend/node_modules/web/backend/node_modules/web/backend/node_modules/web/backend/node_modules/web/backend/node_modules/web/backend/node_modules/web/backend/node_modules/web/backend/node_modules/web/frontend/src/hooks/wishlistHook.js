import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apiClient';
export const useGetWishlistQuery = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/wishlist');
            return data;
        },
    });
};
export const useAddToWishlistMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productId) => {
            const { data } = await apiClient.post('/api/wishlist', { productId });
            return data;
        },
        onSuccess: () => {
            // ✅ Invalidate wishlist query để refetch
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};
export const useRemoveFromWishlistMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (wishlistId) => {
            const { data } = await apiClient.delete(`/api/wishlist/${wishlistId}`);
            return data;
        },
        onSuccess: () => {
            // ✅ Invalidate wishlist query để refetch
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};
export const useRemoveByProductIdMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productId) => {
            const { data } = await apiClient.delete(`/api/wishlist/product/${productId}`);
            return data;
        },
        onSuccess: () => {
            // ✅ Invalidate wishlist query để refetch
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};
export const useCheckWishlistMutation = () => {
    return useMutation({
        mutationFn: async (productId) => {
            const { data } = await apiClient.post(`/api/wishlist/check/${productId}`);
            return data;
        },
    });
};
