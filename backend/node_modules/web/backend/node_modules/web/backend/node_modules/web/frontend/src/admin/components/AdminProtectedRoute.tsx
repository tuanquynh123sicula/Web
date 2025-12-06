// src/admin/components/AdminProtectedRoute.tsx
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Store } from '../../Store' // adjust path if necessary

export default function AdminProtectedRoute() {
  const { state } = useContext(Store)
  const { userInfo } = state

  if (!userInfo) {
    return <Navigate to="/signin" replace />
  }

  if (!userInfo.isAdmin) {
  return <Navigate to="/403" replace />
}

  return <Outlet />
}
