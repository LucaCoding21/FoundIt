'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

export default function AdminNav() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <>
      <nav className="bg-sfu-red text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin/dashboard" className="text-xl sm:text-2xl font-bold">
              FoundIt Admin
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-6 items-center">
              <Link href="/admin/dashboard" className="hover:text-gray-200 smooth-transition font-medium">
                Dashboard
              </Link>
              <Link href="/admin/upload" className="hover:text-gray-200 smooth-transition font-medium">
                Upload
              </Link>
              <Link href="/admin/reports" className="hover:text-gray-200 smooth-transition font-medium">
                Reports
              </Link>
              <Link href="/" className="hover:text-gray-200 smooth-transition font-medium">
                Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-sfu-red rounded-lg hover:bg-gray-100 smooth-transition text-sm font-medium touch-feedback"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-red-700 touch-feedback"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-sfu-red text-white border-t border-red-800 shadow-lg z-50 lg:hidden animate-slide-down">
            <div className="px-4 py-2 space-y-1">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-red-700 smooth-transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-red-700 smooth-transition font-medium"
              >
                Upload
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-red-700 smooth-transition font-medium"
              >
                Reports
              </Link>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-red-700 smooth-transition font-medium"
              >
                Public Site
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-700 smooth-transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
