'use client'

export default function CategoryModal({ isOpen, onClose, onSelectCategory, selectedCategory }) {
  if (!isOpen) return null

  const categories = [
    { name: 'Clothing', icon: '👕' },
    { name: 'Devices', icon: '📱' },
    { name: 'Cables & Accessories', icon: '🔌' },
    { name: 'Essentials', icon: '🔑' },
    { name: 'Daily Items', icon: '🎒' },
    { name: 'Other', icon: '📦' }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md sm:mx-4 shadow-2xl animate-slide-up pointer-events-auto">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <div className="text-center">
              {/* Drag Handle */}
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Select category</h2>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 top-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Categories List */}
          <div className="px-4 pb-6 max-h-[60vh] overflow-y-auto">
            {/* All Categories Option */}
            <button
              onClick={() => {
                onSelectCategory('All Categories')
                onClose()
              }}
              className={`w-full flex items-center justify-between px-5 py-4 mb-2 rounded-2xl transition-all ${
                selectedCategory === 'All Categories' 
                  ? 'bg-blue-50 shadow-sm' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">📋</div>
                <span className="text-base font-medium text-gray-900">All Categories</span>
              </div>
              {selectedCategory === 'All Categories' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Category Items */}
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  onSelectCategory(category.name)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-5 py-4 mb-2 rounded-2xl transition-all ${
                  selectedCategory === category.name 
                    ? 'bg-blue-50 shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{category.icon}</div>
                  <span className="text-base font-medium text-gray-900">{category.name}</span>
                </div>
                {selectedCategory === category.name && (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3686C7' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Safe area padding for iOS */}
          <div className="h-safe"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .h-safe {
          height: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  )
}
