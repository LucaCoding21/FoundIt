'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import CategoryModal from '@/components/CategoryModal'
import CampusModal from '@/components/CampusModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
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

export default function AdminDashboard() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedCampus, setSelectedCampus] = useState('All Locations')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [campusModalOpen, setCampusModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login')
      return
    }
    fetchItems()
  }, [router])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching items:', error)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemToDelete)

    if (!error) {
      fetchItems()
    }
    
    setDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory
    const matchesCampus = selectedCampus === 'All Locations' || item.campus === selectedCampus.split(', ')[1]
    return matchesSearch && matchesCategory && matchesCampus
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
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <button 
              onClick={() => router.push('/admin/upload')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for missing items"
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

          {/* Location */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Location near you</span>
            <button 
              onClick={() => setCampusModalOpen(true)}
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: '#3686C7' }}
            >
              {selectedCampus}
            </button>
          </div>

          {/* Category Button */}
          <div>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: 'rgba(54, 134, 199, 0.27)',
                color: selectedCategory === 'All Categories' ? '#000000' : '#3686C7'
              }}
            >
              {selectedCategory === 'All Categories' ? (
                <>
                  <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>All Categories</span>
                </>
              ) : (
                <>
                  <span>{categoryEmojis[selectedCategory] || ''}</span>
                  <span>{selectedCategory}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Full Card Image with Overlay */}
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.photo_url}
                  alt={item.title || item.description}
                  fill
                  className="object-cover"
                />
                
                {/* Dark gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-10"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Content overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h3 className="text-base font-semibold mb-2 line-clamp-1">
                    {item.title || item.description}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span>SFU {item.campus}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: 'rgba(54, 134, 199, 0.56)' }}>
                    <span>{categoryEmojis[item.category] || '📦'}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 font-medium">No items found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <BottomNav />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <CampusModal
        isOpen={campusModalOpen}
        onClose={() => setCampusModalOpen(false)}
        onSelectCampus={setSelectedCampus}
        selectedCampus={selectedCampus}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  )
}
