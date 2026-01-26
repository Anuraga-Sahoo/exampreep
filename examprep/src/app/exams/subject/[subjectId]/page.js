"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SubjectPage() {
    const params = useParams();
    const router = useRouter();
    const { subjectId } = params;

    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedChapterId, setExpandedChapterId] = useState(null);
    const [chapterQuizzes, setChapterQuizzes] = useState({}); // Cache for fetched quizzes
    const [loadingChapter, setLoadingChapter] = useState(null);

    useEffect(() => {
        async function fetchSubject() {
            try {
                const res = await fetch(`/api/subjects/${subjectId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Subject not found");
                }
                const data = await res.json();
                setSubject(data);
            } catch (error) {
                console.error("Fetch Error:", error);
                setSubject(null);
                // Optional: Show error in UI
                alert(error.message); // Temporary for debugging
            } finally {
                setLoading(false);
            }
        }
        if (subjectId) fetchSubject();
    }, [subjectId]);

    const handleChapterClick = async (chapterId) => {
        // Toggle if already open
        if (expandedChapterId === chapterId) {
            setExpandedChapterId(null);
            return;
        }

        setExpandedChapterId(chapterId);

        // If quizzes not already loaded, fetch them
        if (!chapterQuizzes[chapterId]) {
            setLoadingChapter(chapterId);
            try {
                const res = await fetch(`/api/chapters/${chapterId}`);
                if (res.ok) {
                    const data = await res.json();
                    setChapterQuizzes(prev => ({
                        ...prev,
                        [chapterId]: data.quizIds || []
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch chapter details:", error);
            } finally {
                setLoadingChapter(null);
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Content...</div>;
    if (!subject) return <div className="p-10 text-center">Subject not found.</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/exams" className="text-gray-500 hover:text-blue-600">← Back</Link>
                <h1 className="text-3xl font-bold">{subject.name}</h1>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-300 border-b pb-2">Chapters</h2>

            <div className="space-y-4">
                {subject.associatedChapterIds?.length > 0 ? (
                    subject.associatedChapterIds.map((chapter) => (
                        <div key={chapter._id || chapter} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div
                                onClick={() => handleChapterClick(chapter._id || chapter)}
                                className="p-5 flex justify-between items-center cursor-pointer bg-gray-50/50 dark:bg-gray-800/10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                        {chapter.name?.[0] || 'C'}
                                    </div>
                                    <h3 className="font-bold text-lg">{chapter.name}</h3>
                                </div>
                                <span className="text-gray-400">
                                    {expandedChapterId === (chapter._id || chapter) ? '▲' : '▼'}
                                </span>
                            </div>

                            {/* Quizzes List */}
                            {expandedChapterId === (chapter._id || chapter) && (
                                <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2">
                                    {loadingChapter === (chapter._id || chapter) ? (
                                        <div className="text-center py-4 text-gray-500">Loading Quizzes...</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {chapterQuizzes[chapter._id || chapter]?.length > 0 ? (
                                                chapterQuizzes[chapter._id || chapter].map((quiz) => (
                                                    <div key={quiz._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 hover:ring-1 hover:ring-blue-400 transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50 group"
                                                        onClick={() => router.push(`/test/${quiz._id}`)}>
                                                        {/* Note: Assuming /exams/[examId] handles quizzes correctly, or directly to test */}
                                                        {/* If these are individual quizzes, maybe direct to /test/[testId] is better? */}
                                                        {/* User prompt said: "user click on the quize and he or she will able to give the exam" */}
                                                        {/* Usually /test/ is for taking it. /exams/ is for details. Let's redirect to Test directly for smoother flow if it's a direct quiz. */}
                                                        {/* However, standard flow is DETAILS -> START. Let's use DETAILS page if possible, or START if metadata is light. */}
                                                        {/* Actually, the existing /exams/[examId] page lists quizzes for an "Exam". Here we are navigating Chapter -> Quiz. */}
                                                        {/* A "Quiz" in this context IS the test. So linking to /test/[quizId] (which page.js uses as testId) makes sense. */}
                                                        {/* BUT check if premium/auth check is needed. /test page handles it. */}

                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                                {quiz.timeMinutes || quiz.timerMinutes || 60} mins
                                                            </span>
                                                            {quiz.premium && <span className="text-xs font-bold text-amber-600">👑 Premium</span>}
                                                        </div>
                                                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600">{quiz.name || quiz.title}</h4>
                                                        <button
                                                            className="w-full mt-2 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // prevent double click
                                                                router.push(`/test/${quiz._id}`);
                                                            }}
                                                        >
                                                            Start Now
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center py-4 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed">
                                                    No quizzes available in this chapter yet.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">No chapters found for this subject.</div>
                )}
            </div>
        </div>
    );
}
