'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import ImageUpload from '@/components/ImageUpload'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/auth'
import { analyzeFoundItem } from '@/lib/gemini'

const categories = [
  'Clothing',
  'Devices',
  'Cables & Accessories',
  'Essentials',
  'Daily Items',
  'Other'
]
const campuses = ['Burnaby', 'Surrey', 'Vancouver']

export default function AdminUpload() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    photo_url: '',
    category: categories[0],
    campus: campuses[0],
    date_found: new Date().toISOString().split('T')[0],
    description: '',
    hidden_notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [imageFile, setImageFile] = useState(null)

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

  const handleFileSelected = async (file) => {
    setImageFile(file)
    
    // Start AI analysis immediately (runs in parallel with upload)
    setAnalyzing(true)
    
    try {
      const result = await analyzeFoundItem(file)
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          title: result.data.title || prev.title,
          category: result.data.category || prev.category,
          description: result.data.description || prev.description,
          hidden_notes: result.data.hidden_notes || prev.hidden_notes,
        }))
      } else {
        console.error('Analysis failed:', result.error)
      }
    } catch (error) {
      console.error('Error analyzing photo:', error)
    } finally {
      setAnalyzing(false)
    }
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
        title: formData.title,
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
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Upload Found Item</h1>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <ImageUpload
              currentImageUrl={formData.photo_url}
              onImageUploaded={handleImageUploaded}
              onFileSelected={handleFileSelected}
              required={true}
            />

            {analyzing && (
              <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-semibold flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                AI analyzing photo...
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-sfu-red">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Black Nike Hoodie"
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-sfu-red">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campus <span className="text-sfu-red">*</span>
                </label>
                <select
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent bg-white"
                >
                  {campuses.map(campus => (
                    <option key={campus} value={campus}>{campus}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Found <span className="text-sfu-red">*</span>
              </label>
              <input
                type="date"
                name="date_found"
                value={formData.date_found}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-sfu-red">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Black hoodie with white strings, size medium"
                required
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hidden Notes (for verification)
              </label>
              <textarea
                name="hidden_notes"
                value={formData.hidden_notes}
                onChange={handleChange}
                placeholder="e.g. Has small coffee stain on left sleeve"
                rows={2}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">Only visible to admins</p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 smooth-transition font-semibold touch-feedback"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 px-6 py-3.5 bg-sfu-red text-white rounded-xl hover:bg-red-700 smooth-transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-feedback"
              >
                {submitting ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
