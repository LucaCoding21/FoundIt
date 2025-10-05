'use client'

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
            Are you sure you want to delete this item?
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

