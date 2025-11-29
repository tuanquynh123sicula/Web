import React, { useEffect, useState } from 'react'
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
import { Upload, X } from 'lucide-react'
import type { Product } from '@/types/Product'

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
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
      console.log('Products loaded:', data) // Debug
      setProducts(data)
    } catch {
      toast.error('Không thể tải danh sách sản phẩm!')
    }
  }

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
      console.log('Upload response:', data) // Debug
      setForm({ ...form, image: data.image })
      toast.success('Tải ảnh lên thành công!')
    } catch (err) {
      console.error('Upload error:', err) // Debug
      toast.error('Lỗi tải ảnh!')
    } finally {
      setIsLoading(false)
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ✅ Validate dữ liệu
    if (!form.name || !form.brand || !form.category) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (!form.image) {
      toast.error('Vui lòng upload ảnh sản phẩm!')
      return
    }

    try {
      setIsLoading(true)
      
      // ✅ Format slug
      const slug = form.name.toLowerCase().replace(/\s+/g, '-')
      const submitData = { ...form, slug }
      
      console.log('Submitting:', submitData) // Debug
      
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
      console.error('Submit error:') // Debug
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
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá sản phẩm này không?')) return
    try {
      setIsLoading(true)
      await deleteProduct(id)
      toast.success('Đã xoá sản phẩm!')
      loadProducts()
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
            <label className="mb-2 font-medium text-gray-700">Tên sản phẩm *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              required
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Thương hiệu *</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              required
              placeholder="Nhập thương hiệu"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Danh mục *</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              required
              placeholder="Nhập danh mục"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Giá *</label>
            <input
              type="number"
              value={form.price || 0}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              required
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Số lượng tồn *</label>
            <input
              type="number"
              value={form.countInStock || 0}
              onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) || 0 })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              required
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
            <label className="mb-2 font-medium text-gray-700">Mô tả *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none"
              rows={3}
              required
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="mb-2 font-medium text-gray-700">Ảnh sản phẩm * {form.image && ''}</label>
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
              disabled={isLoading || !form.image}
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
      <div className="mb-6 animate-slide-down" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm ({products.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <div 
            key={p._id} 
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <Card className="border shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
              <CardContent className="p-4 flex flex-col h-full">
                {/* ✅ Image */}
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
                
                {/* ✅ Name & Info */}
                <h2 className="font-semibold text-gray-900 line-clamp-2 mb-1">{p.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{p.brand}</p>
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{p.category}</p>
                
                {/* ✅ Price & Stock */}
                <div className="flex items-center justify-between mb-3 flex-grow">
                  <div>
                    <p className="text-lg font-bold text-blue-600">
                      {(p.price || 0).toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-xs text-gray-500">Tồn: {p.countInStock || 0}</p>
                  </div>
                  
                  {/* ✅ Rating & Reviews */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-600">
                      ⭐ {(p.rating || 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.numReviews || 0} reviews
                    </p>
                  </div>
                </div>
                
                {/* ✅ Actions */}
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

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên!</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage