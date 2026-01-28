"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBookOpen, FaClock, FaArrowRight, FaArrowLeft, FaFolderOpen, FaFileAlt } from 'react-icons/fa';

export default function PreviousYearPapersPage() {
    const router = useRouter();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("gallery"); // 'gallery' (all exams) or 'papers' (specific exam papers)
    const [activeExam, setActiveExam] = useState(null);
    const [loadingPapers, setLoadingPapers] = useState(false);

    useEffect(() => {
        async function fetchPYQExams() {
            try {
                const res = await fetch('/api/pyq');
                if (res.ok) {
                    const data = await res.json();
                    setExams(data);
                }
            } catch (error) {
                console.error("Failed to fetch PYQ exams:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPYQExams();
    }, []);

    // Extract categories
    const categories = ["All", ...new Set(exams.map(e => e.category || "General").filter(Boolean))];

    const filteredExams = selectedCategory === "All"
        ? exams
        : exams.filter(e => (e.category || "General") === selectedCategory);

    const handleExamClick = async (exam) => {
        // Set basic info mainly for title while loading
        setActiveExam(exam);
        setViewMode("papers");
        setLoadingPapers(true);

        try {
            // Fetch fresh details with populated papers
            console.log("Frontend: Fetching details for", exam._id);
            const res = await fetch(`/api/pyq/${exam._id}`);
            if (res.ok) {
                const fullExamData = await res.json();
                console.log("Frontend: Received Data:", fullExamData);
                setActiveExam(fullExamData);
            }
        } catch (error) {
            console.error("Failed to load papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const handleBackToGallery = () => {
        setActiveExam(null);
        setViewMode("gallery");
    };

    if (loading) return <div className="p-10 text-center">Loading Previous Year Papers...</div>;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h1 className="text-3xl font-bold mb-2">Previous Year Papers</h1>
            <p className="text-gray-600 mb-8">Access past papers to boost your preparation.</p>

            <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">

                {/* Left Sidebar: Categories (Visible in Gallery Mode) */}
                {viewMode === "gallery" && (
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
                            <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-4 px-2">Categories</h2>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <div className="flex-1">
                    {viewMode === "gallery" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExams.length > 0 ? (
                                filteredExams.map((exam) => (
                                    <div
                                        key={exam._id}
                                        onClick={() => handleExamClick(exam)}
                                        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                                {exam.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{exam.name}</h3>
                                                <p className="text-xs text-gray-500">{exam.previousYearExamsIds?.length || 0} Papers</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>View Papers</span>
                                            <span className="group-hover:translate-x-1 transition-transform"><FaArrowRight /></span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200">
                                    No exams found in this category.
                                </div>
                            )}
                        </div>
                    ) : (
                        // Papers View
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={handleBackToGallery}
                                className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <FaArrowLeft /> Back to Exams
                            </button>

                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl">
                                        {activeExam.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{activeExam.name}</h2>
                                        <p className="text-gray-500">Previous Year Question Papers</p>
                                    </div>
                                </div>

                                {loadingPapers ? (
                                    <div className="text-center py-20">
                                        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-500">Loading Papers...</p>
                                    </div>
                                ) : activeExam.previousYearExamsIds && activeExam.previousYearExamsIds.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeExam.previousYearExamsIds.map((paper) => (
                                            <div key={paper._id || paper} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group bg-gray-50 dark:bg-gray-800/50">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-xs font-bold rounded">
                                                        {paper.year || "2024"}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FaClock className="inline mb-0.5" /> {paper.timerMinutes || 60} min
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 line-clamp-2">
                                                    {paper.title || paper.name}
                                                </h3>
                                                <button
                                                    onClick={() => router.push(`/test/${paper._id}`)}
                                                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                                                >
                                                    Start Test
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                                        <div className="text-5xl mb-4 flex justify-center"><FaFolderOpen className="opacity-20" /></div>
                                        <p className="text-lg">No papers available yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
