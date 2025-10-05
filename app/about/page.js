import Navbar from '@/components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">About FoundIt</h1>
          
          <div className="space-y-6 text-gray-700">
            <p className="text-base sm:text-lg leading-relaxed">
              FoundIt digitizes campus lost & found, making it easy for students to browse 
              found items and report lost belongings.
            </p>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">How It Works</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-sfu-red font-bold flex-shrink-0">1.</span>
                  <span>Campus staff upload photos of found items</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sfu-red font-bold flex-shrink-0">2.</span>
                  <span>Students browse items online like a marketplace</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sfu-red font-bold flex-shrink-0">3.</span>
                  <span>Report lost items to get matched with found items</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sfu-red font-bold flex-shrink-0">4.</span>
                  <span>Claim items in person with proper verification</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Contact</h2>
              <p className="leading-relaxed">
                For questions or support, contact your campus Lost & Found desk.
              </p>
            </div>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">
                Version 1.0 | Built with Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
