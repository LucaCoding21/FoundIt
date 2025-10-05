'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import MatchesModal from '@/components/MatchesModal'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

export default function AdminReports() {
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPossibleMatches = (report) => {
    return items.filter(item => 
      item.category === report.category && item.campus === report.campus
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <AdminNav />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-sfu-red rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lost Item Reports</h1>
          <p className="text-gray-600">
            <span className="font-semibold text-sfu-red">{reports.length}</span> {reports.length === 1 ? 'report' : 'reports'}
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {reports.map(report => {
            const matches = getPossibleMatches(report)
            
            return (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md smooth-transition">
                <div className="mb-4">
                  <p className="text-gray-800 font-semibold mb-2 line-clamp-2 leading-snug">
                    {report.details}
                  </p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    Lost: {report.location_description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 mb-4">
                  <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                    {report.category}
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                    {report.campus}
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                    {formatDate(report.created_at)}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Contact:</span> {report.email}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-sfu-red text-white rounded-xl hover:bg-red-700 smooth-transition touch-feedback"
                >
                  See Possible Matches ({matches.length})
                </button>
              </div>
            )
          })}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No reports yet</p>
            <p className="text-gray-400 text-sm mt-2">Student reports will appear here</p>
          </div>
        )}
      </main>

      {selectedReport && (
        <MatchesModal
          report={selectedReport}
          matches={getPossibleMatches(selectedReport)}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  )
}
