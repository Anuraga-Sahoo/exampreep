"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { FaHome, FaPencilAlt, FaBook, FaClipboardList, FaThLarge, FaUser } from 'react-icons/fa';

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Only show sidebar if user is logged in and not taking a test
    if (!session || pathname?.startsWith('/test/')) return null;

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: <FaThLarge /> },
        { name: 'Practice Tests', href: '/exams', icon: <FaPencilAlt /> },
        { name: 'Previous Year Papers', href: '/previous-year-papers', icon: <FaBook /> },
        { name: 'Mock Tests', href: '/mock-tests', icon: <FaClipboardList /> },
        { name: 'My Profile', href: '/profile', icon: <FaUser /> },
    ];

    return (
        <aside className="hidden md:block w-64 bg-white border-r border-gray-100 shadow-xl flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto z-40">
            <div className="p-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</h2>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                            >
                                <span className={`text-lg ${isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`}>{link.icon}</span>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Resources</h2>
                    <div className="px-3 py-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-800 mb-2 font-medium">✨ Go Premium</p>
                        <p className="text-xs text-blue-600 mb-3 leading-relaxed">
                            Unlock unlimited tests and detailed analytics.
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-md shadow-blue-200">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
