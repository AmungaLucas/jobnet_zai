'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    BellIcon,
    ChevronDownIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

// Sample notifications
const notifications = [
    { id: 1, text: 'Your application for Senior Developer was viewed', time: '5 min ago' },
    { id: 2, text: 'New job match: Frontend Engineer at Tech Co', time: '1 hour ago' },
    { id: 3, text: 'Interview scheduled for tomorrow', time: '3 hours ago' },
    { id: 4, text: 'Your profile was viewed by 5 recruiters', time: '1 day ago' },
]

export default function DashboardHeader({ onMenuClick }) {
    const router = useRouter()
    const { user, logout } = useAuth()

    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const notificationRef = useRef(null)
    const userMenuRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Logout
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            setShowUserMenu(false)
            await logout()
            router.push('/auth/login')
        } catch (error) {
            console.error('Logout error:', error)
            router.push('/auth/login')
        } finally {
            setIsLoggingOut(false)
        }
    }

    const getDisplayName = () => {
        if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
        if (user?.firstName) return user.firstName
        if (user?.email) return user.email.split('@')[0]
        return 'User'
    }

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        }
        if (user?.firstName) return user.firstName.charAt(0).toUpperCase()
        if (user?.email) return user.email.charAt(0).toUpperCase()
        return 'U'
    }

    return (
        <header className="bg-white shadow-sm px-4 sm:px-6 py-3 flex justify-between items-center border-b sticky top-0 z-40">
            {/* LEFT SIDE */}
            <div className="flex items-center flex-1 min-w-0">
                {/* mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-2"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>

                {/* search */}
                <div className="hidden sm:block flex-1 max-w-md lg:max-w-xs">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search..."
                            type="search"
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(v => !v)}
                        className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                        <BellIcon className="h-6 w-6" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                            <div className="p-3 border-b font-semibold">
                                Notifications
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className="p-3 hover:bg-gray-50 border-b"
                                    >
                                        <p className="text-sm text-gray-800">
                                            {n.text}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {n.time}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* USER MENU */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(v => !v)}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 p-1 sm:p-2 rounded-lg hover:bg-gray-50"
                    >
                        {/* avatar */}
                        <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {getInitials()}
                        </div>

                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-medium text-gray-900">
                                {getDisplayName()}
                            </p>
                            <p className="text-xs text-blue-600">
                                {user?.role || 'User'}
                            </p>
                        </div>

                        <ChevronDownIcon className="h-4 w-4 text-gray-500 hidden lg:block" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                            <a
                                href="/dashboard/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                <UserIcon className="h-4 w-4" />
                                Profile
                            </a>

                            <a
                                href="/dashboard/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                <Cog6ToothIcon className="h-4 w-4" />
                                Settings
                            </a>

                            <div className="border-t my-1"></div>

                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
