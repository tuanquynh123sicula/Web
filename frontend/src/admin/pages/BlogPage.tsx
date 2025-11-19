import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Upload, X, Eye, Edit2, Trash2 } from 'lucide-react'
import { 
  getPublicBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog,
} from '@/api/adminApi'

type Blog = {
  _id?: string
  title: string
  category: 'Đánh giá' | 'Tin tức' | 'Mẹo sử dụng' | 'So sánh'
  description: string
  content: string
  image: string
  date: string
  author?: string
  createdAt?: string
}

const CATEGORIES = ['Đánh giá', 'Tin tức', 'Mẹo sử dụng', 'So sánh']

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [form, setForm] = useState<Blog>({
    title: '',
    category: 'Tin tức',
    description: '',
    content: '',
    image: '',
    date: new Date().toLocaleDateString('vi-VN'),
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<Blog | null>(null)

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Đang tải blogs từ API...')
      const data = await getPublicBlogs()
      console.log('✅ Blogs loaded successfully:', data)
      setBlogs(data || [])
    } catch (error) {
      console.error('❌ Error loading blogs:', error)
      toast.error('Lỗi khi tải danh sách bài viết')
      setBlogs([])
    } finally {
      setIsLoading(false)
    }
  }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      
      try {
        console.log('📤 Converting image to base64...')
        
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          console.log('✅ Image converted to base64, size:', base64.length)
          setForm({ ...form, image: base64 })
          toast.success('Tải ảnh lên thành công!')
        }
        reader.onerror = () => {
          toast.error('Lỗi đọc file!')
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('❌ Upload error:', error)
        toast.error('Lỗi tải ảnh!')
      }
    }
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.content || !form.image) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    try {
      setIsLoading(true)
      if (editingId) {
        console.log('✏️ Updating blog:', editingId)
        await updateBlog(editingId, form)
        toast.success('Cập nhật bài viết thành công!')
      } else {
        console.log('📝 Creating new blog')
        await createBlog(form)
        toast.success('Tạo bài viết mới thành công!')
      }
      resetForm()
      loadBlogs()
    } catch (error) {
      console.error('❌ Submit error:', error)
      toast.error('Lỗi khi lưu bài viết!')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      category: 'Tin tức',
      description: '',
      content: '',
      image: '',
      date: new Date().toLocaleDateString('vi-VN'),
    })
    setEditingId(null)
  }

  const handleEdit = (blog: Blog) => {
    setForm(blog)
    setEditingId(blog._id || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá bài viết này không?')) return
    try {
      setIsLoading(true)
      console.log('🗑️ Deleting blog:', id)
      await deleteBlog(id)
      toast.success('Xoá bài viết thành công!')
      loadBlogs()
    } catch (error) {
      console.error('❌ Delete error:', error)
      toast.error('Lỗi khi xoá bài viết!')
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
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
      `}</style>

      <div className="mb-6 animate-slide-down">
        <h1 className="text-3xl font-bold tracking-tight">
          {editingId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </h1>
        <p className="text-gray-500 mt-1">Quản lý bài viết blog của bạn</p>
      </div>

      {/* FORM */}
      <div className="bg-white border shadow-md p-6 mb-8 animate-slide-down transition-all duration-500 hover:shadow-lg" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Tiêu đề bài viết</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                required
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Blog['category'] })}
                className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Mô tả ngắn</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none"
              rows={2}
              required
              placeholder="Nhập mô tả ngắn (hiển thị trên trang danh sách)"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Nội dung bài viết</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none"
              rows={8}
              required
              placeholder="Nhập nội dung bài viết"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Ảnh bài viết</label>
            <label className="border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-400">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Chọn hoặc kéo ảnh vào đây</span>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                className="hidden"
                accept="image/*"
              />
            </label>
            {form.image && (
              <div className="mt-4 relative inline-block">
                <img
                  src={form.image}
                  alt="preview"
                  className="h-32 object-contain bg-gray-50 p-2"
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

          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : (editingId ? 'Lưu thay đổi' : 'Đăng bài viết')}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={resetForm}
                className="flex-1 border px-4 py-2 font-medium transition-all duration-300 hover:bg-gray-50 active:scale-95"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="mb-6 animate-slide-down" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold mb-4">Danh sách bài viết ({blogs.length})</h2>
      </div>

      <div className="bg-white border shadow-md overflow-x-auto animate-slide-down transition-all duration-500 hover:shadow-lg" style={{ animationDelay: '0.2s' }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b transition-colors duration-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tiêu đề</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Danh mục</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày đăng</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Chưa có bài viết nào
                </td>
              </tr>
            ) : (
              blogs.map((blog, idx) => (
                <tr 
                  key={blog._id} 
                  className="border-b last:border-none transition-all duration-300 hover:bg-blue-50"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{blog.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{blog.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        className="border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 active:scale-95"
                        onClick={() => setPreview(blog)}
                        title="Xem trước"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:border-green-400 active:scale-95"
                        onClick={() => handleEdit(blog)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="border border-red-300 px-3 py-1 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-50 hover:border-red-400 active:scale-95"
                        onClick={() => handleDelete(blog._id!)}
                        title="Xoá"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xem trước */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-2xl max-h-96 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{preview.title}</h2>
              <button 
                className="p-1 hover:bg-gray-100 transition-all duration-300"
                onClick={() => setPreview(null)}
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {preview.image && (
              <img 
                src={preview.image} 
                alt={preview.title}
                className="w-full h-48 object-cover mb-4"
              />
            )}

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Danh mục:</span> {preview.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Ngày đăng:</span> {preview.date}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Mô tả:</h3>
              <p className="text-gray-700">{preview.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Nội dung:</h3>
              <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">{preview.content}</p>
            </div>

            <button 
              className="w-full border px-4 py-2 mt-6 transition-all duration-300 hover:bg-gray-50"
              onClick={() => setPreview(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}