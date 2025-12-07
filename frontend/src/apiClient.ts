import axios from 'axios'

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'development'
      ? 'http://localhost:4000'
      : 'https://web-934k.onrender.com'),
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

// ✅ Fix getImageUrl để xử lý mọi trường hợp
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/images/no-image.png'
  
  // Nếu đã là URL đầy đủ (http/https), trả về luôn
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Nếu là path tương đối, nối với baseURL
  const baseUrl = import.meta.env.VITE_API_URL || 
    (import.meta.env.MODE === 'development' 
      ? 'http://localhost:4000' 
      : 'https://web-934k.onrender.com')
  
  // Đảm bảo không có double slash
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${baseUrl}${cleanPath}`
}