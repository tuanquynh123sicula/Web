export type Blog = {
  _id?: string
  title: string
  category: 'Đánh giá' | 'Tin tức' | 'Mẹo sử dụng' | 'So sánh'
  description: string
  content: string
  image: string
  date: string
  author?: string
  createdAt?: string
  updatedAt?: string
}