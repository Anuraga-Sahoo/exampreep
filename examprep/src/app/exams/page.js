"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

    if (loading) return <div className="p-10 text-center">Loading Practice Sections...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Practice Tests</h1>
            <p className="text-gray-600 mb-8">Select your Class and Subject to start.</p>

            {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, index) => {
                        const cardId = cls._id || `temp-${index}`;
                        return (
                            <div key={cardId} className="bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-all shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                            {cls.name?.[0] || 'C'}
                                        </div>
                                        <h3 className="text-xl font-bold">{cls.name}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{cls.associatedSubjectIds?.length || 0} Subjects</p>
                                </div>

                                {/* Subjects List - Always Visible */}
                                <div className="p-4 flex-1">
                                    {cls.associatedSubjectIds && cls.associatedSubjectIds.length > 0 ? (
                                        <ul className="space-y-2">
                                            {cls.associatedSubjectIds.map((subject) => (
                                                <li key={subject._id || subject}>
                                                    <Link
                                                        href={`/exams/subject/${subject._id || subject}`}
                                                        className="block p-3 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between group"
                                                    >
                                                        <span className="font-medium text-sm text-gray-700 group-hover:text-blue-600">
                                                            {subject.name || "Subject"}
                                                        </span>
                                                        <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm italic">
                                            No subjects added.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-10 bg-white rounded-xl border border-gray-200">
                    No classes found. Please check back later.
                </div>
            )}
        </div>
    );
}
