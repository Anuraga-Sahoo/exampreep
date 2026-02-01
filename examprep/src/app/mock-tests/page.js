"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClipboardList, FaClock, FaArrowRight, FaArrowLeft, FaFolderOpen, FaSearch } from 'react-icons/fa';

export default function MockTestsPage() {
    const router = useRouter();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("gallery"); // 'gallery' or 'tests'
    const [activeExam, setActiveExam] = useState(null);
    const [loadingTests, setLoadingTests] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        async function fetchExams() {
            try {
                const res = await fetch('/api/mock-tests/exams');
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

    // Extract categories
    const categories = ["All", ...new Set(exams.map(e => e.category || "General").filter(Boolean))];

    const filteredExams = exams.filter(e => {
        const matchesCategory = selectedCategory === "All" || (e.category || "General") === selectedCategory;
        const matchesSearch = (e.name || "").toLowerCase().includes((debouncedSearchQuery || "").toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleExamClick = async (exam) => {
        setActiveExam(exam);
        setViewMode("tests");
        setLoadingTests(true);

        try {
            const res = await fetch(`/api/mock-tests/${exam._id}`);
            if (res.ok) {
                const fullExamData = await res.json();
                setActiveExam(fullExamData);
            }
        } catch (error) {
            console.error("Failed to load mock tests:", error);
        } finally {
            setLoadingTests(false);
        }
    };

    const handleBackToGallery = () => {
        setActiveExam(null);
        setViewMode("gallery");
    };

    if (loading) return <div className="p-10 text-center">Loading Mock Tests...</div>;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h1 className="text-3xl font-bold mb-2">Mock Tests</h1>
            <p className="text-gray-600 mb-8">Take full-length mock tests to simulate the exam experience.</p>

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
                                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
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
                        <>
                            {/* Search Bar */}
                            <div className="mb-6 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search mock test series..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-900 shadow-sm transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExams.length > 0 ? (
                                    filteredExams.map((exam) => (
                                        <div
                                            key={exam._id}
                                            onClick={() => handleExamClick(exam)}
                                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                                    {exam.name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">{exam.name}</h3>
                                                    <p className="text-xs text-gray-500">{exam.mockExamIds?.length || 0} Mock Tests</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <span>View Tests</span>
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
                        </>
                    ) : (
                        // Tests View
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={handleBackToGallery}
                                className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors"
                            >
                                <FaArrowLeft /> Back to Exams
                            </button>

                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-3xl">
                                        {activeExam.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{activeExam.name}</h2>
                                        <p className="text-gray-500">Mock Tests Series</p>
                                    </div>
                                </div>

                                {loadingTests ? (
                                    <div className="text-center py-20">
                                        <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-500">Loading Tests...</p>
                                    </div>
                                ) : activeExam.mockExamIds && activeExam.mockExamIds.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeExam.mockExamIds.map((test) => (
                                            <div key={test._id || test} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-400 hover:shadow-md transition-all group bg-gray-50 dark:bg-gray-800/50">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-xs font-bold rounded">
                                                        {test.testType || "Mock"}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FaClock className="inline mb-0.5" /> {test.timerMinutes || 60} min
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 line-clamp-2">
                                                    {test.title || test.name}
                                                </h3>
                                                <button
                                                    onClick={() => router.push(`/test/${test._id}`)}
                                                    className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-colors shadow-sm shadow-purple-200 dark:shadow-none"
                                                >
                                                    Start Test
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                                        <div className="text-5xl mb-4 flex justify-center"><FaClipboardList className="opacity-20" /></div>
                                        <p className="text-lg">No mock tests available yet.</p>
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
