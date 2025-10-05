'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (login(password)) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-sfu-red mb-3">FoundIt</h1>
          <p className="text-gray-600 text-lg">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent"
              />
              {error && <p className="text-sm text-sfu-red mt-2">{error}</p>}
              <p className="text-xs text-gray-500 mt-2">Default: admin123</p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-4 bg-sfu-red text-white rounded-xl hover:bg-red-700 smooth-transition font-semibold text-base touch-feedback"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-sfu-red smooth-transition font-medium">
              Back to public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
