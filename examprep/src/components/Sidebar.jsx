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
        <aside className="hidden md:block w-64 bg-white border-r border-gray-100 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto z-40 custom-scrollbar">
            <div className="p-5 flex flex-col h-full">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Menu</h2>
                <nav className="space-y-1.5 flex-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3.5 px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-r-4 border-teal-500 text-teal-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${isActive ? 'bg-white text-teal-600 shadow-sm' : 'bg-transparent text-gray-400 group-hover:bg-white group-hover:text-gray-700 group-hover:shadow-sm'}`}>
                                    <span className="text-lg">{link.icon}</span>
                                </div>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 relative group cursor-pointer mb-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative p-5 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl border border-teal-500/50 shadow-xl overflow-hidden">

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-white/20 w-1/2 h-full -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

                        <div className="relative z-10">
                            <h2 className="text-xs font-black text-teal-100 uppercase tracking-widest mb-1 shadow-sm">✨ Go Premium</h2>
                            <p className="text-sm font-bold text-white mb-4 leading-tight">
                                Unlock unlimited tests & analytics.
                            </p>
                            <button className="w-full bg-white hover:bg-gray-50 text-teal-700 text-xs font-extrabold py-2.5 rounded-xl transition-colors shadow-md shadow-black/10">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(250%); }
                }
            `}} />
        </aside>
    );
}
