'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import ImageUpload from '@/components/ImageUpload'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'

const categories = ['Clothing', 'Bag', 'Wallet', 'Electronics', 'Keys', 'Water Bottle', 'Umbrella', 'Book', 'ID/Cards', 'Other']
const campuses = ['Burnaby', 'Surrey', 'Vancouver']

export default function AdminUpload() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    photo_url: '',
    category: categories[0],
    campus: campuses[0],
    date_found: new Date().toISOString().split('T')[0],
    description: '',
    hidden_notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login')
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (url) => {
    setFormData(prev => ({ ...prev, photo_url: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.photo_url) {
      alert('Please upload a photo')
      return
    }

    setSubmitting(true)

    const { error } = await supabase
      .from('items')
      .insert([{
        photo_url: formData.photo_url,
        category: formData.category,
        campus: formData.campus,
        date_found: formData.date_found,
        description: formData.description,
        hidden_notes: formData.hidden_notes,
      }])

    setSubmitting(false)

    if (!error) {
      alert('Item added successfully!')
      router.push('/admin/dashboard')
    } else {
      alert('Error adding item: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNav />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Found Item</h1>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload
              currentImageUrl={formData.photo_url}
              onImageUploaded={handleImageUploaded}
              required={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-sfu-red">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus <span className="text-sfu-red">*</span>
                </label>
                <select
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
                >
                  {campuses.map(campus => (
                    <option key={campus} value={campus}>{campus}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Found <span className="text-sfu-red">*</span>
              </label>
              <input
                type="date"
                name="date_found"
                value={formData.date_found}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-sfu-red">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Black hoodie with white strings, size medium"
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hidden Notes (for verification)
              </label>
              <textarea
                name="hidden_notes"
                value={formData.hidden_notes}
                onChange={handleChange}
                placeholder="e.g. Has small coffee stain on left sleeve"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red"
              />
              <p className="text-sm text-gray-500 mt-1">Only visible to admins</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-sfu-red text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Item'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
