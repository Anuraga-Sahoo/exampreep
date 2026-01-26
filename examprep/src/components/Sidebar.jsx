"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Only show sidebar if user is logged in and not taking a test
    if (!session || pathname?.startsWith('/test/')) return null;

    const links = [
        { name: 'Home', href: '/dashboard', icon: '🏠' },
        { name: 'Practice Tests', href: '/exams', icon: '📝' },
        { name: 'Previous Year Papers', href: '/previous-year-papers', icon: '📚' },
        { name: 'Mock Tests', href: '/mock-tests', icon: '📝' },
    ];

    return (
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</h2>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Resources</h2>
                    <div className="px-3 py-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <p className="text-xs text-blue-800 dark:text-blue-300 mb-2 font-medium">✨ Go Premium</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-3 leading-relaxed">
                            Unlock unlimited tests and detailed analytics.
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
