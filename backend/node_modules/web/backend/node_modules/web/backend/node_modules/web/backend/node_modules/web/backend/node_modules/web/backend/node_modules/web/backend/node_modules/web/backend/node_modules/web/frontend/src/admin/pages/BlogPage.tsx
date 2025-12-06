import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Upload, X, Eye, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

    // Validation
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết!')
      return
    }
    if (!form.description.trim()) {
      toast.error('Vui lòng nhập mô tả ngắn!')
      return
    }
    if (!form.content.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết!')
      return
    }
    if (!form.image) {
      toast.error('Vui lòng upload ảnh bài viết!')
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {editingId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </h1>
        <p className="text-gray-600 mt-1">Quản lý bài viết blog của bạn</p>
      </motion.div>

      {/* FORM */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border shadow-md p-6 mb-8 transition-all duration-500 hover:shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm"
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </label>
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
            <label className="mb-2 font-semibold text-gray-700">
              Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none"
              rows={2}
              placeholder="Nhập mô tả ngắn (hiển thị trên trang danh sách)"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="border px-3 py-2 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-sm resize-none"
              rows={8}
              placeholder="Nhập nội dung bài viết"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Ảnh bài viết <span className="text-red-500">*</span>
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
            <AnimatePresence>
              {form.image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-4 relative inline-block"
                >
                  <img
                    src={form.image}
                    alt="preview"
                    className="h-32 object-contain bg-gray-50 p-2 border"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 transition-all duration-300 hover:bg-red-600"
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={isLoading}
              className={`flex-1 bg-blue-600 text-white px-4 py-2 font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isLoading ? 'Đang xử lý...' : (editingId ? 'Lưu thay đổi' : 'Đăng bài viết')}
            </motion.button>
            {editingId && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={resetForm}
                className="flex-1 border px-4 py-2 font-semibold transition-all duration-300 hover:bg-gray-50 shadow-md hover:shadow-lg"
              >
                Hủy
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* DANH SÁCH BÀI VIẾT */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Danh sách bài viết ({blogs.length})
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white border shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Danh mục</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Ngày đăng</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        Đang tải...
                      </div>
                    </td>
                  </motion.tr>
                ) : blogs.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      Chưa có bài viết nào
                    </td>
                  </motion.tr>
                ) : (
                  blogs.map((blog, idx) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-b last:border-none transition-all duration-300 hover:bg-blue-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                        {blog.title}
                      </td>
                      <td className="px-4 py-3">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 transition-all duration-300"
                        >
                          {blog.category}
                        </motion.span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{blog.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 shadow-sm hover:shadow-md"
                            onClick={() => setPreview(blog)}
                            title="Xem trước"
                          >
                            <Eye size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="border px-3 py-1 text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:border-green-400 shadow-sm hover:shadow-md"
                            onClick={() => handleEdit(blog)}
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="border border-red-300 px-3 py-1 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-50 hover:border-red-400 shadow-sm hover:shadow-md"
                            onClick={() => handleDelete(blog._id!)}
                            title="Xoá"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal xem trước */}
      <AnimatePresence>
        {preview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white p-6 w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{preview.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setPreview(null)}
                >
                  <X size={24} className="text-gray-600" />
                </motion.button>
              </div>

              {preview.image && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  src={preview.image} 
                  alt={preview.title}
                  className="w-full h-48 object-cover mb-4 border"
                />
              )}

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2 mb-4"
              >
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Danh mục:</span> {preview.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Ngày đăng:</span> {preview.date}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả:</h3>
                <p className="text-gray-700">{preview.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-gray-900 mb-2">Nội dung:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{preview.content}</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full border px-4 py-2 mt-6 font-semibold transition-all duration-300 hover:bg-gray-50 shadow-md hover:shadow-lg"
                onClick={() => setPreview(null)}
              >
                Đóng
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}