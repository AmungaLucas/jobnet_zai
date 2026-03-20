'use client'

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
    BriefcaseIcon,
    UsersIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

// Sample stats data
const stats = [
    { name: 'Total Jobs', value: '1,234', change: '+12%', trend: 'up', icon: BriefcaseIcon },
    { name: 'Active Users', value: '8,549', change: '+5.2%', trend: 'up', icon: UsersIcon },
    { name: 'Organizations', value: '342', change: '-2.1%', trend: 'down', icon: BuildingOfficeIcon },
    { name: 'Applications', value: '5,678', change: '+18%', trend: 'up', icon: ChartBarIcon },
];

// Sample recent activity
const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Applied for Senior Developer', time: '2 min ago' },
    { id: 2, user: 'Jane Smith', action: 'Created new organization', time: '15 min ago' },
    { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '1 hour ago' },
    { id: 4, user: 'Sarah Wilson', action: 'Posted new job listing', time: '2 hours ago' },
    { id: 5, user: 'Tom Brown', action: 'Scheduled interview', time: '3 hours ago' },
];

// Sample upcoming events
const upcomingEvents = [
    { id: 1, title: 'Interview with Tech Co', date: 'Tomorrow, 10:00 AM', type: 'interview' },
    { id: 2, title: 'Team Meeting', date: 'Mar 21, 2:00 PM', type: 'meeting' },
    { id: 3, title: 'Deadline: Project Proposal', date: 'Mar 22, 5:00 PM', type: 'deadline' },
];

export default function DashboardHome() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">
                    Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="mt-1 text-blue-100">
                    Here&apos;s what&apos;s happening with your dashboard today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <stat.icon className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-sm text-gray-500">{stat.name}</span>
                            </div>
                            <span
                                className={`flex items-center text-xs font-medium ${
                                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {stat.trend === 'up' ? (
                                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                                )}
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="px-5 py-3 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.user}
                                        </p>
                                        <p className="text-sm text-gray-500">{activity.action}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100">
                        <Link
                            href="/dashboard/activity"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View all activity →
                        </Link>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="px-5 py-3 hover:bg-gray-50">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-0.5 h-2 w-2 rounded-full ${
                                            event.type === 'interview'
                                                ? 'bg-blue-500'
                                                : event.type === 'meeting'
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {event.title}
                                        </p>
                                        <p className="text-sm text-gray-500">{event.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100">
                        <Link
                            href="/dashboard/calendar"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View calendar →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link
                        href="/dashboard/jobs"
                        className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <BriefcaseIcon className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Post Job</span>
                    </Link>
                    <Link
                        href="/dashboard/users"
                        className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <UsersIcon className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Manage Users</span>
                    </Link>
                    <Link
                        href="/dashboard/organizations"
                        className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Add Org</span>
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <ChartBarIcon className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">View Analytics</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
