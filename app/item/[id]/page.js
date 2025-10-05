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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <Link href="/" className="text-sfu-red hover:text-red-700">
            Back to Browse
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-sfu-red hover:text-red-700 mb-6 inline-block">
          ← Back to Browse
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative w-full h-96 bg-gray-200">
            <Image
              src={item.photo_url}
              alt={item.description}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {item.description}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium">
                {item.category}
              </span>
              <span className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium">
                {item.campus} Campus
              </span>
              <span className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium">
                Found {formatDate(item.date_found)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How to Claim</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-gray-700">
                  1. Visit the {item.campus} campus Lost & Found desk
                </p>
                <p className="text-gray-700">
                  2. Bring your student ID or photo ID
                </p>
                <p className="text-gray-700">
                  3. Be ready to describe non-visible details about your item
                </p>
                <p className="text-gray-700">
                  4. Staff will verify ownership before releasing the item
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
