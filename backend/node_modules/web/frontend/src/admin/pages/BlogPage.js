import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Upload, X, Eye, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicBlogs, createBlog, updateBlog, deleteBlog, } from '@/api/adminApi';
const CATEGORIES = ['Đánh giá', 'Tin tức', 'Mẹo sử dụng', 'So sánh'];
export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [form, setForm] = useState({
        title: '',
        category: 'Tin tức',
        description: '',
        content: '',
        image: '',
        date: new Date().toLocaleDateString('vi-VN'),
    });
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    useEffect(() => {
        loadBlogs();
    }, []);
    const loadBlogs = async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Đang tải blogs từ API...');
            const data = await getPublicBlogs();
            console.log('✅ Blogs loaded successfully:', data);
            setBlogs(data || []);
        }
        catch (error) {
            console.error('❌ Error loading blogs:', error);
            toast.error('Lỗi khi tải danh sách bài viết');
            setBlogs([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        try {
            console.log('📤 Converting image to base64...');
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result;
                console.log('✅ Image converted to base64, size:', base64.length);
                setForm({ ...form, image: base64 });
                toast.success('Tải ảnh lên thành công!');
            };
            reader.onerror = () => {
                toast.error('Lỗi đọc file!');
            };
            reader.readAsDataURL(file);
        }
        catch (error) {
            console.error('❌ Upload error:', error);
            toast.error('Lỗi tải ảnh!');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!form.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề bài viết!');
            return;
        }
        if (!form.description.trim()) {
            toast.error('Vui lòng nhập mô tả ngắn!');
            return;
        }
        if (!form.content.trim()) {
            toast.error('Vui lòng nhập nội dung bài viết!');
            return;
        }
        if (!form.image) {
            toast.error('Vui lòng upload ảnh bài viết!');
            return;
        }
        try {
            setIsLoading(true);
            if (editingId) {
                console.log('✏️ Updating blog:', editingId);
                await updateBlog(editingId, form);
                toast.success('Cập nhật bài viết thành công!');
            }
            else {
                console.log('📝 Creating new blog');
                await createBlog(form);
                toast.success('Tạo bài viết mới thành công!');
            }
            resetForm();
            loadBlogs();
        }
        catch (error) {
            console.error('❌ Submit error:', error);
            toast.error('Lỗi khi lưu bài viết!');
        }
        finally {
            setIsLoading(false);
        }
    };
    const resetForm = () => {
        setForm({
            title: '',
            category: 'Tin tức',
            description: '',
            content: '',
            image: '',
            date: new Date().toLocaleDateString('vi-VN'),
        });
        setEditingId(null);
    };
    const handleEdit = (blog) => {
        setForm(blog);
        setEditingId(blog._id || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xoá bài viết này không?'))
            return;
        try {
            setIsLoading(true);
            console.log('🗑️ Deleting blog:', id);
            await deleteBlog(id);
            toast.success('Xoá bài viết thành công!');
            loadBlogs();
        }
        catch (error) {
            console.error('❌ Delete error:', error);
            toast.error('Lỗi khi xoá bài viết!');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "p-6 bg-gray-50 min-h-screen", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight text-gray-900", children: editingId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới' }), _jsx("p", { className: "text-gray-600 mt-1", children: "Qu\u1EA3n l\u00FD b\u00E0i vi\u1EBFt blog c\u1EE7a b\u1EA1n" })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "bg-white border shadow-md p-6 mb-8 transition-all duration-500 hover:shadow-lg", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsxs("label", { className: "mb-2 font-semibold text-gray-700", children: ["Ti\u00EAu \u0111\u1EC1 b\u00E0i vi\u1EBFt ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: "border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm", placeholder: "Nh\u1EADp ti\u00EAu \u0111\u1EC1 b\u00E0i vi\u1EBFt" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("label", { className: "mb-2 font-semibold text-gray-700", children: ["Danh m\u1EE5c ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("select", { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), className: "border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm", children: CATEGORIES.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("label", { className: "mb-2 font-semibold text-gray-700", children: ["M\u00F4 t\u1EA3 ng\u1EAFn ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), className: "border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none", rows: 2, placeholder: "Nh\u1EADp m\u00F4 t\u1EA3 ng\u1EAFn (hi\u1EC3n th\u1ECB tr\u00EAn trang danh s\u00E1ch)" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("label", { className: "mb-2 font-semibold text-gray-700", children: ["N\u1ED9i dung b\u00E0i vi\u1EBFt ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), className: "border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none", rows: 8, placeholder: "Nh\u1EADp n\u1ED9i dung b\u00E0i vi\u1EBFt" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("label", { className: "mb-2 font-semibold text-gray-700", children: ["\u1EA2nh b\u00E0i vi\u1EBFt ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("label", { className: "border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-400", children: [_jsx(Upload, { size: 24, className: "text-gray-400 mb-2" }), _jsx("span", { className: "text-sm text-gray-600", children: "Ch\u1ECDn ho\u1EB7c k\u00E9o \u1EA3nh v\u00E0o \u0111\u00E2y" }), _jsx("input", { type: "file", onChange: handleFileUpload, className: "hidden", accept: "image/*", disabled: isLoading })] }), _jsx(AnimatePresence, { children: form.image && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "mt-4 relative inline-block", children: [_jsx("img", { src: form.image, alt: "preview", className: "h-32 object-contain bg-gray-50 p-2 border" }), _jsx(motion.button, { whileHover: { scale: 1.1, rotate: 90 }, whileTap: { scale: 0.9 }, type: "button", onClick: () => setForm({ ...form, image: '' }), className: "absolute top-0 right-0 bg-red-500 text-white p-1 transition-all duration-300 hover:bg-red-600", children: _jsx(X, { size: 16 }) })] })) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, type: "submit", disabled: isLoading, className: `flex-1 bg-blue-600 text-white px-4 py-2 font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`, children: isLoading ? 'Đang xử lý...' : (editingId ? 'Lưu thay đổi' : 'Đăng bài viết') }), editingId && (_jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, type: "button", onClick: resetForm, className: "flex-1 border px-4 py-2 font-semibold transition-all duration-300 hover:bg-gray-50 shadow-md hover:shadow-lg", children: "H\u1EE7y" }))] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "mb-6", children: _jsxs("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: ["Danh s\u00E1ch b\u00E0i vi\u1EBFt (", blogs.length, ")"] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 }, className: "bg-white border shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-100 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-800", children: "Ti\u00EAu \u0111\u1EC1" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-800", children: "Danh m\u1EE5c" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-800", children: "Ng\u00E0y \u0111\u0103ng" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-800", children: "H\u00E0nh \u0111\u1ED9ng" })] }) }), _jsx("tbody", { children: _jsx(AnimatePresence, { mode: "wait", children: isLoading ? (_jsx(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-gray-500", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" }), "\u0110ang t\u1EA3i..."] }) }) })) : blogs.length === 0 ? (_jsx(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-gray-500", children: "Ch\u01B0a c\u00F3 b\u00E0i vi\u1EBFt n\u00E0o" }) })) : (blogs.map((blog, idx) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3, delay: idx * 0.05 }, className: "border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900 max-w-xs truncate", children: blog.title }), _jsx("td", { className: "px-4 py-3", children: _jsx(motion.span, { whileHover: { scale: 1.05 }, className: "inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 transition-all duration-300", children: blog.category }) }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: blog.date }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, className: "border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 shadow-sm hover:shadow-md", onClick: () => setPreview(blog), title: "Xem tr\u01B0\u1EDBc", children: _jsx(Eye, { size: 16 }) }), _jsx(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, className: "border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:border-green-400 shadow-sm hover:shadow-md", onClick: () => handleEdit(blog), title: "Ch\u1EC9nh s\u1EEDa", children: _jsx(Edit2, { size: 16 }) }), _jsx(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, className: "border border-red-300 px-3 py-1 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-50 hover:border-red-400 shadow-sm hover:shadow-md", onClick: () => handleDelete(blog._id), title: "Xo\u00E1", children: _jsx(Trash2, { size: 16 }) })] }) })] }, blog._id)))) }) })] }) }) }), _jsx(AnimatePresence, { children: preview && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: () => setPreview(null), children: _jsxs(motion.div, { initial: { scale: 0.9, y: 20 }, animate: { scale: 1, y: 0 }, exit: { scale: 0.9, y: 20 }, transition: { type: "spring", duration: 0.5 }, className: "bg-white p-6 w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: preview.title }), _jsx(motion.button, { whileHover: { scale: 1.1, rotate: 90 }, whileTap: { scale: 0.9 }, className: "p-1 hover:bg-gray-100 transition-all duration-300", onClick: () => setPreview(null), children: _jsx(X, { size: 24, className: "text-gray-600" }) })] }), preview.image && (_jsx(motion.img, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.1 }, src: preview.image, alt: preview.title, className: "w-full h-48 object-cover mb-4 border" })), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "space-y-2 mb-4", children: [_jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-semibold", children: "Danh m\u1EE5c:" }), " ", preview.category] }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-semibold", children: "Ng\u00E0y \u0111\u0103ng:" }), " ", preview.date] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "mb-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "M\u00F4 t\u1EA3:" }), _jsx("p", { className: "text-gray-700", children: preview.description })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "N\u1ED9i dung:" }), _jsx("p", { className: "text-gray-700 whitespace-pre-wrap", children: preview.content })] }), _jsx(motion.button, { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, className: "w-full border px-4 py-2 mt-6 font-semibold transition-all duration-300 hover:bg-gray-50 shadow-md hover:shadow-lg", onClick: () => setPreview(null), children: "\u0110\u00F3ng" })] }) })) })] }));
}
