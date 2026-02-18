"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ExamDetailsPage() {
    const params = useParams();
    const { examId } = params;
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExam() {
            try {
                const res = await fetch(`/api/exams/${examId}`);
                if (res.ok) {
                    const data = await res.json();
                    setExam(data);
                }
            } catch (error) {
                console.error("Failed to fetch exam:", error);
            } finally {
                setLoading(false);
            }
        }
        if (examId) fetchExam();
    }, [examId]);

    if (loading) return <div className="p-8 text-center">Loading Exam Details...</div>;
    if (!exam) return <div className="p-8 text-center">Exam not found.</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">← Back to Dashboard</Link>
                <h1 className="text-3xl font-bold">{exam.name || exam.title}</h1>
                <p className="text-gray-600 mt-2">{exam.description}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>

            {exam.quizIds && exam.quizIds.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {exam.quizIds.map((quiz) => {
                        // Guard clause: If quiz is null or just an ID string (population failed), skip or show fallback
                        if (!quiz || typeof quiz !== 'object') return null;

                        return (
                            <div key={quiz._id} className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-600 mb-2 inline-block">
                                        {quiz.testType || "Quiz"}
                                    </span>
                                    {quiz.premium && (
                                        <span className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                                            🔒 Premium
                                        </span>
                                    )}
                                    <h3 className="text-xl font-bold">{quiz.title || "Untitled Quiz"}</h3>
                                    <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                        <span>{quiz.timerMinutes || 60} Mins</span>
                                        <span>•</span>
                                        <span>{quiz.sections?.length || 1} Sections</span>
                                    </div>
                                </div>
                                <Link href={`/test/${quiz._id}`} className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity text-center min-w-[140px]">
                                    Start Quiz
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-gray-500">No quizzes available for this exam yet.</div>
            )}
        </div>
    );
}
