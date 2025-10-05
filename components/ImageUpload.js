'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function ImageUpload({ currentImageUrl, onImageUploaded, required = false }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImageUrl || null)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `items/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('foundit-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('foundit-images')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl
      setPreview(publicUrl)
      onImageUploaded(publicUrl)

    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Photo {required && <span className="text-sfu-red">*</span>}
      </label>

      {preview && (
        <div className="relative w-full h-56 sm:h-48 bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div>
        <label className="relative block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div className={`
            flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed cursor-pointer smooth-transition
            ${uploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 bg-white hover:border-sfu-red hover:bg-red-50'}
          `}>
            <svg className={`w-6 h-6 ${uploading ? 'text-gray-400' : 'text-sfu-red'}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`font-medium ${uploading ? 'text-gray-400' : 'text-gray-700'}`}>
              {uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload Photo'}
            </span>
          </div>
        </label>
        <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
          JPG, PNG, or WEBP (max 5MB)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-sfu-red">{error}</p>
        </div>
      )}
    </div>
  )
}
