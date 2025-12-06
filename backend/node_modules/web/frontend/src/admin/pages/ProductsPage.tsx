import React, { useEffect, useState, useMemo } from 'react'
import {
  getAllProducts as getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  authHeader,
} from '@/api/adminApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import apiClient from '@/apiClient'
import { toast } from "sonner"
import { Upload, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { Product } from '@/types/Product'

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [form, setForm] = useState<Product>({
    name: '',
    brand: '',
    category: '',
    price: 0,
    countInStock: 0,
    description: '',
    image: '',
    slug: '',
    rating: 0,
    numReviews: 0,
    variants: [], 
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      console.log('Products loaded:', data)
      setProducts(data)
    } catch {
      toast.error('Không thể tải danh sách sản phẩm!')
    }
  }

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize
    return products.slice(start, start + pageSize)
  }, [products, page])

  const goto = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))

  const pageNumbers = useMemo(() => {
    const maxBtns = 5
    let start = Math.max(1, page - Math.floor(maxBtns / 2))
    const end = Math.min(totalPages, start + maxBtns - 1)
    start = Math.max(1, Math.min(start, end - maxBtns + 1))
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [page, totalPages])

  // Upload ảnh
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    try {
      setIsLoading(true)
      const { data } = await apiClient.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader(),
        },
      })
      console.log('Upload response:', data)
      setForm({ ...form, image: data.image })
      toast.success('Tải ảnh lên thành công!')
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Lỗi tải ảnh!')
    } finally {
      setIsLoading(false)
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm!')
      return
    }
    
    if (!form.brand.trim()) {
      toast.error('Vui lòng nhập thương hiệu!')
      return
    }
    
    if (!form.category.trim()) {
      toast.error('Vui lòng nhập danh mục!')
      return
    }
    
    if (!form.price || form.price <= 0) {
      toast.error('Vui lòng nhập giá hợp lệ!')
      return
    }
    
    if (form.countInStock === undefined || form.countInStock < 0) {
      toast.error('Vui lòng nhập số lượng tồn kho hợp lệ!')
      return
    }
    
    if (!form.description.trim()) {
      toast.error('Vui lòng nhập mô tả sản phẩm!')
      return
    }

    if (!form.image) {
      toast.error('Vui lòng upload ảnh sản phẩm!')
      return
    }

    try {
      setIsLoading(true)
      const slug = form.name.toLowerCase().replace(/\s+/g, '-')
      const submitData = { ...form, slug }
      console.log('Submitting:', submitData)
      
      if (editingId) {
        await updateProduct(editingId, submitData)
        toast.success('Cập nhật sản phẩm thành công!')
      } else {
        await createProduct(submitData)
        toast.success('Tạo sản phẩm mới thành công!')
      }
      resetForm()
      loadProducts()
    } catch{
      console.error('Submit error:')
      toast.error('Lỗi khi lưu sản phẩm!')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      brand: '',
      category: '',
      price: 0,
      countInStock: 0,
      description: '',
      image: '',
      slug: '',
      rating: 0,
      numReviews: 0,
      variants: [],
    })
    setEditingId(null)
  }

  const handleEdit = (product: Product) => {
    setForm(product)
    setEditingId(product._id || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá sản phẩm này không?')) return
    try {
      setIsLoading(true)
      await deleteProduct(id)
      toast.success('Đã xoá sản phẩm!')
      loadProducts()
      // Reset về trang 1 nếu trang hiện tại trống
      if (pageData.length === 1 && page > 1) {
        setPage(page - 1)
      }
    } catch {
      toast.error('Lỗi khi xoá sản phẩm!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
      `}</style>

      <div className="mb-6 animate-slide-down">
        <h1 className="text-3xl font-bold tracking-tight">
          {editingId ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
        </h1>
        <p className="text-gray-500 mt-1">Quản lý danh sách sản phẩm của bạn</p>
      </div>

      {/* FORM */}
      <div className="bg-white border shadow-md p-6 mb-8 animate-slide-down transition-all duration-500 hover:shadow-lg" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Thương hiệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="Nhập thương hiệu"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="Nhập danh mục"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Giá <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price || 0}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Số lượng tồn <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.countInStock || 0}
              onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) || 0 })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Rating (0-5)</label>
            <input
              type="number"
              value={form.rating ?? 0}
              onChange={(e) => setForm({ ...form, rating: Math.min(5, Math.max(0, Number(e.target.value))) })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              min={0}
              max={5}
              step={0.1}
              placeholder="0"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Số lượng đánh giá</label>
            <input
              type="number"
              value={form.numReviews ?? 0}
              onChange={(e) => setForm({ ...form, numReviews: Math.max(0, Number(e.target.value)) })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2 font-medium text-gray-700">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none"
              rows={3}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2 font-medium text-gray-700">
              Ảnh sản phẩm <span className="text-red-500">*</span>
            </label>
            <label className="border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-400">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Chọn hoặc kéo ảnh vào đây</span>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                className="hidden"
                accept="image/*"
                disabled={isLoading}
              />
            </label>
            {form.image && (
              <div className="mt-4 relative inline-block">
                <img
                  src={
                    form.image.startsWith('http')
                      ? form.image
                      : form.image.startsWith('/uploads/')
                        ? `http://localhost:4000${form.image}`
                        : form.image.startsWith('/')
                          ? form.image
                          : `/images/${form.image}`
                  }
                  alt="preview"
                  className="h-32 object-contain bg-gray-50 p-2 border"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: '' })}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 transition-all duration-300 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3 col-span-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isLoading ? 'Đang xử lý...' : (editingId ? 'Lưu thay đổi' : 'Tạo sản phẩm')}
            </Button>
            {editingId && (
              <Button 
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex-1 border transition-all duration-300 hover:bg-gray-50 active:scale-95"
              >
                Hủy
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="mb-4 flex items-center justify-between animate-slide-down" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold">
          Danh sách sản phẩm ({products.length})
        </h2>
        <p className="text-gray-500">
          Trang {page}/{totalPages}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {pageData.map((p, idx) => (
          <div 
            key={p._id} 
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <Card className="border shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="mb-3 overflow-hidden bg-gray-50 flex items-center justify-center h-48">
                  <img
                    src={
                      p.image
                        ? p.image.startsWith('http')
                          ? p.image
                          : p.image.startsWith('/uploads/')
                            ? `http://localhost:4000${p.image}`
                            : p.image.startsWith('/')
                              ? p.image
                              : `/images/${p.image}`
                        : '/images/no-image.png' 
                    }
                    alt={p.name}
                    className="h-full object-contain transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.src = '/images/no-image.png'
                    }}
                  />
                </div>
                
                <h2 className="font-semibold text-gray-900 line-clamp-2 mb-1">{p.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{p.brand}</p>
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{p.category}</p>
                
                <div className="flex items-center justify-between mb-3 flex-grow">
                  <div>
                    <p className="text-lg font-bold text-blue-600">
                      {(p.price || 0).toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-xs text-gray-500">Tồn: {p.countInStock || 0}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-600">
                      ⭐ {(p.rating || 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.numReviews || 0} đánh giá
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleEdit(p)}
                    disabled={isLoading}
                    className="flex-1 border px-3 py-2 font-medium text-sm transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p._id!)}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 text-white px-3 py-2 font-medium text-sm transition-all duration-300 hover:bg-red-700 hover:shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    Xoá
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {products.length > 0  && (
        <div className="flex items-center justify-center gap-1 animate-slide-down">
          <button
            className="border px-2 py-1 hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
            onClick={() => goto(1)}
            disabled={page === 1}
            title="Trang đầu"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            className="border px-2 py-1 hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            title="Trang trước"
          >
            <ChevronLeft size={18} />
          </button>
          {pageNumbers.map((p) => (
            <button
              key={p}
              className={`border px-3 py-1 text-sm transition-all duration-300 ${
                p === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => goto(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="border px-2 py-1 hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
            onClick={() => goto(page + 1)}
            disabled={page === totalPages}
            title="Trang sau"
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="border px-2 py-1 hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
            onClick={() => goto(totalPages)}
            disabled={page === totalPages}
            title="Trang cuối"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên!</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage