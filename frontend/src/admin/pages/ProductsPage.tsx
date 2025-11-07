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

interface Product {
  _id?: string
  name: string
  brand: string
  category: string
  price: number
  countInStock: number
  description: string
  image: string
  rating?: number
  numReviews?: number
}

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
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts()
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
      const { data } = await apiClient.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader(),
        },
      })
      setForm({ ...form, image: data.image })
      toast.success('Tải ảnh lên thành công!')
    } catch {
      toast.error('Lỗi tải ảnh!')
    }
  }

  // Submit form
    // ...existing code...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateProduct(editingId, form)
        toast.success('Cập nhật sản phẩm thành công!')
      } else {
        await createProduct(form)
        toast.success('Tạo sản phẩm mới thành công!')
      }
      resetForm()
      loadProducts()
    } catch {
      toast.error('Lỗi khi lưu sản phẩm!')
    }
  }
  // ...existing code...

  const resetForm = () => {
    setForm({
      name: '',
      brand: '',
      category: '',
      price: 0,
      countInStock: 0,
      description: '',
      image: '',
      
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
      await deleteProduct(id)
      toast.success('Đã xoá sản phẩm!')
      loadProducts()
    } catch {
      toast.error('Lỗi khi xoá sản phẩm!')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {editingId ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
      </h1>

      {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 max-w-3xl mb-8">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Tên sản phẩm</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Thương hiệu</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Danh mục</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Giá</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Số lượng tồn</label>
          <input
            type="number"
            value={form.countInStock}
            onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex flex-col col-span-2">
          <label className="mb-1 font-medium">Mô tả</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Rating</label>
          <input
            type="number"
            value={form.rating ?? 0}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="border p-2 rounded"
            min={0}
            max={5}
            step={0.1}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Number of Reviews</label>
          <input
            type="number"
            value={form.numReviews ?? 0}
            onChange={(e) => setForm({ ...form, numReviews: Number(e.target.value) })}
            className="border p-2 rounded"
            required

          />
        </div>
        <div className="flex flex-col col-span-2">
          <label className="mb-1 font-medium">Ảnh sản phẩm</label>
          <input type="file" onChange={handleFileUpload} className="border p-2 rounded" />
          {form.image && (
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
              className="h-24 rounded object-contain bg-white mt-2"
              
            />
          )}
        </div>
        <Button type="submit" className="col-span-2">
          {editingId ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        </Button>
      </form>

    

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p._id}>
            <CardContent className="p-4">
              {/* <img src={`http://localhost:4000${p.image}`} alt={p.name} className="h-32 w-full object-cover mb-2 rounded" /> */}
              <img
                src={
                  p.image.startsWith('http')
                    ? p.image
                    : p.image.startsWith('/uploads/')
                      ? `http://localhost:4000${p.image}`
                      : p.image.startsWith('/')
                        ? p.image 
                        : `/images/${p.image}` 
                }
                alt={p.name}
                className="h-32 w-full object-contain mb-2 rounded "
              />
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.brand}</p>
              <p className="text-gray-700">{p.price.toLocaleString()}₫</p>
              <div className="flex gap-2 mt-2">
               <Button onClick={() => handleEdit(p)} className="w-1/2">
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p._id!)}
                  className="w-1/2 bg-red-600 hover:bg-red-700"
                >
                  Xoá
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage