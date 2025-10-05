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
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lost Item Reports</h1>
          <p className="text-gray-600">{reports.length} reports</p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => {
            const matches = getPossibleMatches(report)
            
            return (
              <div key={report.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="mb-3">
                  <p className="text-gray-800 font-medium mb-2">{report.details}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Lost: {report.location_description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                  <span className="bg-slate-100 px-2 py-1 rounded">{report.category}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{report.campus}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{formatDate(report.created_at)}</span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">Contact: {report.email}</p>
                </div>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="w-full px-4 py-2 text-sm bg-sfu-red text-white rounded-lg hover:bg-red-700 transition"
                >
                  See Possible Matches ({matches.length})
                </button>
              </div>
            )
          })}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reports yet.</p>
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
