import axios from 'axios'

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'development'
      ? 'http://localhost:4000'
      : 'https://your-render-backend.onrender.com'), // ⚠️ Thay bằng URL Render thực tế
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const { token } = JSON.parse(userInfo)
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default apiClient

// ✅ Helper xử lý URL ảnh
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return ''
  
  if (imagePath.startsWith('http')) return imagePath 
  
  // Nếu là path tương đối, nối với baseURL
  const baseUrl = import.meta.env.VITE_API_URL || 
    (import.meta.env.MODE === 'development' 
      ? 'http://localhost:4000' 
      : 'https://web-934k.onrender.com/') 
  
  return `${baseUrl}${imagePath}`
}

