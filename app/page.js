'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CategoryModal from '@/components/CategoryModal'
import CampusModal from '@/components/CampusModal'
import { supabase } from '@/lib/supabase'
import foundItLogo from '@/assets/founditdog.png'

const categoryEmojis = {
  'Clothing': '👕',
  'Devices': '📱',
  'Cables & Accessories': '🔌',
  'Essentials': '🔑',
  'Daily Items': '🎒',
  'Other': '📦'
}

export default function Home() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedCampus, setSelectedCampus] = useState('All Locations')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [campusModalOpen, setCampusModalOpen] = useState(false)
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

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

  const handleHelp = () => {
    setSettingsMenuOpen(false)
    router.push('/help')
  }

  const handleAbout = () => {
    setSettingsMenuOpen(false)
    router.push('/about')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20 md:pb-8">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 md:py-6">
          {/* Mobile Header */}
          <div className="flex md:hidden justify-between items-center mb-4">
            <div className="p-2 translate-y-[5px]">
              <Image
                src={foundItLogo}
                alt="FoundIt"
                width={57}
                height={57}
                className="w-14 h-14"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Home</h1>
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
                      onClick={handleAbout}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">About</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Find Your Lost Item</h1>
              <p className="text-gray-500 mt-2">Browse found items or report something you've lost</p>
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
                      onClick={handleAbout}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">About</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for your missing item"
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

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            {/* Location */}
            <div className="flex justify-between md:justify-start items-center md:gap-2">
              <span className="text-sm text-gray-600">Location:</span>
              <button 
                onClick={() => setCampusModalOpen(true)}
                className="text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ color: '#3686C7' }}
              >
                {selectedCampus}
              </button>
            </div>

            {/* Category Button */}
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 w-fit"
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

            {/* Desktop Report Button */}
            <button
              onClick={() => router.push('/report')}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm hover:shadow-md transition-all ml-auto"
              style={{ backgroundColor: '#3686C7' }}
            >
              <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Report Lost Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-5 md:pt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/item/${item.id}`)}
            >
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

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="max-w-md mx-auto px-8 py-4">
          <div className="flex justify-around items-center">
            {/* Home */}
            <button className="flex flex-col items-center gap-1.5 relative transition-all duration-200 ease-out">
              <svg 
                className="w-9 h-9 transition-colors duration-200 ease-out" 
                style={{ color: '#3686C7' }}
                fill="none"
                strokeWidth="2.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Report Lost Item */}
            <button 
              onClick={() => router.push('/report')}
              className="flex flex-col items-center gap-1.5 relative transition-all duration-200 ease-out"
            >
              <svg 
                className="w-9 h-9 transition-colors duration-200 ease-out"
                style={{ color: '#9CA3AF' }}
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

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
