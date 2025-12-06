import apiClient from '../apiClient';
export const authHeader = () => {
    const raw = localStorage.getItem('userInfo');
    const token = raw ? JSON.parse(raw).token : undefined;
    return token ? { Authorization: `Bearer ${token}` } : {};
};
export const getAllProducts = async () => {
    const { data } = await apiClient.get('/api/products/admin', {
        headers: authHeader(),
    });
    return data;
};
export const deleteProduct = async (id) => {
    await apiClient.delete(`/api/admin/products/${id}`, { headers: authHeader() });
};
export const getAllUsers = async () => {
    const { data } = await apiClient.get('/api/admin/users', {
        headers: authHeader(),
    });
    return data;
};
export const deleteUser = async (id) => {
    await apiClient.delete(`/api/admin/users/${id}`, { headers: authHeader() });
};
export const getAllOrders = async () => {
    const { data } = await apiClient.get('/api/admin/orders', {
        headers: authHeader(),
    });
    return data;
};
export async function createProduct(product) {
    const res = await apiClient.post('/api/products', product, {
        headers: authHeader(),
    });
    return res.data;
}
export async function updateProduct(id, product) {
    const { data } = await apiClient.put(`/api/admin/products/${id}`, product, { headers: authHeader() });
    return data;
}
// ✅ UPLOAD IMAGE - Chỉ định nghĩa 1 lần
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const { data } = await apiClient.post('/upload', // ← apiClient đã có /api prefix
        formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.image;
    }
    catch (error) {
        console.error('❌ Upload error:', error);
        throw error;
    }
};
export const updateOrderStatus = async (id, status) => {
    const { data } = await apiClient.patch(`/api/admin/orders/${id}/status`, { status }, { headers: authHeader() });
    return data;
};
export const updateUserRoleTier = async (id, payload) => {
    const { data } = await apiClient.patch(`/api/admin/users/${id}/role`, payload, {
        headers: authHeader(),
    });
    return data;
};
export const getUserOrders = async (id) => {
    const { data } = await apiClient.get(`/api/admin/users/${id}/orders`, {
        headers: authHeader(),
    });
    return data;
};
// === REPORTS / THỐNG KÊ MỚI ===
export const getReportSummary = async () => {
    const { data } = await apiClient.get('/api/admin/reports/summary', {
        headers: authHeader(),
    });
    return data;
};
// === BLOGS ===
export const getAllBlogs = async () => {
    const { data } = await apiClient.get('/api/admin/blogs');
    return data;
};
export const getBlogById = async (id) => {
    const { data } = await apiClient.get(`/api/admin/blogs/${id}`);
    return data;
};
export const createBlog = async (blogData) => {
    const { data } = await apiClient.post('/api/admin/blogs', blogData, {
        headers: authHeader(),
    });
    return data;
};
export const updateBlog = async (id, blogData) => {
    const { data } = await apiClient.put(`/api/admin/blogs/${id}`, blogData, {
        headers: authHeader(),
    });
    return data;
};
export const deleteBlog = async (id) => {
    const { data } = await apiClient.delete(`/api/admin/blogs/${id}`, {
        headers: authHeader(),
    });
    return data;
};
// === PUBLIC BLOGS ===
export const getPublicBlogs = async () => {
    const { data } = await apiClient.get('/api/admin/blogs/public/all');
    return data;
};
export const getPublicBlogById = async (id) => {
    const { data } = await apiClient.get(`/api/admin/blogs/public/${id}`);
    return data;
};
