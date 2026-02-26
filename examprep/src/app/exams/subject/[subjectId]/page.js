"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaChevronDown, FaChevronRight, FaPlayCircle, FaArrowLeft, FaClock } from 'react-icons/fa';

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

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-ping absolute opacity-50"></div>
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
            </div>
        </div>
    );
    if (!subject) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Subject not found</h2>
            <p className="text-gray-500 mb-6">The subject you're looking for doesn't exist or was removed.</p>
            <Link href="/exams" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all">
                Back to Practice Tests
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20">
            {/* Premium Header Background */}
            <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-teal-50/80 to-transparent -z-10"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="container mx-auto p-6 md:p-10 max-w-5xl pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <Link href="/exams" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors mb-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-max">
                        <FaArrowLeft /> Back to Courses
                    </Link>

                    <div className="flex items-center gap-5 mt-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-teal-500/30 border border-teal-300">
                            <FaBookOpen />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{subject.name}</h1>
                            <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mt-1">{subject.associatedChapterIds?.length || 0} Modules Available</p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6 relative z-10">
                    {subject.associatedChapterIds?.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            {subject.associatedChapterIds.map((chapter) => (
                                <motion.div
                                    key={chapter._id || chapter}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="bg-white/90 backdrop-blur-md border border-white rounded-3xl overflow-hidden shadow-xl shadow-teal-900/5 hover:border-teal-100 transition-all mb-4 group"
                                >
                                    <div
                                        onClick={() => handleChapterClick(chapter._id || chapter)}
                                        className="p-5 md:p-6 flex justify-between items-center cursor-pointer hover:bg-teal-50/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600 flex items-center justify-center font-black text-xl border border-teal-100 group-hover:scale-110 transition-transform shadow-sm">
                                                {chapter.name?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-xl text-gray-800 group-hover:text-teal-700 transition-colors">{chapter.name}</h3>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 hidden sm:block">Click to view exercises</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm text-gray-400 group-hover:text-teal-600 group-hover:border-teal-200 transition-all">
                                            <motion.div
                                                animate={{ rotate: expandedChapterId === (chapter._id || chapter) ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <FaChevronDown />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Quizzes List */}
                                    <AnimatePresence>
                                        {expandedChapterId === (chapter._id || chapter) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="border-t border-gray-100 bg-gray-50/50"
                                            >
                                                <div className="p-6 md:p-8">
                                                    {loadingChapter === (chapter._id || chapter) ? (
                                                        <div className="flex justify-center py-8">
                                                            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                                            {chapterQuizzes[chapter._id || chapter]?.length > 0 ? (
                                                                chapterQuizzes[chapter._id || chapter].map((quiz, quizIdx) => (
                                                                    <motion.div
                                                                        key={quiz._id}
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: quizIdx * 0.05 }}
                                                                        onClick={() => router.push(`/test/${quiz._id}`)}
                                                                        className="bg-white border text-left border-gray-100 rounded-2xl p-5 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group/card flex flex-col h-full"
                                                                    >
                                                                        {quiz.premium && (
                                                                            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-sm z-10">
                                                                                PREMIUM
                                                                            </div>
                                                                        )}

                                                                        <div className="flex justify-between items-start mb-4">
                                                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 flex items-center gap-1.5">
                                                                                <FaClock className="text-teal-400" /> {quiz.timeMinutes || quiz.timerMinutes || 60} min
                                                                            </span>
                                                                        </div>

                                                                        <h4 className="font-extrabold text-gray-800 mb-6 line-clamp-2 leading-tight group-hover/card:text-teal-600 transition-colors flex-1">{quiz.name || quiz.title}</h4>

                                                                        <button
                                                                            className="w-full py-3 rounded-xl bg-gray-50 border-2 border-transparent group-hover/card:bg-gradient-to-r group-hover/card:from-teal-500 group-hover/card:to-emerald-500 group-hover/card:text-white text-gray-600 font-black text-sm transition-all flex items-center justify-center gap-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                router.push(`/test/${quiz._id}`);
                                                                            }}
                                                                        >
                                                                            Start Test <FaPlayCircle className="text-lg opacity-80" />
                                                                        </button>
                                                                    </motion.div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-full text-center py-10 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                                                    <p className="text-gray-500 font-medium">No exercises available in this module yet.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-xl">
                            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-300">
                                <FaBookOpen size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">No Modules Found</h2>
                            <p className="text-gray-500 font-medium">This subject doesn't have any content yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
