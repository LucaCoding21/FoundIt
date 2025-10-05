'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import AdminSidebar from '@/components/AdminSidebar'
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
  const [showResolveModal, setShowResolveModal] = useState(false)

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

  const handleResolveReport = async () => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)

    if (!error) {
      router.push('/admin/reports')
    } else {
      alert('Error resolving report: ' + error.message)
    }
  }

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-white flex items-center justify-center md:ml-64">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  if (!report) {
    return (
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-white flex items-center justify-center md:ml-64">
          <p className="text-gray-600">Report not found</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-white pb-32 md:pb-8 md:ml-64">
        {/* Top Header */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 md:py-6">
            {/* Mobile Header */}
            <div className="flex md:hidden items-center justify-center relative">
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

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Possible Matches</h1>
                <p className="text-gray-500 mt-1">Review matches and contact reporter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-5 md:pt-8">
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
          <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] max-h-[280px] md:max-h-[400px] mb-4 md:mb-6 rounded-xl overflow-hidden">
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
        <div className="mb-6 md:mb-8">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-base text-gray-900">{report.location_description || 'No additional description provided.'}</p>
        </div>

        {/* Mark as Resolved Button - Desktop inline */}
        <div className="hidden md:block mb-6 md:mb-8">
          <button
            onClick={() => setShowResolveModal(true)}
            className="w-full py-4 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: '#10b981' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            <svg className="w-5 h-5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mark Report as Resolved</span>
          </button>
        </div>

        {/* Matches Header */}
        <div className="border-t border-gray-200 pt-5 md:pt-6 mb-4 md:mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Matches ({matches.length})</h3>
        </div>
        </div>

        {/* Matches Grid */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-6 md:pb-8">
          {matches.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {matches.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMatch(item)}
                className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
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

        {/* Mark as Resolved Button - Mobile fixed at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5 safe-area-bottom z-40">
          <button
            onClick={() => setShowResolveModal(true)}
            className="w-full py-4 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: '#10b981' }}
          >
            <svg className="w-5 h-5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mark Report as Resolved</span>
          </button>
        </div>

      {/* Resolve Confirmation Modal */}
      {showResolveModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowResolveModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Mark as Resolved?</h3>
              <p className="text-gray-600 text-center mb-6">
                This will permanently remove this report from the system. The reporter has been contacted and the item has been returned.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveReport}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-colors"
                  style={{ backgroundColor: '#10b981' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Item Detail Modal */}
      {selectedMatch && (
        <>
          {/* Backdrop - Desktop only */}
          <div 
            className="hidden md:block fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
            onClick={() => setSelectedMatch(null)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white z-50 overflow-y-auto md:rounded-2xl md:shadow-2xl md:max-w-2xl md:w-full md:max-h-[90vh] animate-slide-up md:animate-scale-in">
            {/* Top Header */}
            <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
              <div className="px-5 md:px-6 py-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedMatch(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors opacity-0 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 md:px-6 pt-5 pb-6">
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

            {/* Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-base text-gray-900">{selectedMatch.description}</p>
            </div>

            {/* Hidden Notes */}
            {selectedMatch.hidden_notes && (
              <div className="bg-gray-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Hidden Notes</p>
                <p className="text-base text-gray-900">{selectedMatch.hidden_notes}</p>
              </div>
            )}

            {/* Reporter Contact Information */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Reporter </h3>
              
              <div className="space-y-3 mb-5">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-base text-gray-900 font-medium truncate">{report.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {report.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                      <p className="text-base text-gray-900 font-medium">{report.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Email Button */}
                <a
                  href={`mailto:${report.email}?subject=Found Item Match: ${selectedMatch.title || 'Your Item'}&body=Hi,%0D%0A%0D%0AWe may have found your ${report.details}.%0D%0A%0D%0AItem details:%0D%0A- ${selectedMatch.title || 'Item'}%0D%0A- Location: SFU, ${selectedMatch.campus}%0D%0A- Description: ${selectedMatch.description}%0D%0A%0D%0APlease reply to confirm if this is your item.%0D%0A%0D%0AThanks,%0D%0ASFU Lost & Found`}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#3686C7' }}
                >
                  <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email</span>
                </a>

                {/* Call Button */}
                <a
                  href={`tel:${report.phone || ''}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-white rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: '#3686C7' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2c6ba3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3686C7'}
                >
                  <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call</span>
                </a>
              </div>
            </div>
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
            @keyframes scale-in {
              from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .animate-slide-up {
              animation: slide-up 0.3s ease-out;
            }
            .animate-scale-in {
              animation: scale-in 0.2s ease-out;
            }
            .animate-fade-in {
              animation: fade-in 0.2s ease-out;
            }
            @media (min-width: 768px) {
              .animate-slide-up {
                animation: scale-in 0.2s ease-out;
              }
            }
          `}</style>
          </div>
        </>
      )}
      </div>
    </>
  )
}

