"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { FaBars, FaTimes, FaHome, FaPencilAlt, FaBook, FaClipboardList } from 'react-icons/fa';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600 dark:text-gray-300 p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mr-auto">
                        ExamPrep
                    </Link>
                </div>

                <div className="flex gap-6 items-center">
                    {session ? (
                        <div className="flex items-center gap-4">
                            {/* User Profile */}
                            <div className="flex items-center gap-3">
                                {session.user.image ? (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs uppercase">
                                        {session.user.name?.[0] || 'U'}
                                    </div>
                                )}
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">{session.user.name}</span>
                                    <span className={`text-[10px] uppercase font-bold mt-1 ${session.user.subscription === 'paid' ? 'text-amber-600' : 'text-gray-500'}`}>
                                        {session.user.subscription === 'paid' ? 'Premium' : 'Free Plan'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-xs sm:text-sm border border-gray-300 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 shadow-xl flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>
                        <FaHome className="text-blue-500" />
                        <span className="font-medium">Home</span>
                    </Link>
                    <Link href="/exams" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>
                        <FaPencilAlt className="text-green-500" />
                        <span className="font-medium">Practice Tests</span>
                    </Link>
                    <Link href="/previous-year-papers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>
                        <FaBook className="text-orange-500" />
                        <span className="font-medium">Previous Year Papers</span>
                    </Link>
                    <Link href="/mock-tests" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>
                        <FaClipboardList className="text-purple-500" />
                        <span className="font-medium">Mock Tests</span>
                    </Link>
                </div>
            )}
        </nav>
    );
}
