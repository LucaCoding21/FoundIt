'use client'

export default function CampusModal({ isOpen, onClose, onSelectCampus, selectedCampus }) {
  if (!isOpen) return null

  const campuses = [
    { name: 'All Locations' },
    { name: 'SFU, Burnaby', icon: '🏛️' },
    { name: 'SFU, Surrey', icon: '🏛️' },
    { name: 'SFU, Vancouver', icon: '🏛️' }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm sm:mx-4 shadow-xl animate-slide-up">
          {/* Header */}
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex items-center justify-center relative">
              <h2 className="text-lg font-semibold text-gray-900">Select campus</h2>
              <button
                onClick={onClose}
                className="absolute right-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Campuses List */}
          <div className="px-4 py-3 pb-safe">
            {campuses.map((campus) => (
              <button
                key={campus.name}
                onClick={() => {
                  onSelectCampus(campus.name)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl mb-2 transition-colors ${
                  selectedCampus === campus.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-base font-medium text-gray-900">{campus.name}</span>
                {selectedCampus === campus.name && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .pb-safe {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  )
}
