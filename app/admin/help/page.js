'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HelpPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin')
    if (!adminStatus) {
      router.push('/admin/login')
    } else {
      setIsAdmin(true)
    }
  }, [router])

  if (!isAdmin) return null

  const verificationTips = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Phone',
      tips: [
        'Ask to unlock with passcode/Face ID',
        'Check lock screen wallpaper',
        'Ask about recent calls or texts',
        'Check name in Settings'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      title: 'Wallet/ID',
      tips: [
        'Ask for student ID number',
        'Verify name matches ID',
        'Check photo ID matches person',
        'Ask about cards inside'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      title: 'Keys',
      tips: [
        'Ask which key is for what',
        'Check keychain attachments',
        'Ask about room/apartment number',
        'Verify car make/model if car key'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: 'Bags/Backpacks',
      tips: [
        'Ask what\'s inside',
        'Check unique marks or pins',
        'Verify brand/color',
        'Ask about pockets/compartments'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'General Items',
      tips: [
        'Ask for specific details (color, brand)',
        'Check for unique marks/damage',
        'Ask when/where they lost it',
        'Match with reporter if exists'
      ]
    }
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Verification Guide</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Verification Guide</h1>
          <p className="text-gray-600 mt-2">Quick tips to verify item ownership at the counter</p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-6">
          
          {/* Quick Start Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Quick Reminder</h2>
                <p className="text-blue-50 leading-relaxed">
                  Always ask specific questions. Real owners know unique details about their items.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: Intro Text */}
          <div className="md:hidden mb-6">
            <p className="text-gray-600 text-sm">
              Quick tips organized by item type. Tap any card for verification questions.
            </p>
          </div>

          {/* Verification Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {verificationTips.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="bg-blue-50 text-blue-600 rounded-xl p-2.5">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{category.title}</h3>
                </div>

                {/* Tips List */}
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <div className="bg-gray-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Tips */}
          <div className="mt-6 space-y-4">
            {/* Red Flag Card */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 rounded-xl p-2 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Red Flags</h3>
                  <p className="text-sm text-red-800 leading-relaxed">
                    Hesitation, generic answers, can't unlock phone, name doesn't match ID, or conflicting details
                  </p>
                </div>
              </div>
            </div>

            {/* Green Light Card */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-xl p-2 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Good Signs</h3>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Immediate specific answers, can unlock device, details match, shows relief/emotion
                  </p>
                </div>
              </div>
            </div>

            {/* Final Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-xl p-2 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Trust Your Gut</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    If something feels off, ask more questions. It's okay to ask for additional verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

