import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Star, Plus } from 'lucide-react';
import { Store } from '@/Store';
import { useGetCompareQuery, useRemoveFromCompareMutation, useUpdateCompareVariantMutation } from '@/hooks/compareHooks';
import { toast } from 'react-toastify';
import LoadingBox from '@/components/LoadingBox';
import MessageBox from '@/components/MessageBox';
const imageUrl = (src) => {
    if (!src)
        return '/images/placeholder.png';
    if (src.startsWith('http'))
        return src;
    if (src.startsWith('/images/'))
        return src;
    if (src.startsWith('/uploads/'))
        return `http://localhost:4000${src}`;
    if (src.startsWith('/'))
        return src;
    return `/images/${src}`;
};
const COMPARISON_ATTRIBUTES = [
    { key: 'price', label: 'Giá' },
    { key: 'brand', label: 'Thương hiệu' },
    { key: 'category', label: 'Danh mục' },
    { key: 'rating', label: 'Đánh giá' },
    { key: 'color', label: 'Màu sắc' },
    { key: 'storage', label: 'Dung lượng' },
    { key: 'ram', label: 'RAM' },
    { key: 'stock', label: 'Tồn kho' },
];
export default function ComparePage() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const { data: compareData, isLoading } = useGetCompareQuery();
    const { mutateAsync: removeFromCompare, isPending } = useRemoveFromCompareMutation();
    const { mutateAsync: updateVariant } = useUpdateCompareVariantMutation();
    if (!userInfo) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center pl-56 pr-6", children: _jsx(MessageBox, { variant: "danger", children: "Vui l\u00F2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 xem danh s\u00E1ch so s\u00E1nh" }) }));
    }
    const handleRemove = async (compareId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách so sánh?'))
            return;
        try {
            await removeFromCompare(compareId);
            toast.success('Đã xóa khỏi danh sách so sánh');
        }
        catch {
            toast.error('Lỗi khi xóa');
        }
    };
    const handleVariantChange = async (compareId, variantIndex) => {
        try {
            await updateVariant({ compareId, variantIndex });
            toast.success('Đã cập nhật biến thể');
        }
        catch {
            toast.error('Lỗi khi cập nhật');
        }
    };
    const handleAddToCart = (item) => {
        const currentPrice = item.selectedVariant?.price || item.productPrice;
        const currentStock = item.selectedVariant?.countInStock || 0;
        if (currentStock === 0) {
            return toast.warn('Sản phẩm đã hết hàng');
        }
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: {
                _id: item.productId,
                name: item.productName,
                image: item.selectedVariant?.image || item.productImage,
                price: currentPrice,
                countInStock: currentStock,
                slug: item.productSlug,
                quantity: 1,
            },
        });
        toast.success('Đã thêm vào giỏ hàng');
    };
    // ✅ Hàm chuyển hướng về homepage rồi quay lại compare page
    const handleAddProductToCompare = () => {
        // Lưu đường dẫn hiện tại vào sessionStorage
        sessionStorage.setItem('redirectAfterCompare', '/compare');
        // Chuyển hướng về trang chính
        navigate('/');
        toast.info('Quay lại trang chính để thêm sản phẩm so sánh');
    };
    if (isLoading)
        return _jsx(LoadingBox, {});
    const typedData = compareData;
    const compareList = typedData?.compareList || [];
    const maxProducts = 5;
    const displayList = compareList.slice(0, maxProducts);
    const emptyCells = maxProducts - displayList.length;
    // ✅ Kiểm tra xem có nên redirect sau khi thêm sản phẩm không
    if (typeof window !== 'undefined' && sessionStorage.getItem('redirectAfterCompare')) {
        sessionStorage.removeItem('redirectAfterCompare');
    }
    return (_jsxs("div", { className: "min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10", children: [_jsx(Helmet, { children: _jsx("title", { children: "So s\u00E1nh s\u1EA3n ph\u1EA9m" }) }), _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300 flex items-center gap-2", children: [_jsx(ArrowLeftRight, { size: 32, className: "text-black" }), "SO S\u00C1NH S\u1EA2N PH\u1EA8M (", compareList.length, "/", maxProducts, ")"] }), compareList.length === 0 ? (_jsxs("div", { className: "bg-white p-12 text-center border border-dashed border-gray-400 transition duration-300 hover:shadow-inner shadow-md", children: [_jsx(ArrowLeftRight, { size: 64, className: "mx-auto text-gray-400 mb-4" }), _jsx("p", { className: "text-lg text-gray-600 mb-6 font-medium", children: "B\u1EA1n ch\u01B0a th\u00EAm s\u1EA3n ph\u1EA9m n\u00E0o \u0111\u1EC3 so s\u00E1nh." }), _jsx("button", { onClick: () => navigate('/'), className: "px-8 py-3 text-black border border-black hover:bg-gray-100 hover:scale-105 transition duration-300 font-semibold shadow-md", children: "B\u1EAET \u0110\u1EA6U MUA S\u1EAEM" })] })) : (_jsx("div", { className: "bg-white overflow-x-auto shadow-lg border border-gray-200", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: 'bg-gray-50', children: _jsxs("tr", { children: [_jsx("th", { className: "w-1/6 px-4 py-3 text-left text-sm font-bold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-20", children: "Thu\u1ED9c t\u00EDnh" }), displayList.map((item, index) => (_jsxs("th", { className: "w-1/6 px-4 py-3 text-center text-sm font-bold text-gray-900 border-r border-gray-200 last:border-r-0 min-w-[200px]", children: ["S\u1EA2N PH\u1EA8M ", index + 1] }, item._id))), Array(emptyCells).fill(0).map((_, index) => (_jsx("th", { className: "w-1/6 px-4 py-3 text-center text-sm font-bold text-gray-400 bg-gray-100 border-r border-gray-200 last:border-r-0 min-w-[200px]", children: "CH\u1ED6 TR\u1ED0NG" }, `empty-${index}`)))] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-100", children: [_jsxs("tr", { className: "transition duration-300", children: [_jsx("td", { className: "px-4 py-4 text-left font-bold text-gray-800 bg-gray-50 border-r border-gray-200 sticky left-0 z-10", children: "T\u00EAn s\u1EA3n ph\u1EA9m" }), displayList.map((item) => (_jsx("td", { className: "px-4 py-4 text-center border-r border-gray-200", children: _jsxs("div", { className: 'flex flex-col items-center gap-3', children: [_jsx("img", { src: imageUrl(item.selectedVariant?.image || item.productImage), alt: item.productName, className: "w-24 h-24 object-contain mx-auto border border-gray-100 cursor-pointer transition duration-300 hover:scale-105", onClick: () => navigate(`/product/${item.productSlug}`) }), _jsx("button", { onClick: () => navigate(`/product/${item.productSlug}`), className: "text-black hover:underline font-semibold text-sm transition duration-300 hover:text-gray-800 line-clamp-2", children: item.productName })] }) }, `name-${item._id}`))), Array(emptyCells).fill(0).map((_, index) => (_jsx("td", { className: "px-4 py-4 text-center text-gray-400 bg-gray-100 border-r border-gray-200", children: _jsxs("button", { onClick: handleAddProductToCompare, className: "mx-auto flex flex-col items-center gap-2 p-3 hover:bg-gray-200 transition duration-300 rounded", title: "Th\u00EAm s\u1EA3n ph\u1EA9m \u0111\u1EC3 so s\u00E1nh", children: [_jsx(Plus, { size: 28, className: "text-gray-500" }), _jsx("span", { className: "text-xs font-semibold text-gray-600", children: "Th\u00EAm s\u1EA3n ph\u1EA9m" })] }) }, `name-empty-${index}`)))] }), COMPARISON_ATTRIBUTES.map((attr, attrIndex) => (_jsxs("tr", { className: `hover:bg-gray-50 transition duration-300 hover:shadow-md shadow-md${attrIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`, children: [_jsx("td", { className: `px-4 py-4 text-left font-bold text-gray-800 border-r border-gray-200 sticky left-0 z-10 ${attrIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`, children: attr.label }), displayList.map((item) => (_jsx("td", { className: "px-4 py-4 text-center border-r border-gray-200", children: renderAttribute(item, attr.key, handleVariantChange) }, item._id))), Array(emptyCells).fill(0).map((_, index) => (_jsx("td", { className: "px-4 py-4 text-center text-gray-400 bg-gray-100 border-r border-gray-200", children: "-" }, `empty-cell-${index}`)))] }, attr.key))), _jsxs("tr", { className: "bg-gray-50 border-t border-gray-300", children: [_jsx("td", { className: "px-4 py-4 text-left font-bold text-gray-800 border-r border-gray-200 sticky left-0 z-10 bg-gray-50", children: "H\u00E0nh \u0111\u1ED9ng" }), displayList.map((item) => (_jsx("td", { className: "px-4 py-4 text-center border-r border-gray-200", children: _jsxs("div", { className: "flex flex-col items-center justify-center gap-2 ", children: [_jsx("button", { onClick: () => handleAddToCart(item), disabled: (item.selectedVariant?.countInStock || 0) === 0, className: "text-sm text-gray-700 hover:text-black hover:scale-105 transition p-1 font-bold", children: "+ Th\u00EAm v\u00E0o gi\u1ECF h\u00E0ng" }), _jsx("button", { onClick: () => handleRemove(item._id), disabled: isPending, className: "text-sm text-red-500 hover:text-red-700 hover:scale-105 transition p-1 font-bold", children: "- X\u00F3a kh\u1ECFi so s\u00E1nh" })] }) }, `action-${item._id}`))), Array(emptyCells).fill(0).map((_, index) => (_jsx("td", { className: "px-4 py-4 text-center text-gray-400 bg-gray-100 border-r border-gray-200", children: "-" }, `action-empty-${index}`)))] })] })] }) }))] })] }));
}
function renderAttribute(item, key, handleVariantChange) {
    let stockCount;
    switch (key) {
        case 'price':
            return (_jsxs("span", { className: "font-extrabold text-xl text-black", children: [(item.selectedVariant?.price || item.productPrice).toLocaleString('vi-VN'), " \u20AB"] }));
        case 'brand':
            return _jsx("span", { className: "font-medium text-gray-700 text-sm", children: item.productBrand });
        case 'category':
            return _jsx("span", { className: "text-gray-600 text-sm", children: item.productCategory });
        case 'rating':
            return (_jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx(Star, { size: 16, className: "text-yellow-500 fill-yellow-500" }), _jsx("span", { className: "font-bold", children: item.productRating }), _jsxs("span", { className: "text-gray-500 text-xs", children: ["(", item.productNumReviews, ")"] })] }));
        case 'color':
            return item.allVariants && item.allVariants.length > 1 ? (_jsx("select", { value: item.allVariants.findIndex((v) => v.color === item.selectedVariant?.color), onChange: (e) => handleVariantChange(item._id, parseInt(e.target.value)), className: "px-3 py-1 border border-gray-300 text-sm bg-white hover:border-black transition duration-200 outline-none", children: item.allVariants.map((v, idx) => (_jsx("option", { value: idx, children: v.color || 'N/A' }, idx))) })) : (_jsx("span", { children: item.selectedVariant?.color || 'N/A' }));
        case 'storage':
            return _jsx("span", { children: item.selectedVariant?.storage || 'N/A' });
        case 'ram':
            return _jsx("span", { children: item.selectedVariant?.ram || 'N/A' });
        case 'stock':
            stockCount = item.selectedVariant?.countInStock || 0;
            return (_jsx("span", { className: `px-3 py-1 text-sm font-medium ${stockCount > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`, children: stockCount > 0 ? `${stockCount} SP` : 'Hết hàng' }));
        default:
            return '-';
    }
}
