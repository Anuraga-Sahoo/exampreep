"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name || "Student"}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Mock Tests Taken</h3>
                    <p className="text-4xl font-bold text-blue-600">{testsTaken}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Average Score</h3>
                    <p className="text-4xl font-bold text-green-600">{averageScore}%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Active Course</h3>
                    <p className="text-xl font-medium">General</p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                {attempts.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Test Name</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Score</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attempts.slice(0, 3).map((attempt) => (
                                        <tr key={attempt._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{attempt.quizTitle}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(attempt.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${attempt.percentage >= 70 ? 'bg-green-100 text-green-700' :
                                                    attempt.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {attempt.score}/{attempt.totalQuestions} ({Math.round(attempt.percentage)}%)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/test/${attempt.quizId}`}
                                                    className="inline-block px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
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
                                                                } else {
                                                                    alert("Failed to delete attempt");
                                                                }
                                                            } catch (err) {
                                                                console.error("Delete error:", err);
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="Delete Attempt"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                        No tests taken yet. Start practicing today!
                    </div>
                )}
            </div>


        </div>
    );
}
