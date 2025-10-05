'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function ImageUpload({ currentImageUrl, onImageUploaded, onFileSelected, required = false }) {
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
    
    // Pass file to parent (for Gemini analysis)
    if (onFileSelected) {
      onFileSelected(file)
    }
    
    // INSTANT LOCAL PREVIEW - Show immediately using blob URL
    const localBlobUrl = URL.createObjectURL(file)
    setPreview(localBlobUrl)
    
    // Start background upload
    setUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `items/${fileName}`

      // Upload to Supabase Storage (in background)
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
      
      // Clean up blob URL to prevent memory leak
      URL.revokeObjectURL(localBlobUrl)
      
      // Swap to public URL
      setPreview(publicUrl)
      onImageUploaded(publicUrl)

    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image: ' + err.message)
      // Revert to no preview on error
      URL.revokeObjectURL(localBlobUrl)
      setPreview(null)
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
            capture="environment"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div className={`
            flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed cursor-pointer smooth-transition
            ${uploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 bg-white hover:border-sfu-red hover:bg-red-50'}
          `}>
            <svg className={`w-6 h-6 ${uploading ? 'text-gray-400' : 'text-sfu-red'}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`font-medium ${uploading ? 'text-gray-400' : 'text-gray-700'}`}>
              {uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Take Photo or Upload'}
            </span>
          </div>
        </label>
        <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
          Camera, Photo Library, or Files · JPG, PNG, WEBP (max 5MB)
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
