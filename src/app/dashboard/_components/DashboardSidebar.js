'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    HomeIcon,
    UsersIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    FolderIcon,
    ChartBarIcon,
    CalendarIcon,
    ChatBubbleLeftIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ComputerDesktopIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function DashboardSidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState({});

    const closeSidebar = () => setIsOpen?.(false);

    // Navigation items
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
        { name: 'Jobs', href: '/dashboard/jobs', icon: BriefcaseIcon },
        { name: 'Opportunities', href: '/dashboard/opportunities', icon: SparklesIcon },
        { name: 'Adverts', href: '/dashboard/adverts', icon: BriefcaseIcon },
        { name: 'Organizations', href: '/dashboard/organizations', icon: BuildingOfficeIcon },
        {
            name: 'Categories',
            href: '/dashboard/categories',
            icon: FolderIcon,
            children: [
                { name: 'All Categories', href: '/dashboard/categories' },
                { name: 'Add Category', href: '/dashboard/categories/add' },
            ],
        },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
        { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
        { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftIcon },
        { name: 'Devices', href: '/dashboard/devices', icon: ComputerDesktopIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    ];

    const isActiveExact = (href) => pathname === href;

    const isParentActive = (item) => {
        if (item.children) {
            return item.children.some((child) => pathname === child.href);
        }
        return pathname === item.href || pathname?.startsWith(item.href + '/');
    };

    const toggleSection = (href) => {
        setOpenSections((prev) => ({
            ...prev,
            [href]: !prev[href],
        }));
    };

    const SidebarInner = (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="shrink-0 border-b border-gray-200 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                <span className="text-lg font-bold text-blue-600">JR</span>
                            </span>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-gray-900">JobReady</div>
                                <div className="truncate text-xs text-gray-500">Admin Dashboard</div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile close button */}
                    <button
                        onClick={closeSidebar}
                        className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Close sidebar"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const hasChildren = !!(item.children && item.children.length);
                        const parentActive = isParentActive(item);
                        const sectionOpen = hasChildren ? (openSections[item.href] ?? parentActive) : false;

                        if (!hasChildren) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={cn(
                                        'group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                                        parentActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                >
                                    {parentActive && (
                                        <span className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-blue-600" />
                                    )}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <item.icon
                                            className={cn('h-5 w-5 shrink-0', parentActive ? 'text-blue-700' : 'text-gray-500')}
                                        />
                                        <span className="truncate">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        }

                        return (
                            <div key={item.name} className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => toggleSection(item.href)}
                                    className={cn(
                                        'group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                                        parentActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                    aria-expanded={sectionOpen}
                                >
                                    {parentActive && (
                                        <span className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-blue-600" />
                                    )}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <item.icon
                                            className={cn('h-5 w-5 shrink-0', parentActive ? 'text-blue-700' : 'text-gray-500')}
                                        />
                                        <span className="truncate">{item.name}</span>
                                    </div>
                                    <ChevronDownIcon
                                        className={cn(
                                            'h-4 w-4 shrink-0 text-gray-500 transition-transform',
                                            sectionOpen && 'rotate-180'
                                        )}
                                    />
                                </button>

                                {sectionOpen && (
                                    <div className="ml-3 border-l border-gray-200 pl-3">
                                        <div className="space-y-1">
                                            {item.children.map((child) => {
                                                const childActive = isActiveExact(child.href);
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        onClick={closeSidebar}
                                                        className={cn(
                                                            'relative flex items-center rounded-xl px-3 py-2 text-sm transition',
                                                            childActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                                        )}
                                                    >
                                                        {childActive && (
                                                            <span className="absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-blue-600" />
                                                        )}
                                                        <span className="truncate">{child.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <aside className="hidden h-screen w-72 shrink-0 border-r border-gray-200 md:block">{SidebarInner}</aside>

            {/* Mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/40" onClick={closeSidebar} />
                    <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] overflow-hidden bg-white shadow-2xl">
                        {SidebarInner}
                    </div>
                </div>
            )}
        </>
    );
}
