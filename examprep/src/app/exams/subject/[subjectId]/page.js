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
        <div className="container mx-auto p-6 bg-white min-h-screen">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/exams" className="text-gray-500 hover:text-teal-600 font-medium transition-colors">← Back</Link>
                <h1 className="text-3xl font-bold text-gray-800">{subject.name}</h1>
            </div>

            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-2">Chapters</h2>

            <div className="space-y-4">
                {subject.associatedChapterIds?.length > 0 ? (
                    subject.associatedChapterIds.map((chapter) => (
                        <div key={chapter._id || chapter} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div
                                onClick={() => handleChapterClick(chapter._id || chapter)}
                                className="p-5 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg border border-teal-100">
                                        {chapter.name?.[0] || 'C'}
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800">{chapter.name}</h3>
                                </div>
                                <span className="text-gray-400">
                                    {expandedChapterId === (chapter._id || chapter) ? '▲' : '▼'}
                                </span>
                            </div>

                            {/* Quizzes List */}
                            {expandedChapterId === (chapter._id || chapter) && (
                                <div className="p-5 border-t border-gray-100 bg-gray-50/30 animate-in slide-in-from-top-2">
                                    {loadingChapter === (chapter._id || chapter) ? (
                                        <div className="text-center py-4 text-gray-500">Loading Quizzes...</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {chapterQuizzes[chapter._id || chapter]?.length > 0 ? (
                                                chapterQuizzes[chapter._id || chapter].map((quiz) => (
                                                    <div key={quiz._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                                                        onClick={() => router.push(`/test/${quiz._id}`)}>

                                                        {quiz.premium && (
                                                            <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                                                PREMIUM
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
                                                                {quiz.timeMinutes || quiz.timerMinutes || 60} mins
                                                            </span>
                                                        </div>
                                                        <h4 className="font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-teal-600 transition-colors">{quiz.name || quiz.title}</h4>
                                                        <button
                                                            className="w-full py-2.5 rounded-lg bg-white border border-teal-600 text-teal-600 font-bold hover:bg-teal-600 hover:text-white transition-all shadow-sm"
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
                                                <div className="col-span-full text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
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
