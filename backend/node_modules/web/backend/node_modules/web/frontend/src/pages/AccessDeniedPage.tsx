// src/pages/AccessDeniedPage.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { LockIcon } from 'lucide-react'

export default function AccessDeniedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-10 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <LockIcon className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to access this page.
        </p>
        <Button onClick={() => navigate('/')}>
          Go Back Home
        </Button>
      </div>
    </div>
  )
}
