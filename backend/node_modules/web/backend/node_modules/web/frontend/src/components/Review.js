import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import { Store } from '@/Store';
import { useGetReviewsQuery, useCreateReviewMutation, useDeleteReviewMutation, useHelpfulReviewMutation } from '@/hooks/reviewHook';
import { toast } from 'react-toastify';
import { Trash2, ThumbsUp } from 'lucide-react';
import LoadingBox from './LoadingBox';
import { motion } from 'framer-motion';
// Variants cho các phần tử xuất hiện
const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
export default function ReviewSection({ productId }) {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(false);
    const { data: reviewData, isLoading, refetch } = useGetReviewsQuery(productId);
    const { mutateAsync: createReview, isPending: isCreating } = useCreateReviewMutation();
    const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteReviewMutation();
    const { mutateAsync: markHelpful } = useHelpfulReviewMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error('Vui lòng đăng nhập để review');
            return;
        }
        if (!title.trim() || !comment.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        try {
            await createReview({
                productId,
                rating,
                title,
                comment,
            });
            toast.success('Review thành công!');
            setTitle('');
            setComment('');
            setRating(5);
            setShowForm(false);
            refetch();
        }
        catch (err) {
            const error = err;
            toast.error(error.response?.data?.error || 'Lỗi khi tạo review');
        }
    };
    const handleDelete = async (reviewId) => {
        if (!window.confirm('Xác nhận xóa review?'))
            return;
        try {
            await deleteReview(reviewId);
            toast.success('Xóa review thành công');
            refetch();
        }
        catch (err) {
            const error = err;
            toast.error(error.response?.data?.error || 'Lỗi khi xóa review');
        }
    };
    const handleHelpful = async (reviewId) => {
        try {
            await markHelpful(reviewId);
            refetch();
        }
        catch (err) {
            const error = err;
            toast.error(error.response?.data?.error || 'Lỗi khi đánh dấu hữu ích');
        }
    };
    if (isLoading)
        return _jsx(LoadingBox, {});
    const { reviews = [], avgRating = 0, totalReviews = 0, ratingDistribution = {} } = reviewData || {};
    return (_jsxs("div", { className: "mt-8 border-t pt-6", children: [_jsxs(motion.div, { initial: "hidden", animate: "visible", variants: { visible: { transition: { staggerChildren: 0.1 } } }, className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 p-4 border border-gray-200 bg-gray-50 shadow-inner", children: [_jsxs(motion.div, { variants: itemVariants, className: "col-span-1 flex flex-col items-center justify-center p-4", children: [_jsx("div", { className: "text-6xl font-extrabrabold text-black", children: Number(avgRating).toFixed(1) }), _jsx("div", { className: "flex gap-1 my-2", children: [...Array(5)].map((_, i) => (_jsx("span", { className: i < Math.round(Number(avgRating)) ? 'text-yellow-500' : 'text-gray-300', children: "\u2605" }, i))) }), _jsxs("p", { className: "text-sm text-gray-700 font-medium", children: ["T\u1EEB ", totalReviews, " \u0111\u00E1nh gi\u00E1"] })] }), _jsxs(motion.div, { variants: itemVariants, className: "col-span-2 space-y-3 p-4 border-l border-gray-200 md:pl-8", children: [_jsx("h3", { className: 'font-semibold text-gray-800 mb-2', children: "Ph\u00E2n b\u1ED1 \u0111\u00E1nh gi\u00E1" }), [5, 4, 3, 2, 1].map(stars => {
                                const count = ratingDistribution[stars] || 0;
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                return (_jsxs("div", { className: "flex items-center gap-3 transition duration-300 hover:bg-gray-100 p-1 -m-1", children: [_jsxs("span", { className: "text-sm w-12 flex items-center gap-1 font-medium", children: [stars, " ", _jsx("span", { className: 'text-yellow-500', children: "\u2605" })] }), _jsx("div", { className: "flex-1 bg-gray-200 rounded h-2 overflow-hidden shadow-inner", children: _jsx("div", { className: "bg-yellow-500 h-full transition-all duration-700 ease-out", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm text-gray-700 w-10 text-right font-bold", children: count })] }, stars));
                            })] })] }), !showForm ? (_jsx(motion.button, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.02 }, transition: { type: 'spring', stiffness: 300 }, onClick: () => setShowForm(true), className: "mb-6 px-8 py-3 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition duration-300 font-semibold shadow-md rounded-md", children: "VI\u1EBET \u0110\u00C1NH GI\u00C1 C\u1EE6A B\u1EA0N" })) : (_jsxs(motion.form, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, onSubmit: handleSubmit, className: "mb-8 p-6 border border-gray-300 bg-white shadow-lg rounded-md", children: [_jsx("h3", { className: 'text-xl font-bold mb-4 border-b pb-2', children: "G\u1EEDi \u0111\u00E1nh gi\u00E1 m\u1EDBi" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-bold mb-2 text-gray-700", children: "\u0110\u00E1nh gi\u00E1 (sao)" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map(star => (_jsx("button", { type: "button", onClick: () => setRating(star), className: `text-4xl transition duration-200 transform hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`, children: "\u2605" }, star))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-bold mb-2 text-gray-700", children: "Ti\u00EAu \u0111\u1EC1" }), _jsx("input", { type: "text", value: title, onChange: e => setTitle(e.target.value), placeholder: "V\u00ED d\u1EE5: S\u1EA3n ph\u1EA9m r\u1EA5t t\u1ED1t, giao h\u00E0ng nhanh ch\u00F3ng", className: "w-full border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-200 rounded-md" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-bold mb-2 text-gray-700", children: "Nh\u1EADn x\u00E9t chi ti\u1EBFt" }), _jsx("textarea", { value: comment, onChange: e => setComment(e.target.value), placeholder: "Chia s\u1EBB tr\u1EA3i nghi\u1EC7m c\u1EE7a b\u1EA1n...", rows: 4, className: "w-full border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-200 rounded-md" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: isCreating, className: "px-6 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 font-semibold shadow-sm rounded-md", children: isCreating ? 'Đang gửi...' : 'Gửi Đánh Giá' }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-6 py-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition duration-200 font-semibold shadow-sm rounded-md", children: "H\u1EE7y" })] })] })), _jsx("div", { className: "space-y-4 pt-6", children: reviews.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8 border border-dashed rounded-md", children: "H\u00E3y l\u00E0 ng\u01B0\u1EDDi \u0111\u1EA7u ti\u00EAn \u0111\u00E1nh gi\u00E1 s\u1EA3n ph\u1EA9m n\u00E0y!" })) : (reviews.map((review, index) => (_jsxs(motion.div, { initial: "hidden", animate: "visible", variants: itemVariants, custom: index, className: "p-4 border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-md rounded-md", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("div", { className: "flex gap-1 mb-1", children: [...Array(5)].map((_, i) => (_jsx("span", { className: i < review.rating ? 'text-yellow-500' : 'text-gray-300', children: "\u2605" }, i))) }), _jsx("p", { className: "font-bold text-lg mb-1", children: review.title }), _jsxs("p", { className: "text-sm text-gray-600", children: [review.userName, " \u2022 ", new Date(review.createdAt).toLocaleDateString('vi-VN')] })] }), userInfo?._id === review.userId && (_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => handleDelete(review._id), disabled: isDeleting, className: "text-red-600 hover:text-red-800 transition disabled:opacity-50 p-2", children: _jsx(Trash2, { size: 18 }) }))] }), _jsx("p", { className: "text-gray-700 mb-2 leading-relaxed", children: review.comment }), _jsxs(motion.button, { whileHover: { x: 5 }, onClick: () => handleHelpful(review._id), className: "text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1 transition p-1 border border-transparent hover:border-gray-300 rounded-md", children: [_jsx(ThumbsUp, { size: 14 }), "H\u1EEFu \u00EDch (", review.helpful, ")"] })] }, review._id)))) })] }));
}
