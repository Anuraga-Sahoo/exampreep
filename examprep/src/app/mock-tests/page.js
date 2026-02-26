"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaClock, FaArrowRight, FaArrowLeft, FaFolderOpen, FaSearch, FaCheckCircle } from 'react-icons/fa';

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

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-ping absolute opacity-50"></div>
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20">
            {/* Premium Header Background */}
            <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-teal-50/80 to-transparent -z-10"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="container mx-auto p-6 md:p-10 max-w-7xl pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30 border border-indigo-300">
                            <FaClipboardList />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Mock Tests</h1>
                            <p className="text-gray-500 font-medium text-lg">Simulate the real exam environment with full-length tests.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">

                    {/* Category Navigation */}
                    <AnimatePresence mode="wait">
                        {viewMode === "gallery" && (
                            <motion.aside
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                                className="w-full lg:w-64 flex-shrink-0"
                            >
                                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-teal-900/5 p-4 lg:p-5 lg:sticky top-24">
                                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 lg:mb-4 px-2 hidden lg:block">Categories</h2>
                                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-1.5 pb-2 lg:pb-0 custom-scrollbar">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`flex-shrink-0 lg:w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between whitespace-nowrap lg:whitespace-normal ${selectedCategory === cat
                                                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 lg:border-l-4 lg:border-b-0 border-b-4 border-teal-500 shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <span>{cat}</span>
                                                {selectedCategory === cat && <FaCheckCircle className="text-teal-500 hidden lg:block" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {viewMode === "gallery" ? (
                                <motion.div
                                    key="gallery"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {/* Search Bar */}
                                    <div className="mb-8 relative group">
                                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search mock test series..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 bg-white/90 backdrop-blur-md shadow-lg shadow-teal-900/5 transition-all text-gray-700 font-medium placeholder-gray-400"
                                        />
                                    </div>

                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {filteredExams.length > 0 ? (
                                            filteredExams.map((exam, i) => (
                                                <motion.div
                                                    key={exam._id}
                                                    variants={{
                                                        hidden: { opacity: 0, y: 20 },
                                                        visible: { opacity: 1, y: 0 }
                                                    }}
                                                    whileHover={{ y: -6, scale: 1.02 }}
                                                    onClick={() => handleExamClick(exam)}
                                                    className="bg-white/90 backdrop-blur-md rounded-3xl border border-white hover:border-teal-100 p-6 shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:shadow-teal-900/10 transition-all cursor-pointer group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:bg-indigo-200/50 transition-colors"></div>

                                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-2xl group-hover:scale-110 shadow-sm transition-transform">
                                                            {exam.name[0]}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{exam.name}</h3>
                                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{exam.mockExamIds?.length || 0} Tests</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm font-bold text-indigo-600 bg-indigo-50/50 px-4 py-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                                        <span>View Tests</span>
                                                        <span className="group-hover:translate-x-1 transition-transform"><FaArrowRight /></span>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                    <FaSearch size={24} />
                                                </div>
                                                <p className="text-gray-500 font-medium">No exams found matching your search.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            ) : (
                                // Tests View
                                <motion.div
                                    key="tests"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="w-full"
                                >
                                    <button
                                        onClick={handleBackToGallery}
                                        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 w-max"
                                    >
                                        <FaArrowLeft /> Back to Exams
                                    </button>

                                    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-teal-900/5 p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                                        <div className="flex items-center gap-5 mb-10 pb-8 border-b border-gray-50 relative z-10">
                                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-4xl shadow-lg border-2 border-white">
                                                {activeExam.name[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{activeExam.name}</h2>
                                                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">Mock Tests Series</p>
                                            </div>
                                        </div>

                                        {loadingTests ? (
                                            <div className="text-center py-20 flex flex-col items-center justify-center">
                                                <div className="relative mb-4">
                                                    <div className="w-12 h-12 border-4 border-teal-200 rounded-full animate-ping absolute opacity-50"></div>
                                                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
                                                </div>
                                                <p className="text-teal-700 font-bold">Loading Premium Tests...</p>
                                            </div>
                                        ) : activeExam.mockExamIds && activeExam.mockExamIds.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                                {activeExam.mockExamIds.map((test, idx) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        key={test._id || test}
                                                        className="border border-gray-100 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition-all group bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden"
                                                    >
                                                        {/* Ticket stub dash */}
                                                        <div className="absolute -left-2 top-1/2 w-4 h-4 bg-[#f8fafc] rounded-full border-r border-gray-100 -translate-y-1/2"></div>
                                                        <div className="absolute -right-2 top-1/2 w-4 h-4 bg-[#f8fafc] rounded-full border-l border-gray-100 -translate-y-1/2"></div>

                                                        <div className="flex justify-between items-start mb-4">
                                                            <span className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                                {test.testType || "Mock"}
                                                            </span>
                                                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                                                                <FaClock className="text-gray-400" /> {test.timerMinutes || 60} min
                                                            </span>
                                                        </div>
                                                        <h3 className="font-extrabold text-xl mb-6 text-gray-900 line-clamp-2 leading-tight">
                                                            {test.title || test.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => router.push(`/test/${test._id}`)}
                                                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-black text-sm transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                                        >
                                                            Start Challenge <FaArrowRight />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 relative z-10">
                                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                                                    <FaClipboardList size={32} />
                                                </div>
                                                <h3 className="text-xl font-black text-gray-800 mb-2">No tests available</h3>
                                                <p className="text-gray-500 font-medium">This series doesn't have any mock tests yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
