"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExams() {
            try {
                const res = await fetch('/api/exams');
                if (res.ok) {
                    const data = await res.json();
                    setExams(data);
                }
            } catch (error) {
                console.error("Failed to fetch exams:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchExams();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name || "Student"}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Mock Tests Taken</h3>
                    <p className="text-4xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Average Score</h3>
                    <p className="text-4xl font-bold text-green-600">0%</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Active Course</h3>
                    <p className="text-xl font-medium">General</p>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Your Exams</h2>
                {loading ? (
                    <p>Loading exams...</p>
                ) : exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <Link key={exam._id} href={`/exams/${exam._id}`} className="block group">
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 font-bold text-xl">
                                        {(exam.name?.[0] || exam.title?.[0] || 'E')}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{exam.name || exam.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">{exam.description || "No description available."}</p>
                                    <div className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {exam.category || "General"}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center text-gray-500">
                        No exams found.
                    </div>
                )}
            </div>
        </div>
    );
}
