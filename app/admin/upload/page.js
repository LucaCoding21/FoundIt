'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import AdminSidebar from '@/components/AdminSidebar'
import CategoryModal from '@/components/CategoryModal'
import CampusModal from '@/components/CampusModal'
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

const categoryEmojis = {
  'Clothing': '👕',
  'Devices': '📱',
  'Cables & Accessories': '🔌',
  'Essentials': '🔑',
  'Daily Items': '🎒',
  'Other': '📦'
}

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
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [campusModalOpen, setCampusModalOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [abortController, setAbortController] = useState(null)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login')
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    // Instant local preview
    const localBlobUrl = URL.createObjectURL(file)
    setPreview(localBlobUrl)
    
    // Start AI analysis
    const controller = new AbortController()
    setAbortController(controller)
    setAnalyzing(true)
    
    try {
      const result = await analyzeFoundItem(file, controller.signal)
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          title: result.data.title || prev.title,
          category: result.data.category || prev.category,
          description: result.data.description || prev.description,
          hidden_notes: result.data.hidden_notes || prev.hidden_notes,
        }))
      }
    } catch (error) {
      if (!error.message?.includes('cancelled')) {
        console.error('Error analyzing photo:', error)
      }
    } finally {
      setAnalyzing(false)
      setAbortController(null)
    }

    // Upload to Supabase
    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `items/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('foundit-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('foundit-images')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl
      
      URL.revokeObjectURL(localBlobUrl)
      setPreview(publicUrl)
      setFormData(prev => ({ ...prev, photo_url: publicUrl }))

    } catch (err) {
      console.error('Upload error:', err)
      URL.revokeObjectURL(localBlobUrl)
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleCancelAnalysis = () => {
    if (abortController) {
      abortController.abort()
      setAnalyzing(false)
      setAbortController(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.photo_url) {
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
      // Navigate immediately to dashboard with success flag
      router.push('/admin/dashboard?success=true')
    } else {
      alert('Error adding item: ' + error.message)
    }
  }

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 md:ml-64">
        {/* Top Header */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
          <div className="px-5 md:px-8 py-4 md:py-6">
            {/* Mobile Header */}
            <div className="flex md:hidden justify-between items-center">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Upload Item</h1>
              <button 
                onClick={handleSubmit}
                disabled={submitting || !formData.photo_url}
                className="px-4 py-2 rounded-full font-semibold text-sm transition-all disabled:opacity-40"
                style={{ 
                  backgroundColor: (!submitting && formData.photo_url) ? '#3686C7' : '#E5E7EB',
                  color: (!submitting && formData.photo_url) ? 'white' : '#9CA3AF'
                }}
              >
                {submitting ? 'Saving...' : 'Done'}
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload Found Item</h1>
                <p className="text-gray-500 mt-1">Add a new item to the database</p>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={submitting || !formData.photo_url}
                className="px-6 py-3 rounded-xl font-semibold text-base transition-all disabled:opacity-40 shadow-sm"
                style={{ 
                  backgroundColor: (!submitting && formData.photo_url) ? '#3686C7' : '#E5E7EB',
                  color: (!submitting && formData.photo_url) ? 'white' : '#9CA3AF'
                }}
              >
                {submitting ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="px-5 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
          {/* Desktop: Two Column Layout, Mobile: Single Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column: Photo Upload */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
                <div className={`relative w-full max-w-md mx-auto lg:mx-0 aspect-[3/4] rounded-3xl overflow-hidden ${preview ? 'bg-gray-900' : 'bg-gray-100'} cursor-pointer transition-all`}>
              {preview ? (
                <>
                  {/* Use regular img tag for better mobile/blob URL support */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity">
                      <div className="px-6 py-3 bg-white bg-opacity-90 rounded-full flex items-center gap-2">
                        <svg className="w-5 h-5" style={{ color: '#3686C7' }} fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">Change Photo</span>
                      </div>
                    </div>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-3 border-white border-t-transparent mx-auto mb-3"></div>
                        <p className="text-white font-medium">Uploading...</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(54, 134, 199, 0.1)' }}>
                    <svg className="w-10 h-10" style={{ color: '#3686C7' }} fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 mb-1">Add Photo</p>
                    <p className="text-sm text-gray-500">Tap to take or upload</p>
                  </div>
                </div>
              )}
                </div>
              </label>

              {/* AI Analysis Status */}
              {analyzing && (
                <div className="mt-4 px-4 py-3 rounded-2xl flex items-center justify-between gap-3" style={{ backgroundColor: 'rgba(54, 134, 199, 0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent" style={{ borderColor: '#3686C7', borderTopColor: 'transparent' }}></div>
                    <span className="text-sm font-medium" style={{ color: '#3686C7' }}>AI analyzing photo...</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelAnalysis}
                    className="text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: '#3686C7' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-4">
          {/* Title */}
          <div className="bg-white rounded-2xl p-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Item title"
              required
              className="w-full text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Category & Campus Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(true)}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{categoryEmojis[formData.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Category</p>
                <p className="text-sm font-medium text-gray-900 truncate">{formData.category}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setCampusModalOpen(true)}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">📍</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Campus</p>
                <p className="text-sm font-medium text-gray-900 truncate">SFU {formData.campus}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Date Found */}
          <div className="bg-white rounded-2xl p-4">
            <label className="text-xs text-gray-500 block mb-2">Date Found</label>
            <input
              type="date"
              name="date_found"
              value={formData.date_found}
              onChange={handleChange}
              required
              className="w-full text-sm font-medium text-gray-900 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4">
            <label className="text-xs text-gray-500 block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item in detail..."
              required
              rows={4}
              className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
            />
          </div>

          {/* Hidden Notes */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500">Hidden Notes</label>
              <span className="text-xs text-gray-400">Admin only</span>
            </div>
            <textarea
              name="hidden_notes"
              value={formData.hidden_notes}
              onChange={handleChange}
              placeholder="Private verification details..."
              rows={3}
              className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
            />
              </div>
            </div>
          </div>
        </form>

        <BottomNav />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectCategory={(cat) => setFormData(prev => ({ ...prev, category: cat }))}
        selectedCategory={formData.category}
      />

      <CampusModal
        isOpen={campusModalOpen}
        onClose={() => setCampusModalOpen(false)}
        onSelectCampus={(campus) => {
          const campusName = campus.split(', ')[1] || campus.split(' ')[1] || campuses[0]
          setFormData(prev => ({ ...prev, campus: campusName }))
        }}
        selectedCampus={`SFU, ${formData.campus}`}
      />
      </div>
    </>
  )
}
