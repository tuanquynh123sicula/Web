import Footer from '@/components/Footer'
import LoadingBox from '@/components/LoadingBox'
import MessageBox from '@/components/MessageBox'
import ProductItem from '@/components/ProductItem'
import { useGetProductsQuery } from '@/hooks/productHooks'
// 💡 THAY ĐỔI TỪ Scale SANG ArrowLeftRight
import { ArrowLeftRight } from 'lucide-react' 
import { useGetCompareQuery } from '@/hooks/compareHooks'
import type { ApiError } from '@/types/ApiError'
import type { Product } from '@/types/Product'
import { getError } from '@/utils'
import { motion, Variants } from 'framer-motion'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface FilterState {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sortBy?: string
  inStock?: boolean
}

const CATEGORIES = [
  { name: 'iPhone', img: '/logo/iphone.png' },
  { name: 'Samsung', img: '/logo/samsung.png' },
  { name: 'Xiaomi', img: '/logo/xiaomi.png' },
  { name: 'Honor', img: '/logo/honor.png' },
  { name: 'Laptop', img: '/logo/laptop.png' },
  { name: 'Accessories', img: '/logo/accessories.png' },
]

const CATEGORIES_TO_SHOW = CATEGORIES.slice(0, 6)

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeInOut" 
      } 
    },
};
export default function HomePage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const query = params.get('query') || ''
  const urlCategory = params.get('category') || ''
  const normalized = query.trim().toLowerCase()
  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 8;

  const [filters, setFilters] = useState<FilterState>({
    category: urlCategory || undefined,
    minPrice: 0,
    maxPrice: 100000000,
    sortBy: 'newest',
    inStock: false,
  })
  
  React.useEffect(() => {
    setFilters(prev => {
        if (prev.category !== urlCategory) {
            return { ...prev, category: urlCategory || undefined };
        }
        return prev;
    });
  }, [urlCategory]);


  const { data: products, isLoading, error } = useGetProductsQuery({
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
    sortBy: filters.sortBy,
    inStock: filters.inStock,
  })

  const { data: compareData } = useGetCompareQuery()
  const compareCount = compareData?.count || 0

  const banners = [
    '/banner/IMG_20251106_175224.png',
    '/banner/banner3.png',
    '/banner/IMG_20251106_174944.png',
    '/banner/IMG_20251106_175148.png',
  ]
  
const filteredProducts: Product[] =
  (products as Product[] | undefined)
    ?.filter((p) => {
      if (normalized) {
        const haystack = `${p.name ?? ''} ${p.brand ?? ''} ${p.category ?? ''} ${p.description ?? ''}`.toLowerCase()
        if (!haystack.includes(normalized)) return false
      }
      if (filters.rating) {
        if (typeof p.rating !== 'number' || p.rating < filters.rating) return false
      }
      if (filters.inStock && p.countInStock <= 0) return false

      return true
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-low') {
        return (a.price || 0) - (b.price || 0) 
      }
      if (filters.sortBy === 'price-high') {
        return (b.price || 0) - (a.price || 0) 
      }
      return (b.rating || 0) - (a.rating || 0);

    }) ?? []

  const handleCategoryChange = (cat: string) =>
    setFilters((prev) => ({ ...prev, category: prev.category === cat ? undefined : cat }))

  const handleReset = () =>
    setFilters({ minPrice: 0, maxPrice: 100000000, sortBy: 'newest', inStock: false })

  const featured = filteredProducts.slice(0, 4)
  const newArrivals = filteredProducts.slice(4, 12)
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  const navigate = useNavigate()

  return (
    <div className="bg-white text-gray-800 ">
      
      {/* 🌟 HERO BANNER */}
      <section className="relative max-w-screen-2xl mx-auto shadow-lg overflow-hidden transition-shadow duration-500">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="rounded-none"
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-100 w-full">
                <img 
                    src={b} 
                    alt={`Banner ${i + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out" 
                    // Thêm nhẹ hiệu ứng Zoom cho Banner
                    style={{ transform: i === 0 ? 'scale(1.03)' : 'scale(1)' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto px-4 py-8 max-w-[900px] scale-[0.90] origin-top bg-white shadow-xl border-t border-b"
      >
        <h2 className="text-2xl font-extrabold uppercase mb-6 text-center tracking-tight text-black">
          Khám phá Sản phẩm
        </h2>

          {/* WRAPPER: CHIA 2 CỘT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT: CATEGORY 3x3 GRID */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-black border-b border-gray-300 pb-2">
              Danh Mục Chính
            </h3>

            <div className="grid grid-cols-3 gap-3">

              {CATEGORIES_TO_SHOW.map((cat) => (
                <motion.div
                  key={cat.name}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} // Thêm hiệu ứng box shadow
                  transition={{ duration: 0.2 }}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`border p-2 h-20 flex flex-col items-center justify-center 
                    cursor-pointer group transition-all duration-300
                    ${
                      filters.category === cat.name
                        ? 'border-black bg-gray-100 shadow-md'
                        : 'border-gray-300 bg-white hover:border-black'
                    }`}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-auto h-10 object-contain mb-1 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-black text-xs font-medium leading-none text-center">
                    {cat.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: FILTERS */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-black border-b border-gray-300 pb-2">
              Bộ Lọc Chi Tiết
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">

              {/* MIN PRICE */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 font-semibold text-xs">Giá tối thiểu</label>
                <input
                  type="number"
                  value={filters.minPrice ?? ''}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
                  }
                  className="border border-gray-400 px-2 h-9 text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                  placeholder="0"
                />
              </div>

              {/* MAX PRICE */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 font-semibold text-xs">Giá tối đa</label>
                <input
                  type="number"
                  value={filters.maxPrice ?? ''}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="border border-gray-400 px-2 h-9 text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                  placeholder="100000000"
                />
              </div>

              {/* SORT */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 font-semibold text-xs">Sắp xếp</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="border border-gray-400 px-2 h-9 bg-white text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp → cao</option>
                  <option value="price-high">Giá cao → thấp</option>
                </select>
              </div>

              {/* RATING */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 font-semibold text-xs">Đánh giá sao</label>
                <select
                  value={filters.rating ?? ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: Number(e.target.value) || undefined,
                    }))
                  }
                  className="border border-gray-400 px-2 h-9 bg-white text-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                >
                  <option value="">Tất cả</option>
                  <option value="4">Từ 4 sao</option>
                  <option value="3">Từ 3 sao</option>
                  <option value="2">Từ 2 sao</option>
                  <option value="1">Từ 1 sao</option>
                </select>
              </div>

              {/* IN STOCK */}
              <div className="flex items-end pb-1 col-span-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))
                  }
                  id="inStock"
                  className="w-4 h-4 accent-black transition duration-200"
                />
                <label htmlFor="inStock" className="ml-2 text-black text-sm font-medium cursor-pointer hover:text-gray-700 transition duration-200">
                  Còn hàng
                </label>
              </div>
            </div>

            {/* RESET BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              onClick={handleReset}
              className="mt-4 px-5 py-2 text-xs uppercase font-bold text-black hover:bg-gray-100 shadow-md active:bg-gray-900 transition-colors duration-200"
            >
              Đặt lại Bộ Lọc
            </motion.button>
          </div>

        </div>
      </motion.section>

        {/* --- PRODUCTS SECTION (Sản phẩm hiển thị ngay bên dưới) --- */}

        {/* 💎 FEATURED PRODUCTS */}
          {featured.length > 0 && (
          <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
                className="pb-12 border-t border-gray-200 pt-8 pl-40 pr-10"
            >
            <h2 className="text-2xl font-bold mb-6 tracking-tight text-gray-900">
              🔥 Sản phẩm nổi bật
              </h2>
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">
              {(showAllFeatured ? filteredProducts : featured).map((p) => (
                <ProductItem key={p._id || p.slug} product={p} />
              ))}
            </motion.div>
            {filteredProducts.length > 4 && !showAllFeatured && (
              <div className="flex justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowAllFeatured(true)}
                  className="px-6 py-2 bg-gray-100 text-black font-semibold uppercase shadow hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
                >
                  Xem thêm các sản phẩm
                </motion.button>
              </div>
            )}
            {showAllFeatured && (
              <div className="flex justify-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowAllFeatured(false)}
                  className="px-6 py-2 bg-gray-100 text-black font-semibold uppercase shadow hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
                >
                  Thu gọn
                </motion.button>
              </div>
            )}
          </motion.section>
        )}

        {/* 🧥 MINI BANNERS */}
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="pb-12 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 pl-40 pr-10 "
        >
          {['/banner/banner5.png', '/banner/banner6.png', '/banner/banner7.png'].map((b, i) => (
            <div
              key={i}
              className="relative h-48 overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" // Loại bỏ rounded-xl
            >
              <img
                src={b}
                alt={`Mini Banner ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out" // Tăng tốc độ scale
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Giảm Giá
              </div>
            </div>
          ))}
        </motion.section>

        {/* 🆕 NEW ARRIVALS */}
        {newArrivals.length > 0 && (
          <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
                className="pb-12 border-t border-gray-200 pt-8 pl-40 pr-10"
            >
            <h2 className="text-2xl font-bold mb-6 tracking-tight text-gray-900">
              ✨ Sản phẩm mới về
            </h2>
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((p) => (
                <ProductItem key={p._id || p.slug} product={p} />
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* 🛒 PRODUCTS GRID (KẾT QUẢ LỌC / TÌM KIẾM) */}
            <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className="pb-12 border-t border-gray-200 pt-8 pl-40 pr-10"
    >
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-gray-900">
        {query ? '🔎 Kết quả tìm kiếm' : '🛒 Tất cả sản phẩm'}
      </h2>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">
          {getError(error as unknown as ApiError)}
        </MessageBox>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10 border bg-white shadow-sm transition-shadow duration-300">
          Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.
        </div>
      ) : (
    <>
      <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts
          .slice(currentPage * PRODUCTS_PER_PAGE, (currentPage + 1) * PRODUCTS_PER_PAGE)
          .map((p) => (
            <ProductItem key={p.slug || p._id} product={p} />
          ))}
      </motion.div>
      {/* ✅ Pagination Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-6 py-2 text-black font-semibold uppercase shadow hover:bg-gray-100 disabled:bg-white disabled:cursor-not-allowed active:bg-gray-200 transition-colors duration-200"
          >
            ← Trước
          </motion.button>

          <span className="text-gray-700 font-semibold">
            Trang {currentPage + 1} / {Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              (currentPage + 1) * PRODUCTS_PER_PAGE >= filteredProducts.length
            }
            className="px-6 py-2 text-black font-semibold uppercase shadow hover:bg-gray-100 disabled:bg-white disabled:cursor-not-allowed active:bg-gray-200 transition-colors duration-200"
          >
            Sau →
          </motion.button>
        </div>
      </>
    )}
  </motion.section>
      {/* --- */}
      {/* ✅ FLOATING COMPARE BUTTON - Dưới cùng bên phải */}
      <motion.button
        onClick={() => navigate('/compare')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        // Giữ nguyên kiểu dáng chung của nút
        className="fixed bottom-8 right-8 w-[150px] h-12 bg-white text-blue-600 border border-gray-300 rounded-full shadow-lg flex items-center justify-center gap-2 hover:border-black hover:shadow-xl transition-all duration-200 z-50"
        title="So sánh sản phẩm"
      >
        {/* 💡 CHỈNH SỬA Ở ĐÂY: Dùng flex để căn chỉnh Icon, Text và Count */}
        <div className="flex items-center gap-1">
          <ArrowLeftRight size={20} className="text-blue-600" /> 
          <span className="font-semibold text-blue-600 text-sm">So sánh</span>

          {compareCount > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {compareCount}
            </motion.span>
          )}
        </div>
      </motion.button>

      <Footer />
    </div>
  )
}