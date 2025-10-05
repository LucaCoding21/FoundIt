'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ItemCard({ item, isAdmin, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg smooth-transition overflow-hidden">
      <div className="relative w-full h-56 sm:h-48 bg-gray-200">
        <Image
          src={item.photo_url}
          alt={item.description}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <p className="text-gray-800 font-semibold mb-3 line-clamp-2 text-base sm:text-sm leading-snug">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 mb-4">
          <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            {item.category}
          </span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            {item.campus}
          </span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            {formatDate(item.date_found)}
          </span>
        </div>

        {isAdmin ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 px-4 py-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 touch-feedback"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 px-4 py-3 text-sm font-medium bg-sfu-red text-white rounded-xl hover:bg-red-700 touch-feedback"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            href={`/item/${item.id}`}
            className="block w-full px-4 py-3 text-center text-sm font-semibold bg-sfu-red text-white rounded-xl hover:bg-red-700 touch-feedback"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  )
}
