"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaGraduationCap, FaChartLine, FaClipboardList, FaArrowRight, FaTrash } from 'react-icons/fa';

export default function DashboardPage() {
    const { data: session } = useSession();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const attemptsRes = await fetch('/api/attempts');

                if (attemptsRes.ok) {
                    const attemptsData = await attemptsRes.json();
                    setAttempts(attemptsData);
                } else {
                    console.error("Failed to fetch attempts:", attemptsRes.status);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Calculate Stats
    const testsTaken = attempts.length;
    const averageScore = testsTaken > 0
        ? Math.round(attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / testsTaken)
        : 0;

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-ping absolute opacity-50"></div>
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl overflow-x-hidden">
            <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-full">
                    <p className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-1">Student Dashboard</p>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight break-words">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 whitespace-nowrap">{session?.user?.name?.split(' ')[0] || "Student"}</span>!
                    </h1>
                </div>
                <Link href="/exams" className="bg-white hover:bg-teal-50 text-teal-700 text-sm font-bold py-2.5 px-6 rounded-xl border border-teal-100 shadow-sm transition-colors flex items-center justify-center gap-2 w-full md:w-max">
                    Resume Practice <FaArrowRight />
                </Link>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-blue-200/50 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1">Mock Tests</p>
                            <h3 className="text-4xl sm:text-5xl font-black text-gray-900">{testsTaken}</h3>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-blue-100"><FaClipboardList /></div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-emerald-200/50 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1">Average Score</p>
                            <h3 className="text-4xl sm:text-5xl font-black text-gray-900">{averageScore}%</h3>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-emerald-100"><FaChartLine /></div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-500/20 border border-teal-400 relative overflow-hidden sm:col-span-2 md:col-span-1">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="flex justify-between items-start relative z-10 text-white">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-teal-100 mb-1">Active Course</p>
                            <h3 className="text-2xl sm:text-3xl font-black leading-tight mt-1">General <br className="hidden sm:block" />Preparation</h3>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-white/30"><FaGraduationCap /></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mb-10 w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
                    <Link href="/mock-tests" className="text-sm font-bold text-teal-600 hover:text-teal-700 md:w-auto w-max">View All</Link>
                </div>

                {attempts.length > 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden w-full">
                        <div className="overflow-x-auto custom-scrollbar w-full pb-2">
                            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 sm:px-8 py-4 sm:py-5">Test Name</th>
                                        <th className="px-4 sm:px-8 py-4 sm:py-5">Date</th>
                                        <th className="px-4 sm:px-8 py-4 sm:py-5">Score</th>
                                        <th className="px-6 sm:px-8 py-4 sm:py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {attempts.slice(0, 5).map((attempt) => (
                                        <tr key={attempt._id} className="hover:bg-teal-50/50 transition-colors">
                                            <td className="px-6 sm:px-8 py-4 sm:py-5 font-bold text-gray-800 max-w-[200px] truncate" title={attempt.quizTitle}>
                                                {attempt.quizTitle}
                                            </td>
                                            <td className="px-4 sm:px-8 py-4 sm:py-5 text-gray-500 font-medium whitespace-nowrap">
                                                {new Date(attempt.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 sm:px-8 py-4 sm:py-5">
                                                <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wide ${attempt.percentage >= 80 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        attempt.percentage >= 50 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                            'bg-rose-100 text-rose-700 border border-rose-200'
                                                        }`}>
                                                        {Math.round(attempt.percentage)}%
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs font-bold text-gray-400">({attempt.score}/{attempt.totalQuestions})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 sm:px-8 py-4 sm:py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 sm:gap-3 transition-opacity">
                                                    <Link
                                                        href={`/test/${attempt.quizId}`}
                                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-teal-600 hover:bg-teal-50 border border-teal-100 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold transition-all shadow-sm"
                                                    >
                                                        Retake
                                                    </Link>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm("Are you sure you want to delete this attempt?")) {
                                                                try {
                                                                    const res = await fetch(`/api/attempts?id=${attempt._id}`, { method: 'DELETE' });
                                                                    if (res.ok) {
                                                                        setAttempts(prev => prev.filter(a => a._id !== attempt._id));
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Delete error:", err);
                                                                }
                                                            }
                                                        }}
                                                        className="p-1.5 sm:p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-colors"
                                                        title="Delete Attempt"
                                                    >
                                                        <FaTrash size={14} className="sm:text-base" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 p-8 sm:p-16 text-center w-full">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FaClipboardList className="text-2xl sm:text-3xl" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-2">No tests taken yet</h3>
                        <p className="text-gray-500 font-medium mb-6 text-sm sm:text-base">Your recent test history will appear here once you start practicing.</p>
                        <Link href="/exams" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-teal-500/30 transition-transform hover:-translate-y-0.5 inline-block text-sm sm:text-base">
                            Start Practicing
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
