'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname.startsWith('/admin/item/')
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/admin/login')
  }

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold" style={{ color: '#3686C7' }}>FoundIt</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link 
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            isActive('/admin/dashboard')
              ? 'text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={isActive('/admin/dashboard') ? { backgroundColor: '#3686C7' } : {}}
        >
          <svg 
            className="w-6 h-6" 
            fill={isActive('/admin/dashboard') ? 'currentColor' : 'none'}
            strokeWidth={isActive('/admin/dashboard') ? '0' : '2'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/admin/upload"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            isActive('/admin/upload')
              ? 'text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={isActive('/admin/upload') ? { backgroundColor: '#3686C7' } : {}}
        >
          <svg 
            className="w-6 h-6"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Upload Item</span>
        </Link>

        <Link 
          href="/admin/reports"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            isActive('/admin/reports')
              ? 'text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={isActive('/admin/reports') ? { backgroundColor: '#3686C7' } : {}}
        >
          <svg 
            className="w-6 h-6"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Missing Reports</span>
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => alert('Help feature not yet implemented')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all w-full"
        >
          <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all w-full"
        >
          <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

