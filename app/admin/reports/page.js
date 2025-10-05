'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

export default function AdminReports() {
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    const [reportsRes, itemsRes] = await Promise.all([
      supabase.from('reports').select('*').order('created_at', { ascending: false }),
      supabase.from('items').select('*')
    ])

    if (!reportsRes.error) setReports(reportsRes.data || [])
    if (!itemsRes.error) setItems(itemsRes.data || [])
    setLoading(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPossibleMatches = (report) => {
    return items.filter(item => {
      const itemCampus = item.campus?.toLowerCase().replace('sfu, ', '').replace('sfu ', '').trim()
      const reportCampus = report.campus?.toLowerCase().replace('sfu, ', '').replace('sfu ', '').trim()
      
      const campusMatch = itemCampus === reportCampus
      const categoryMatch = item.category === report.category
      
      return campusMatch && categoryMatch
    })
  }

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return report.details?.toLowerCase().includes(searchLower) ||
           report.location_description?.toLowerCase().includes(searchLower) ||
           report.category?.toLowerCase().includes(searchLower)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-5 py-4">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Missing Report</h1>
            <button 
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a report"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500"
              style={{ '--tw-ring-color': '#3686C7' }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="px-5 pt-5 space-y-4">
        {filteredReports.map(report => {
          const matches = getPossibleMatches(report)
          
          return (
            <div 
              key={report.id} 
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-4">
                {/* Date */}
                <p className="text-sm text-gray-500 mb-1">
                  {formatDate(report.created_at)}
                </p>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {report.details}
                </h2>

                {/* Image if photo_url exists */}
                {report.photo_url && (
                  <div className="relative w-full h-[220px] mb-3 rounded-xl overflow-hidden">
                    <Image
                      src={report.photo_url}
                      alt={report.details}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* View Matches Button */}
                <button
                  onClick={() => router.push(`/admin/matches/${report.id}`)}
                  className="w-full py-3 text-base font-semibold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: '#3686C7' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2c6ba3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3686C7'}
                >
                  View Possible Matches ({matches.length})
                </button>
              </div>
            </div>
          )
        })}

        {filteredReports.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 font-medium">No reports found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Student reports will appear here'}
            </p>
          </div>
        )}
      </div>

      <BottomNav />

      <style jsx global>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  )
}
