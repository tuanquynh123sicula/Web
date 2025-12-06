import { useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
export const useGetProductsQuery = (filters) => useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
        const params = new URLSearchParams();
        if (filters?.category)
            params.append('category', filters.category);
        if (filters?.minPrice)
            params.append('minPrice', String(filters.minPrice));
        if (filters?.maxPrice)
            params.append('maxPrice', String(filters.maxPrice));
        if (filters?.rating)
            params.append('rating', String(filters.rating));
        if (filters?.sortBy)
            params.append('sortBy', filters.sortBy);
        if (filters?.inStock)
            params.append('inStock', 'true');
        const queryString = params.toString();
        const url = queryString ? `/api/products?${queryString}` : '/api/products';
        const { data } = await apiClient.get(url);
        if (!data)
            throw new Error('No product data received');
        return data;
    },
});
export const useGetProductDetailsBySlugQuery = (slug) => useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
        if (!slug)
            throw new Error('Slug is required');
        const { data } = await apiClient.get(`/api/products/slug/${slug}`);
        if (!data)
            throw new Error('No product data received');
        return data;
    },
    enabled: !!slug,
});
export const useGetRelatedProductsQuery = (category, currentProductId, limit = 4) => useQuery({
    queryKey: ['products', 'related', category],
    queryFn: async () => {
        const { data } = await apiClient.get(`/api/products/related?category=${category}&exclude=${currentProductId}&limit=${limit}`);
        return data;
    },
    enabled: !!category,
});
