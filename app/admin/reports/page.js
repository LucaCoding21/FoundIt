'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNav from '@/components/BottomNav'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

export default function AdminReports() {
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

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

  const handleHelp = () => {
    setSettingsMenuOpen(false)
    alert('Help feature not yet implemented')
  }

  const handleLogout = () => {
    setSettingsMenuOpen(false)
    localStorage.removeItem('isAdmin')
    router.push('/admin/login')
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
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20 md:ml-64">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
          <BottomNav />
        </div>
      </>
    )
  }

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 md:ml-64">
        {/* Top Header */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
          <div className="px-5 md:px-8 py-4 md:py-6">
            {/* Mobile Header */}
            <div className="flex md:hidden justify-between items-center mb-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Missing Report</h1>
              <div className="relative">
                <button 
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Settings Dropdown Menu */}
              {settingsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSettingsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                      onClick={handleHelp}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Help</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Missing Reports</h1>
              <p className="text-gray-500 mt-1">Student lost item reports & possible matches</p>
            </div>
            <div className="relative">
              <button 
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {settingsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSettingsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                      onClick={handleHelp}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Help</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
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
        <div className="px-5 md:px-8 pt-5 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredReports.map(report => {
            const matches = getPossibleMatches(report)
            
            return (
              <button 
                key={report.id}
                onClick={() => router.push(`/admin/matches/${report.id}`)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all text-left w-full hover:scale-[1.02] active:scale-[0.98]"
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

                  {/* View Matches Badge */}
                  <div
                    className="w-full py-3 text-base font-semibold text-white rounded-xl transition-colors text-center"
                    style={{ backgroundColor: '#3686C7' }}
                  >
                    View Possible Matches ({matches.length})
                  </div>
                </div>
              </button>
            )
          })}

          {filteredReports.length === 0 && (
            <div className="col-span-full text-center py-16">
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
        </div>

        <BottomNav />

        <style jsx global>{`
          .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        `}</style>
      </div>
    </>
  )
}
