"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { FaBars, FaTimes, FaHome, FaPencilAlt, FaBook, FaClipboardList, FaThLarge, FaUser } from 'react-icons/fa';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-gray-100/50 p-3 sm:p-4 sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50 transition-all">
            <div className="container mx-auto flex justify-between items-center max-w-7xl">
                <div className="flex gap-2 sm:gap-4 items-center">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-500 p-2 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors shrink-0"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-xl sm:text-2xl font-black bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent mr-auto tracking-tight drop-shadow-sm truncate">
                        ExamPrep
                    </Link>
                </div>

                <div className="flex gap-4 sm:gap-6 items-center">
                    {session ? (
                        <div className="flex items-center gap-4">
                            {/* User Profile */}
                            <div className="flex items-center gap-2 sm:gap-3 bg-gray-50/80 px-2 py-1.5 rounded-full border border-gray-100 hover:border-teal-100 transition-colors cursor-pointer group">
                                {session.user.image ? (
                                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:border-teal-100 transition-colors shrink-0">
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-xs sm:text-sm uppercase shadow-sm border-2 border-white group-hover:border-teal-100 transition-colors shrink-0">
                                        {session.user.name?.[0] || 'U'}
                                    </div>
                                )}
                                <div className="hidden sm:flex flex-col pr-3">
                                    <span className="text-sm font-extrabold text-gray-800 leading-none truncate max-w-[100px]">{session.user.name}</span>
                                    <span className={`text-[10px] uppercase font-bold mt-1 tracking-wider ${session.user.subscription === 'paid' ? 'text-teal-600' : 'text-gray-400'}`}>
                                        {session.user.subscription === 'paid' ? 'Premium' : 'Free Plan'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:from-teal-500 hover:to-emerald-400 transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 shadow-2xl flex flex-col gap-2 max-h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar">
                    <Link href="/dashboard" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-teal-50 group transition-colors" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-teal-500"><FaThLarge /></div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900">Dashboard</span>
                    </Link>
                    <Link href="/exams" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-emerald-50 group transition-colors" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-emerald-500"><FaPencilAlt /></div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900">Practice Tests</span>
                    </Link>
                    <Link href="/previous-year-papers" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-purple-50 group transition-colors" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-purple-500"><FaBook /></div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900">Previous Year Papers</span>
                    </Link>
                    <Link href="/mock-tests" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 group transition-colors" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-blue-500"><FaClipboardList /></div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900">Mock Tests</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-rose-50 group transition-colors" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-rose-500"><FaUser /></div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900">My Profile</span>
                    </Link>
                </div>
            )}
        </nav>
    );
}
