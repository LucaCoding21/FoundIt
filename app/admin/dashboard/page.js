'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import ItemCard from '@/components/ItemCard'
import EditModal from '@/components/EditModal'
import DeleteModal from '@/components/DeleteModal'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

const categories = ['Clothing', 'Bag', 'Wallet', 'Electronics', 'Keys', 'Water Bottle', 'Umbrella', 'Book', 'ID/Cards', 'Other']
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">{items.length} items in system</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
            >
              <option value="all">All Campuses</option>
              {campuses.map(campus => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found.</p>
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
