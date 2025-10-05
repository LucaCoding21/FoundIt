'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { login } from '@/lib/auth'
import foundItLogo from '@/assets/foundit.png'

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
              <Image
                src={foundItLogo}
                alt="FoundIt"
                width={300}
                height={120}
                className="w-auto h-24"
                priority
              />
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
            <Image
              src={foundItLogo}
              alt="FoundIt"
              width={250}
              height={100}
              className="w-auto h-20 mx-auto"
              priority
            />
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

            {/* Demo Credentials Box for Judges */}
            <div className="mt-8 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: '#3686C7', backgroundColor: 'rgba(54, 134, 199, 0.05)' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3686C7' }}>
                  <svg className="w-6 h-6 text-white" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Demo Credentials</h3>
                  <p className="text-sm text-gray-600">For judges and testing purposes</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Email */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-base font-semibold text-gray-900 font-mono">admin@sfu.ca</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('admin@sfu.ca')
                        alert('Email copied!')
                      }}
                      className="ml-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      style={{ color: '#3686C7' }}
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Password</p>
                      <p className="text-base font-semibold text-gray-900 font-mono">123admin</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('123admin')
                        alert('Password copied!')
                      }}
                      className="ml-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      style={{ color: '#3686C7' }}
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
