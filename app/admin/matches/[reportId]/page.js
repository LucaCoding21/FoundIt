'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

const categoryEmojis = {
  'Clothing': '👕',
  'Devices': '📱',
  'Cables & Accessories': '🔌',
  'Essentials': '🔑',
  'Daily Items': '🎒',
  'Other': '📦'
}

export default function MatchesPage() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.reportId

  const [report, setReport] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState(null)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router, reportId])

  const fetchData = async () => {
    setLoading(true)
    
    const [reportRes, itemsRes] = await Promise.all([
      supabase.from('reports').select('*').eq('id', reportId).single(),
      supabase.from('items').select('*')
    ])

    if (!reportRes.error && reportRes.data) {
      setReport(reportRes.data)
      
      if (!itemsRes.error && itemsRes.data) {
        const possibleMatches = itemsRes.data.filter(item => {
          const itemCampus = item.campus?.toLowerCase().replace('sfu, ', '').replace('sfu ', '').trim()
          const reportCampus = reportRes.data.campus?.toLowerCase().replace('sfu, ', '').replace('sfu ', '').trim()
          
          return itemCampus === reportCampus && item.category === reportRes.data.category
        })
        setMatches(possibleMatches)
      }
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

  if (!report) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Report not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-5 py-4">
          <div className="flex items-center justify-center relative">
            <button 
              onClick={() => router.back()}
              className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Possible Matches</h1>
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="px-5 pt-5">
        {/* Title and Date */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{report.details}</h2>
          <span className="text-sm text-gray-500 whitespace-nowrap ml-3">{formatDate(report.created_at)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-4" style={{ color: '#3686C7' }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">SFU, {report.campus}</span>
        </div>

        {/* Image with Category Badge */}
        {report.photo_url && (
          <div className="relative w-full aspect-[4/3] max-h-[280px] mb-4 rounded-xl overflow-hidden">
            <Image
              src={report.photo_url}
              alt={report.details}
              fill
              className="object-cover"
            />
            {/* Category Badge Overlay */}
            <div className="absolute top-3 right-3">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#3686C7' }}
              >
                <span>{categoryEmojis[report.category] || '📦'}</span>
                <span>{report.category}</span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Contact</p>
            <p className="text-base text-gray-900 font-medium">{report.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="text-base text-gray-900 font-medium">{report.phone || '444 444 4444'}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-base text-gray-900">{report.location_description || 'No additional description provided.'}</p>
        </div>

        {/* Matches Header */}
        <div className="border-t border-gray-200 pt-5 mb-4">
          <h3 className="text-xl font-bold text-gray-900">Matches ({matches.length})</h3>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="px-5 pb-6">
        {matches.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMatch(item)}
                className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.photo_url}
                    alt={item.title || item.description}
                    fill
                    className="object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="text-base font-semibold mb-2 line-clamp-1">
                      {item.title || item.description}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs mb-2">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span>SFU, {item.campus}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: 'rgba(54, 134, 199, 0.56)' }}>
                      <span>{categoryEmojis[item.category] || '📦'}</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No matching items found yet.</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal - Full Screen */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-white z-50 animate-slide-up overflow-y-auto">
          {/* Top Header */}
          <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedMatch(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pt-5 pb-6">
            {/* Image with Category Badge */}
            <div className="relative w-full aspect-[4/3] mb-4 rounded-xl overflow-hidden">
              <Image
                src={selectedMatch.photo_url}
                alt={selectedMatch.title || selectedMatch.description}
                fill
                className="object-cover"
              />
              {/* Category Badge Overlay */}
              <div className="absolute top-3 right-3">
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: '#3686C7' }}
                >
                  <span>{categoryEmojis[selectedMatch.category] || '📦'}</span>
                  <span>{selectedMatch.category}</span>
                </div>
              </div>
            </div>

            {/* Title and Date */}
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{selectedMatch.title || 'Item'}</h2>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-3">
                {new Date(selectedMatch.date_found).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-4" style={{ color: '#3686C7' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">SFU, {selectedMatch.campus}</span>
            </div>

            {/* Contact/Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Contact</p>
              <p className="text-base text-gray-900">{selectedMatch.description}</p>
            </div>

            {/* Hidden Notes */}
            {selectedMatch.hidden_notes && (
              <div className="bg-gray-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Hidden Notes</p>
                <p className="text-base text-gray-900">{selectedMatch.hidden_notes}</p>
              </div>
            )}

            {/* Item Found Button */}
            <button
              className="w-full py-3.5 text-base font-semibold text-white rounded-xl transition-colors"
              style={{ backgroundColor: '#3686C7' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2c6ba3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3686C7'}
            >
              Item Found
            </button>
          </div>

          <style jsx>{`
            @keyframes slide-up {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
            .animate-slide-up {
              animation: slide-up 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

