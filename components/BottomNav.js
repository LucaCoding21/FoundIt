'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return pathname === '/admin/dashboard'
    }
    return pathname === path
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="max-w-md mx-auto px-8 py-4">
        <div className="flex justify-around items-center">
          {/* Home/Dashboard */}
          <Link 
            href="/admin/dashboard"
            className="flex flex-col items-center gap-1.5 relative transition-all duration-200 ease-out"
          >
            <svg 
              className="w-9 h-9 transition-colors duration-200 ease-out"
              style={{ color: isActive('/admin/dashboard') ? '#3686C7' : '#9CA3AF' }}
              fill="none"
              strokeWidth={isActive('/admin/dashboard') ? '2.5' : '2'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>

          {/* Upload */}
          <Link 
            href="/admin/upload"
            className="flex flex-col items-center gap-1.5 relative transition-all duration-200 ease-out"
          >
            <svg 
              className="w-9 h-9 transition-colors duration-200 ease-out"
              style={{ color: isActive('/admin/upload') ? '#3686C7' : '#9CA3AF' }}
              fill="none"
              strokeWidth={isActive('/admin/upload') ? '2.5' : '2'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </Link>

          {/* Reports */}
          <Link 
            href="/admin/reports"
            className="flex flex-col items-center gap-1.5 relative transition-all duration-200 ease-out"
          >
            <svg 
              className="w-9 h-9 transition-colors duration-200 ease-out"
              style={{ color: isActive('/admin/reports') ? '#3686C7' : '#9CA3AF' }}
              fill="none"
              strokeWidth={isActive('/admin/reports') ? '2.5' : '2'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}

