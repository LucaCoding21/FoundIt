'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryModal from '@/components/CategoryModal'
import CampusModal from '@/components/CampusModal'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

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

export default function ReportLost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    photo_url: '',
    category: categories[0],
    campus: campuses[0],
    date_lost: new Date().toISOString().split('T')[0],
    details: '',
    location_description: '',
    email: '',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [campusModalOpen, setCampusModalOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    setUploading(true)
    
    try {
      // Upload to Supabase
      const fileExt = file.name.split('.').pop()
      const fileName = `reports/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('foundit-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('foundit-images')
        .getPublicUrl(fileName)

      // Replace blob URL with public URL
      URL.revokeObjectURL(localBlobUrl)
      setPreview(publicUrl)
      setFormData(prev => ({ ...prev, photo_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Failed to upload image. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('reports')
        .insert([formData])

      if (error) throw error

      // Show success and redirect
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit report. Please try again.')
      setSubmitting(false)
    }
  }

  const isFormValid = formData.title && formData.details && formData.email

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Top Nav Bar */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-4 md:py-6">
          {/* Mobile Header */}
          <div className="flex md:hidden justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="text-base font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#3686C7' }}
          >
            Cancel
          </button>
          <h1 className="text-base font-semibold text-gray-900">Report Lost Item</h1>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            className="text-base font-semibold transition-opacity disabled:opacity-40"
            style={{ color: isFormValid && !submitting ? '#3686C7' : '#9CA3AF' }}
          >
            {submitting ? 'Submitting...' : 'Done'}
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Lost Item</h1>
            <p className="text-gray-500 mt-1">We'll help you find it</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 shadow-sm"
              style={{ 
                backgroundColor: isFormValid && !submitting ? '#3686C7' : '#E5E7EB',
                color: isFormValid && !submitting ? 'white' : '#9CA3AF'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Report submitted</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-5 md:px-8 pt-6 md:pt-8 space-y-4 md:space-y-6">
        {/* Photo Upload Hero */}
        <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm">
          {preview ? (
            <div className="relative w-full h-full group">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold shadow-lg">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 transition-colors">
              <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="text-gray-600 font-medium mb-1">Add Photo (Optional)</span>
              <span className="text-sm text-gray-400">Tap to take or upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What did you lose?"
            required
            className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Category & Campus */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className="bg-white rounded-2xl shadow-sm p-4 text-left"
          >
            <div className="text-xs text-gray-500 mb-1">Category</div>
            <div className="flex items-center gap-2 text-base font-medium text-gray-900">
              <span>{categoryEmojis[formData.category]}</span>
              <span>{formData.category}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCampusModalOpen(true)}
            className="bg-white rounded-2xl shadow-sm p-4 text-left"
          >
            <div className="text-xs text-gray-500 mb-1">Campus</div>
            <div className="text-base font-medium text-gray-900">{formData.campus}</div>
          </button>
        </div>

        {/* Date Lost */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-2">When did you lose it?</div>
          <input
            type="date"
            name="date_lost"
            value={formData.date_lost}
            onChange={handleChange}
            required
            className="w-full text-base text-gray-900 focus:outline-none"
          />
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-2">Where did you lose it?</div>
          <input
            type="text"
            name="location_description"
            value={formData.location_description}
            onChange={handleChange}
            placeholder="e.g., Near the library"
            className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="text-xs text-gray-500 mb-2">Description</div>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Describe your item: color, brand, unique features..."
            required
            rows={3}
            className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-2">Your Email</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@sfu.ca"
              required
              className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-2">Phone Number (Optional)</div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(604) 123-4567"
              className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Helper Text */}
        <div className="pt-2 pb-4">
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            We'll search our database for matches and contact you if we find your item.
          </p>
        </div>
      </form>

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectCategory={(category) => {
          setFormData(prev => ({ ...prev, category }))
          setCategoryModalOpen(false)
        }}
        selectedCategory={formData.category}
      />

      <CampusModal
        isOpen={campusModalOpen}
        onClose={() => setCampusModalOpen(false)}
        onSelectCampus={(campus) => {
          setFormData(prev => ({ ...prev, campus: campus.split(', ')[1] }))
          setCampusModalOpen(false)
        }}
        selectedCampus={`SFU, ${formData.campus}`}
      />

      <style jsx global>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
