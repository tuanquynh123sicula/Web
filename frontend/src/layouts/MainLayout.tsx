import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'sonner'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import FaqChat from '@/components/FaqChat'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="relative min-h-screen bg-white text-gray-800 overflow-hidden">
      <ToastContainer position="bottom-center" limit={1} />
      <Toaster />

      {/* Only show Sidebar/Header on storefront (not in admin) */}
      {!isAdmin && (
        <>
          <div className="fixed top-0 left-0 bottom-0 w-56 z-30">
            <Sidebar />
          </div>
          <div className="fixed left-56 right-0 top-0 z-30">
            <Header />
          </div>
        </>
      )}

      {/* Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Hide chatbox in admin as well */}
      {!isAdmin && (
        <div className="fixed right-6 bottom-6 z-40">
          <FaqChat />
        </div>
      )}
    </div>
  )
}