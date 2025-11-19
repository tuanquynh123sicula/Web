import { Schema, model } from 'mongoose'

export interface IBlog {
  _id?: string
  title: string
  category: 'Đánh giá' | 'Tin tức' | 'Mẹo sử dụng' | 'So sánh'
  description: string
  content: string
  image: string
  date: string
  author?: string
  createdAt?: Date
  updatedAt?: Date
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Đánh giá', 'Tin tức', 'Mẹo sử dụng', 'So sánh'],
      default: 'Tin tức',
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('vi-VN'),
    },
    author: {
      type: String,
      default: 'Admin',
    },
  },
  { timestamps: true }
)

export const BlogModel = model<IBlog>('Blog', blogSchema)