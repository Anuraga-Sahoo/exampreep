"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';

export default function ExamsPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch('/api/classes');
                if (res.ok) {
                    const data = await res.json();
                    setClasses(data);
                }
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchClasses();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-ping absolute opacity-50"></div>
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
            {/* Premium Header Background */}
            <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-teal-50/80 to-transparent -z-10"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="container mx-auto p-6 md:p-10 max-w-7xl pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-teal-500/30 border border-teal-300">
                            <FaBookOpen />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Practice Tests</h1>
                            <p className="text-gray-500 font-medium text-lg">Master core concepts chapter by chapter.</p>
                        </div>
                    </div>
                </motion.div>

                {classes.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {classes.map((cls, index) => {
                            const cardId = cls._id || `temp-${index}`;
                            return (
                                <motion.div
                                    key={cardId}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="bg-white/90 backdrop-blur-md rounded-3xl border border-white hover:border-teal-100 transition-all shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:shadow-teal-900/10 flex flex-col h-full overflow-hidden relative group"
                                >
                                    {/* Ambient card glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-teal-200/50 transition-colors z-0"></div>

                                    <div className="p-8 pb-6 relative z-10 border-b border-gray-50/50">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">Course Level</span>
                                                <h3 className="text-2xl font-black text-gray-900 leading-tight">{cls.name}</h3>
                                            </div>
                                            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-black text-xl border border-teal-100 shadow-sm group-hover:scale-110 group-hover:bg-teal-100 transition-all">
                                                {cls.name?.[0] || 'C'}
                                            </div>
                                        </div>
                                        <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                                            {cls.associatedSubjectIds?.length || 0} Core Subjects
                                        </div>
                                    </div>

                                    {/* Subjects List */}
                                    <div className="p-6 pt-4 flex-1 relative z-10 bg-gray-50/30">
                                        {cls.associatedSubjectIds && cls.associatedSubjectIds.length > 0 ? (
                                            <ul className="space-y-3">
                                                {cls.associatedSubjectIds.map((subject) => (
                                                    <li key={subject._id || subject}>
                                                        <Link
                                                            href={`/exams/subject/${subject._id || subject}`}
                                                            className="block p-4 rounded-xl bg-white hover:bg-teal-50 border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all flex items-center justify-between group/link"
                                                        >
                                                            <span className="font-bold text-gray-700 group-hover/link:text-teal-700">
                                                                {subject.name || "Subject"}
                                                            </span>
                                                            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/link:bg-teal-100 group-hover/link:text-teal-600 transition-all group-hover/link:-rotate-45">
                                                                <FaArrowRight size={12} />
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="h-full flex items-center justify-center py-8 text-gray-400 text-sm font-medium italic bg-white/50 rounded-xl border border-dashed border-gray-200">
                                                No subjects assigned yet.
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Decorative Border */}
                                    <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-emerald-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 absolute bottom-0 left-0"></div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="text-center p-16 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-xl">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-300">
                            <FaBookOpen size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">No Practice Classes Found</h2>
                        <p className="text-gray-500">Please check back later when courses are published.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
