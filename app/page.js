'use client'

import { useState, useEffect } from 'react'
import ItemCard from '@/components/ItemCard'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

const categories = [
  'Clothing',
  'Devices',
  'Cables & Accessories',
  'Essentials',
  'Daily Items',
  'Other'
]
const campuses = ['Burnaby', 'Surrey', 'Vancouver']

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('id, photo_url, category, campus, date_found, description, created_at')
      .order('created_at', { ascending: false })
    
    if (!error) {
      setItems(data || [])
    }
    setLoading(false)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesCampus = selectedCampus === 'all' || item.campus === selectedCampus
    return matchesSearch && matchesCategory && matchesCampus
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Browse Found Items
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Find your lost belongings on campus
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent bg-white"
            >
              <option value="all">All Campuses</option>
              {campuses.map(campus => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-sfu-red rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading items...</p>
          </div>
        ) : (
          <>
            {/* Items Count */}
            {filteredItems.length > 0 && (
              <p className="text-sm text-gray-600 mb-4 px-1">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
              </p>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} isAdmin={false} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No items found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
