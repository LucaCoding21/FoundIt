'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function ItemDetail() {
  const params = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItem()
  }, [params.id])

  const fetchItem = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('id, photo_url, category, campus, date_found, description, created_at')
      .eq('id', params.id)
      .single()

    if (!error && data) {
      setItem(data)
    }
    setLoading(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-sfu-red rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <Link href="/" className="inline-block px-6 py-3 bg-sfu-red text-white rounded-xl hover:bg-red-700 smooth-transition font-semibold touch-feedback">
            Back to Browse
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sfu-red hover:text-red-700 mb-6 font-medium touch-feedback"
        >
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative w-full h-72 sm:h-96 bg-gray-200">
            <Image
              src={item.photo_url}
              alt={item.description}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {item.description}
            </h1>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              <span className="bg-slate-100 px-4 py-2 rounded-full text-sm font-semibold">
                {item.category}
              </span>
              <span className="bg-slate-100 px-4 py-2 rounded-full text-sm font-semibold">
                {item.campus} Campus
              </span>
              <span className="bg-slate-100 px-4 py-2 rounded-full text-sm font-semibold">
                Found {formatDate(item.date_found)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How to Claim</h2>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <p className="text-gray-800 pt-1">
                    Visit the {item.campus} campus Lost & Found desk
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <p className="text-gray-800 pt-1">
                    Bring your student ID or photo ID
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <p className="text-gray-800 pt-1">
                    Be ready to describe non-visible details about your item
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                  <p className="text-gray-800 pt-1">
                    Staff will verify ownership before releasing the item
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
