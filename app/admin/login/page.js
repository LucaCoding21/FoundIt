'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div 
        className={`hidden lg:flex lg:w-1/2 items-center justify-center p-12 transition-all duration-1000 ease-out ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
        style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
        }}
      >
        <div className="max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <h1 className="text-7xl font-bold text-gray-900 tracking-tight flex items-center">
                F
                <span className="relative inline-block mx-1">
                  <svg 
                    className="w-16 h-16" 
                    viewBox="0 0 64 64" 
                    fill="none"
                  >
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      className="text-gray-900"
                    />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="5" 
                      fill="#3686C7"
                    />
                  </svg>
                </span>
                undit
              </h1>
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-2xl text-gray-700 font-medium">
            Making it easy to find what's yours
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div 
        className={`w-full lg:w-1/2 flex items-center justify-center p-8 bg-white transition-all duration-1000 ease-out ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight inline-flex items-center justify-center">
              F
              <span className="relative inline-block mx-1">
                <svg 
                  className="w-12 h-12" 
                  viewBox="0 0 64 64" 
                  fill="none"
                >
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="currentColor" 
                    strokeWidth="3"
                    className="text-gray-900"
                  />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="5" 
                    fill="#3686C7"
                  />
                </svg>
              </span>
              undit
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="Admin email"
                  required
                  className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-transparent focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': '#3686C7' }}
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Password"
                  required
                  className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-transparent focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': '#3686C7' }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 text-white text-lg font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: loading ? '#9CA3AF' : '#3686C7'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2c6ba3')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#3686C7')}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#3686C7' }}
                  onClick={() => alert('Please contact IT support for password reset')}
                >
                  Forgot Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
