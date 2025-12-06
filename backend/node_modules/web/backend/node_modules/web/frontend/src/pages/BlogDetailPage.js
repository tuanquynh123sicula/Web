import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import { getPublicBlogById, getPublicBlogs } from "@/api/adminApi";
// 🆕 Mock data chi tiết
const mockBlogsDetail = {
    'mock-1': {
        _id: 'mock-1',
        title: 'Top 5 laptop gaming đáng mua nhất năm 2025',
        category: 'Đánh giá',
        description: 'Cùng điểm qua những mẫu laptop gaming được cộng đồng yêu thích nhất với cấu hình khủng và giá tương đối hợp lý.',
        image: '/images/laptop/macbookairm2_16gb_256gb_bac.jpg',
        date: '15/11/2025',
        content: `Năm 2025 chứng kiến sự bùng nổ của laptop gaming...`,
    },
    'mock-2': {
        _id: 'mock-2',
        title: 'Apple M4 Pro chính thức ra mắt – Hiệu năng vượt xa kỳ vọng',
        category: 'Tin tức',
        description: 'Apple vừa công bố thế hệ chip M4 Pro mới với hiệu năng tăng 40% so với M3...',
        image: '/images/laptop/macbookairm2_16gb_256gb_trangvang.jpg',
        date: '14/11/2025',
        content: `Apple vừa chính thức công bố chip M4 Pro...`,
    },
    'mock-3': {
        _id: 'mock-3',
        title: 'Mẹo bảo quản tai nghe không dây để kéo dài tuổi thọ',
        category: 'Mẹo sử dụng',
        description: 'Hướng dẫn chi tiết cách bảo quản tai nghe TWS...',
        image: '/images/phukien/tainghe/tai-nghe-tws-xiaomi-redmi-buds-6-251224-104719-335-600x600.jpg',
        date: '13/11/2025',
        content: `Tai nghe không dây đang trở thành phụ kiện...`,
    },
    'mock-4': {
        _id: 'mock-4',
        title: 'Xu hướng smartphone 2025: AI và pin siêu khủng',
        category: 'Tin tức',
        description: 'Thị trường smartphone 2025 được dự báo...',
        image: '/images/iphone/ip17px_cam.jpg',
        date: '11/11/2025',
        content: `Thị trường smartphone 2025 đang chứng kiến...`,
    },
    'mock-5': {
        _id: 'mock-5',
        title: 'Tai nghe không dây premium - So sánh chi tiết',
        category: 'So sánh',
        description: 'So sánh các dòng tai nghe Bluetooth cao cấp...',
        image: '/images/phukien/tainghe/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-pro-r630n-100724-082455-600x600-1-600x600.jpg',
        date: '10/11/2025',
        content: `Thị trường tai nghe không dây premium...`,
    },
    'mock-6': {
        _id: 'mock-6',
        title: 'Sạc nhanh 100W - Công nghệ tương lai bây giờ',
        category: 'Đánh giá',
        description: 'Đánh giá chi tiết công nghệ sạc siêu nhanh 100W...',
        image: '/images/phukien/sacduphong/pin-sac-du-phong-25000mah-type-c-pd-qc-3-0-165w-anker-zolo-a1695-kem-cap-thumb-638942197395592306-600x600.jpg',
        date: '09/11/2025',
        content: `Công nghệ sạc nhanh đã phát triển nhanh chóng...`,
    },
};
export default function BlogDetailPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // 🆕 Thêm dependency array [id] để chỉ chạy khi id thay đổi
        loadBlogDetail();
    }, [id]);
    const loadBlogDetail = async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Loading blog:', id);
            // 🆕 Kiểm tra mock data trước
            if (id && mockBlogsDetail[id]) {
                console.log('✅ Found mock blog:', id);
                const mockBlog = mockBlogsDetail[id];
                setBlog(mockBlog);
                // Lấy bài liên quan từ mock data cùng category
                const relatedBlogIds = Object.keys(mockBlogsDetail).filter((key) => key !== id && mockBlogsDetail[key].category === mockBlog.category);
                const related = relatedBlogIds.slice(0, 2).map((key) => mockBlogsDetail[key]);
                setRelatedPosts(related);
                setIsLoading(false);
                return;
            }
            // 🆕 Nếu không phải mock, gọi API
            console.log('📡 Fetching from API...');
            const blogData = await getPublicBlogById(id);
            console.log('✅ API blog loaded:', blogData);
            setBlog(blogData);
            const allBlogs = await getPublicBlogs();
            const related = allBlogs
                .filter((b) => b._id !== id && b.category === blogData.category)
                .slice(0, 2);
            setRelatedPosts(related);
        }
        catch (error) {
            console.error('❌ Error loading blog:', error);
            setBlog(null);
            setRelatedPosts([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (_jsx("section", { className: "min-h-screen bg-white pl-56 pr-6 pt-20 pb-10 flex items-center justify-center", children: _jsx("p", { className: "text-gray-500 text-lg animate-pulse", children: "\u0110ang t\u1EA3i b\u00E0i vi\u1EBFt..." }) }));
    }
    if (!blog) {
        return (_jsx("section", { className: "min-h-screen bg-white pl-56 pr-6 pt-20 pb-10 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500 text-lg mb-4", children: "Kh\u00F4ng t\u00ECm th\u1EA5y b\u00E0i vi\u1EBFt" }), _jsx(Link, { to: "/blogs", className: "text-blue-600 hover:text-blue-800", children: "\u2190 Quay l\u1EA1i Blog" })] }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "min-h-screen bg-white pl-56 pr-6 pt-20 pb-10", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [blog.title, " - TECHHUB Blog"] }), _jsx("meta", { name: "description", content: blog.description })] }), _jsxs("div", { className: "max-w-7xl mx-auto grid md:grid-cols-3 gap-10", children: [_jsxs(motion.article, { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "md:col-span-2 bg-white p-8 rounded-2xl shadow-md", children: [_jsxs(Link, { to: "/blogs", className: "inline-flex items-center text-blue-500 hover:text-blue-700 mb-4", children: [_jsx(FaArrowLeft, { className: "mr-2" }), " Quay l\u1EA1i Blog"] }), _jsx(motion.h1, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-3xl md:text-4xl font-bold mb-4 text-gray-800", children: blog.title }), _jsxs("div", { className: "flex items-center gap-4 mb-6 text-gray-600 text-sm", children: [_jsx("span", { className: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full", children: blog.category }), _jsx("span", { children: blog.date })] }), _jsx(motion.img, { src: blog.image, alt: blog.title, className: "rounded-xl mb-8 shadow-lg w-full object-cover max-h-[450px]", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, onError: (e) => {
                                            console.warn('❌ Image failed:', blog.image);
                                            e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                                        } }), _jsxs("div", { className: "prose max-w-none prose-lg prose-gray whitespace-pre-wrap text-gray-700 leading-relaxed", children: [blog.description && (_jsx("p", { className: "text-gray-600 italic mb-4", children: blog.description })), _jsx("p", { children: blog.content })] }), _jsxs("div", { className: "flex justify-between mt-12 text-blue-500", children: [_jsxs(Link, { to: "/blogs", className: "flex items-center gap-2 hover:text-blue-700 transition", children: [_jsx(FaArrowLeft, {}), " Quay l\u1EA1i danh s\u00E1ch"] }), _jsxs(Link, { to: "/blogs", className: "flex items-center gap-2 hover:text-blue-700 transition", children: ["Xem th\u00EAm b\u00E0i kh\u00E1c ", _jsx(FaArrowRight, {})] })] })] }), _jsxs("aside", { className: "md:col-span-1 space-y-6", children: [_jsx("h3", { className: "font-semibold text-xl text-gray-700 mb-4 border-b border-gray-300 pb-2", children: "B\u00C0I VI\u1EBET LI\u00CAN QUAN" }), relatedPosts.length > 0 ? (relatedPosts.map((post) => (_jsx(Link, { to: `/blog/${post._id}`, className: "block", children: _jsxs(motion.div, { whileHover: { scale: 1.02 }, transition: { duration: 0.3 }, className: "bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer", children: [_jsx("img", { src: post.image, alt: post.title, className: "w-full h-40 object-cover", onError: (e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                    } }), _jsxs("div", { className: "p-4", children: [_jsx("h4", { className: "font-medium text-gray-800 hover:text-blue-600 transition line-clamp-2", children: post.title }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: post.date })] })] }) }, post._id)))) : (_jsx("p", { className: "text-gray-500 text-center py-4", children: "Kh\u00F4ng c\u00F3 b\u00E0i vi\u1EBFt li\u00EAn quan" }))] })] })] }), _jsx(Footer, {})] }));
}
