'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full px-6 py-12">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl text-white font-bold">JR</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">JobReady</h1>
          <p className="text-gray-500 mt-2">Admin Dashboard</p>
        </div>

        {/* Loading Indicator */}
        <div className="space-y-6">
          {/* Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Loading Progress - Using Tailwind's built-in animation */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Initializing...</span>
              <span className="text-gray-700 font-medium">Please wait</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              {/* Using inline style for animation instead of styled-jsx */}
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: '100%',
                  animation: 'loading 2s ease-in-out infinite'
                }}
              ></div>
            </div>
          </div>

          {/* Loading Tips */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800 text-center">
              ⚡ Preparing your dashboard for the best experience
            </p>
          </div>
        </div>
      </div>

      {/* Add keyframes in a style tag in the head - this won't cause hydration issues */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
