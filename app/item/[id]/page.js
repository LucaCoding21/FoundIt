'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const categoryEmojis = {
  'Clothing': '👕',
  'Devices': '📱',
  'Cables & Accessories': '🔌',
  'Essentials': '🔑',
  'Daily Items': '🎒',
  'Other': '📦'
}

export default function ItemDetail() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItem()
  }, [params.id])

  const fetchItem = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!error && data) {
      setItem(data)
    }
    setLoading(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Item not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ backgroundColor: '#3686C7' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-4 md:py-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Image with Category Badge */}
        <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden mb-6 md:mb-8">
          <Image
            src={item.photo_url}
            alt={item.title || item.description}
            fill
            className="object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium text-white backdrop-blur-sm" style={{ backgroundColor: 'rgba(54, 134, 199, 0.9)' }}>
            {item.category}
          </div>
        </div>

        {/* Title and Date */}
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold text-gray-900 flex-1">
            {item.title || item.description}
          </h1>
          <span className="text-gray-500 text-sm font-medium ml-4 whitespace-nowrap">
            {formatDate(item.date_found)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-6">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 font-medium">SFU, {item.campus}</span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Description</h2>
          <p className="text-gray-900 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Claim Info Box */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(54, 134, 199, 0.15)' }}>
          <h3 className="text-base font-bold text-gray-900 mb-2">Think this is yours?</h3>
          <p className="text-gray-700 leading-relaxed">
            Visit the Lost & Found Office (AQ 2030) during 9 AM – 5 PM with your student ID to claim it.
          </p>
        </div>
      </div>
    </div>
  )
}
