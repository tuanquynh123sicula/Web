// ...existing code...
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import LoadingBox from '@/components/LoadingBox'
import MessageBox from '@/components/MessageBox'
import ProductItem from '@/components/ProductItem'
import { useGetProductsQuery } from '@/hooks/productHooks'
import { getError } from '@/utils'
import type { ApiError } from '@/types/ApiError'
import type { Product } from '@/types/Product'

export default function HomePage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const query = params.get('query') || ''

  // Your hook expects no arguments
  const { data: products, isLoading, error } = useGetProductsQuery()

  const banners = ['/banner/IMG_20251106_174944.png', '/banner/IMG_20251106_175148.png', '/banner/IMG_20251106_175224.png', '/banner/ChatGPT Image 17_16_15 6 thg 11, 2025.png', '/banner/banner1.png', '/banner/banner2.png']

  // Client-side filtering by query (name, brand, category, description)
  const normalized = query.trim().toLowerCase()
  const filteredProducts: Product[] =
    (products as Product[] | undefined)?.filter((p) => {
      if (!normalized) return true
      const haystack = `${p.name ?? ''} ${p.brand ?? ''} ${p.category ?? ''} ${p.description ?? ''}`.toLowerCase()
      return haystack.includes(normalized)
    }) ?? []

  return (
    <div className="relative bg-white">
      {/* Banner is full width, header/sidebar overlay on top (layer 1) */}
      <section className="relative z-10">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <img src={b} alt={`banner-${i}`} className="w-full h-[100vh] md:h-[100vh] lg:h-[100vh] object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Products under banner, shifted right to avoid fixed sidebar */}
      <section className="relative z-10 pl-56 pr-6 py-10">
        <div className="max-w-7xl mx-auto">
          {query && <div className="mb-4 text-sm text-gray-600">Kết quả cho: “{query}”</div>}

          {isLoading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">{query ? 'Sản phẩm' : 'Sản phẩm mới'}</h2>

              {filteredProducts.length === 0 ? (
                <div className="text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductItem key={p.slug || p._id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
// ...existing code...