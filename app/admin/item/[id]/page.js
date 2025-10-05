'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'
import EditModal from '@/components/EditModal'
import DeleteModal from '@/components/DeleteModal'

const categoryEmojis = {
  'Clothing': '👕',
  'Devices': '📱',
  'Cables & Accessories': '🔌',
  'Essentials': '🔑',
  'Daily Items': '🎒',
  'Other': '📦'
}

export default function AdminItemDetail() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login')
      return
    }
    fetchItem()
  }, [params.id, router])

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

  const handleItemFound = async () => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', item.id)

    if (!error) {
      router.push('/admin/dashboard')
    }
  }

  const handleEdit = () => {
    setMenuOpen(false)
    setEditModalOpen(true)
  }

  const handleDelete = () => {
    setMenuOpen(false)
    setDeleteModalOpen(true)
  }

  const handleSaveEdit = async (updatedItem) => {
    const { error } = await supabase
      .from('items')
      .update(updatedItem)
      .eq('id', item.id)

    if (!error) {
      setItem({ ...item, ...updatedItem })
      setEditModalOpen(false)
    }
  }

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', item.id)

    if (!error) {
      router.push('/admin/dashboard')
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

  if (!item) {
    return (
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-white flex items-center justify-center md:ml-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Item not found</p>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#3686C7' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-white md:ml-64">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
          <div className="max-w-4xl mx-auto px-5 md:px-8 py-4 md:py-6 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Desktop Title */}
            <h1 className="hidden md:block text-xl font-semibold text-gray-900">Item Details</h1>
            
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="font-medium">Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="font-medium">Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
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
            {categoryEmojis[item.category] || '📦'} {item.category}
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

        {/* Hidden Notes */}
        {item.hidden_notes && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">Hidden Notes</h2>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">
                {item.hidden_notes}
              </p>
            </div>
          </div>
        )}

        {/* Item Found Button - Desktop inline */}
        <div className="hidden md:block">
          <button
            onClick={handleItemFound}
            className="w-full py-4 rounded-xl font-semibold text-white text-base transition-colors"
            style={{ backgroundColor: '#3686C7' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2c6ba3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3686C7'}
          >
            Item Found
          </button>
        </div>
        </div>

        {/* Item Found Button - Mobile fixed at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5 safe-area-bottom">
          <button
            onClick={handleItemFound}
            className="w-full py-4 rounded-xl font-semibold text-white text-base transition-colors"
            style={{ backgroundColor: '#3686C7' }}
          >
            Item Found
          </button>
        </div>

      {/* Modals */}
      {editModalOpen && (
        <EditModal
          item={item}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

        <style jsx global>{`
          .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        `}</style>
      </div>
    </>
  )
}

