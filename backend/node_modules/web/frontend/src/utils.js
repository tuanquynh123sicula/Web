export const getError = (error) => {
    return error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
};
export const convertProductToCartItem = (product, selectedVariant) => {
    // ✅ FIX: Kiểm tra selectedVariant trước
    const variant = selectedVariant || product.variants?.[0];
    return {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        image: variant?.image || product.image,
        price: variant?.price ?? product.price ?? 0, // ✅ Fallback to product.price
        countInStock: variant?.countInStock ?? product.countInStock ?? 0,
        quantity: 1,
    };
};
export const authHeader = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo)
        return {};
    const user = JSON.parse(userInfo);
    if (!user.token)
        return {};
    return { Authorization: `Bearer ${user.token}` };
};
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null)
        return '0₫';
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(number))
        return '0₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};
