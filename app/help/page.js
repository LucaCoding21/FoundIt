'use client'

import { useRouter } from 'next/navigation'

export default function StudentHelp() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Help</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-6">
        <div className="space-y-4">
          {/* How to Use */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">How to Use FoundIt</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#3686C7' }}>1.</span>
                <span>Browse found items on the home page</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#3686C7' }}>2.</span>
                <span>Use search and filters to find your item</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#3686C7' }}>3.</span>
                <span>Tap "Report Lost Item" if you don't see it</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#3686C7' }}>4.</span>
                <span>Visit Lost & Found office to claim your item</span>
              </li>
            </ul>
          </div>

          {/* Claiming Items */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Claiming Your Item</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>To claim an item you've found on FoundIt:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Visit the Lost & Found office in person</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Bring your student ID</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Be ready to describe or verify the item</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lost & Found Office */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Lost & Found Office</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Location</p>
                <p className="text-gray-900 font-medium">AQ 2030</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Hours</p>
                <p className="text-gray-900 font-medium">Monday - Friday, 9 AM - 5 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Need More Help?</h2>
            <p className="text-sm text-gray-700 mb-4">
              If you have questions or issues with FoundIt, contact campus support:
            </p>
            <div className="space-y-3">
              <a 
                href="tel:778-782-3111"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: 'rgba(54, 134, 199, 0.05)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3686C7' }}>
                  <svg className="w-5 h-5 text-white" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Call SFU Support</p>
                  <p className="text-xs text-gray-500">778-782-3111</p>
                </div>
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Common Questions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-1">How long are items kept?</p>
                <p className="text-gray-600">Items are typically held for 90 days before donation or disposal.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">What if my item isn't listed?</p>
                <p className="text-gray-600">Submit a lost item report - we'll notify you if it's found.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Can I pick up items after hours?</p>
                <p className="text-gray-600">No, items can only be claimed during office hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

