'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from './_components/DashboardSidebar'
import DashboardHeader from './_components/DashboardHeader'
import ConnectionStatus from '@/components/sync/ConnectionStatus'

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex flex-col flex-1 min-w-0">
                <DashboardHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>

            <ConnectionStatus />
        </div>
    )
}
