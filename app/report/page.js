'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ItemCard from '@/components/ItemCard'
import ImageUpload from '@/components/ImageUpload'
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

export default function ReportLost() {
  const [submitted, setSubmitted] = useState(false)
  const [matches, setMatches] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category: categories[0],
    campus: campuses[0],
    location_description: '',
    details: '',
    email: '',
    photo_url: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (url) => {
    setFormData(prev => ({ ...prev, photo_url: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Insert report
    const { error } = await supabase
      .from('reports')
      .insert([formData])

    if (!error) {
      // Find possible matches
      const { data } = await supabase
        .from('items')
        .select('id, photo_url, category, campus, date_found, description, created_at')
        .eq('category', formData.category)
        .eq('campus', formData.campus)
      
      setMatches(data || [])
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      alert('Error submitting report: ' + error.message)
    }
    
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  We've saved your report. Check the possible matches below.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  (Email notifications not yet implemented)
                </p>
              </div>
            </div>

            {matches.length > 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 px-1">
                  Possible Matches ({matches.length})
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {matches.map(item => (
                    <ItemCard key={item.id} item={item} isAdmin={false} />
                  ))}
                </div>
              </div>
            )}

            {matches.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-600 text-base">
                  No current matches found. We'll notify you if something similar comes in.
                </p>
              </div>
            )}

            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setMatches([])
                  setFormData({
                    category: categories[0],
                    campus: campuses[0],
                    location_description: '',
                    details: '',
                    email: '',
                    photo_url: '',
                  })
                }}
                className="px-6 py-3 text-sfu-red hover:text-red-700 smooth-transition font-semibold touch-feedback"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Report Lost Item</h1>
          <p className="text-gray-600 text-base sm:text-lg">Tell us what you lost and we'll help you find it</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                Where did you lose it? <span className="text-sfu-red">*</span>
              </label>
              <textarea
                name="location_description"
                value={formData.location_description}
                onChange={handleChange}
                placeholder="e.g. Near the library on the second floor"
                required
                rows={2}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-sfu-red">*</span>
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Describe your item: color, brand, unique features..."
                required
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent resize-none"
              />
            </div>

            <ImageUpload
              currentImageUrl={formData.photo_url}
              onImageUploaded={handleImageUploaded}
              required={false}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email <span className="text-sfu-red">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@sfu.ca"
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sfu-red focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                We'll contact you if we find a match (feature coming soon)
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-sfu-red text-white rounded-xl hover:bg-red-700 smooth-transition font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed touch-feedback"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
