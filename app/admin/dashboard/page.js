'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import ItemCard from '@/components/ItemCard'
import EditModal from '@/components/EditModal'
import DeleteModal from '@/components/DeleteModal'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

const categories = [
  'Clothing',
  'Devices',
  'Cables & Accessories',
  'Essentials',
  'Daily Items',
  'Other'
]
const campuses = ['Burnaby', 'Surrey', 'Vancouver']

export default function AdminDashboard() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItemId, setDeletingItemId] = useState(null)

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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesCampus = selectedCampus === 'all' || item.campus === selectedCampus
    return matchesSearch && matchesCategory && matchesCampus
  })

  const handleEdit = (item) => {
    setEditingItem(item)
  }

  const handleSaveEdit = async (updatedItem) => {
    const { error } = await supabase
      .from('items')
      .update({
        photo_url: updatedItem.photo_url,
        category: updatedItem.category,
        campus: updatedItem.campus,
        date_found: updatedItem.date_found,
        description: updatedItem.description,
        hidden_notes: updatedItem.hidden_notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updatedItem.id)

    if (!error) {
      fetchItems()
      setEditingItem(null)
    }
  }

  const handleDelete = (itemId) => {
    setDeletingItemId(itemId)
  }

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', deletingItemId)

    if (!error) {
      fetchItems()
    }
    setDeletingItemId(null)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            <span className="font-semibold text-sfu-red">{items.length}</span> {items.length === 1 ? 'item' : 'items'} in system
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

        {/* Items Count */}
        {filteredItems.length > 0 && (
          <p className="text-sm text-gray-600 mb-4 px-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No items found</p>
            <p className="text-gray-400 text-sm mt-2">Add items from the Upload page</p>
          </div>
        )}
      </main>

      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deletingItemId && (
        <DeleteModal
          onClose={() => setDeletingItemId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}
