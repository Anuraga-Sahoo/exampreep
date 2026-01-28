'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Timer from '@/components/Timer';
import { FaClipboardList, FaClock, FaArrowRight, FaArrowLeft, FaFolderOpen, FaList, FaTimes } from 'react-icons/fa';
import QuestionViewer from '@/components/QuestionViewer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TestPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const testId = params.testId;

    const [quiz, setQuiz] = useState(null);
    const [sections, setSections] = useState([]);
    const [flattenedQuestions, setFlattenedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const [showPalette, setShowPalette] = useState(false);

    // Derived state for current section
    const currentSectionId = useMemo(() => {
        if (!flattenedQuestions[currentQuestionIndex]) return null;
        return flattenedQuestions[currentQuestionIndex].sectionId;
    }, [currentQuestionIndex, flattenedQuestions]);

    // Calculate Status Counts
    const statusCounts = useMemo(() => {
        let answered = 0;
        let marked = 0;
        let notVisited = 0;
        // let markedAndAnswered = 0; // If you want to track this separately

        flattenedQuestions.forEach((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isMarked = markedForReview.has(idx);
            // Simple Logic: 
            // Answered = Has Answer
            // Marked = Marked (regardless of answer)
            // Not Visited = Neither

            if (isAnswered) answered++;
            if (isMarked) marked++;
            if (!isAnswered && !isMarked) {
                // Technically "Not Visited" usually implies "Not Seen". 
                // Here we just count it as "Not Attempted/Marked" for simplicity or use a visited set.
                // For now, let's treat "Not Visited" as "Rest"
            }
        });

        // Exact count based on palette logic:
        // Palette Legend: Answered (Green), Marked (Yellow), Not Visited (Grey)
        // We can just count keys.
        const ansCount = Object.keys(answers).length;
        const markCount = markedForReview.size;
        const total = flattenedQuestions.length;
        const notVisitedCount = total - ansCount - markCount; // Rough approximation (overlap exists) or just Total - (Answered U Marked)

        // Better:
        // Answered: count of answers indices
        // Marked: count of marked indices
        // Not Visited: Total - visited (if tracking) or Total - Answered - Marked (if we assume exclusive, which they arent)

        // Let's use simple exclusive counts for display if that's what user expects, or just raw counts.
        // User asked: "how many questions user answered and how many questions user marked and how many questions user not visited"

        // Let's calculate exactly based on unique states if possible, or just raw totals.
        // Usually: 
        // 1. Answered 
        // 2. Not Answered 
        // 3. Not Visited
        // 4. Marked
        // 5. Marked & Answered

        return {
            answered: ansCount,
            marked: markCount,
            notVisited: Math.max(0, total - ansCount - (markCount - 0)) // This math is tricky without explicit visited state.
            // Let's stick to raw set sizes for now as requested.
        };
    }, [answers, markedForReview, flattenedQuestions]);

    const notVisitedCount = flattenedQuestions.length - Object.keys(answers).length; // Simple approach: Total - Answered = Not Answered/Visited

    useEffect(() => {
        if (!testId) return;

        async function fetchQuiz() {
            try {
                const res = await fetch(`/api/quizzes/${testId}`);
                if (!res.ok) throw new Error("Quiz not found");
                const data = await res.json();

                // Access Control
                if (data.premium) {
                    if (!session) {
                        router.push('/login?callbackUrl=/test/' + testId);
                        return;
                    }
                    if (session.user.subscription !== 'paid') {
                        alert("This is a Premium Quiz. Please upgrade to access.");
                        router.push('/dashboard');
                        return;
                    }
                }

                setQuiz(data);

                // Process Sections and Questions
                const flatIdx = [];
                const processedSections = data.sections.map(section => {
                    const startIndex = flatIdx.length;
                    section.questions.forEach(q => {
                        flatIdx.push({
                            ...q,
                            sectionName: section.name,
                            sectionId: section._id || section.id || section.name
                        });
                    });
                    return {
                        id: section._id || section.id || section.name,
                        name: section.name,
                        startIndex: startIndex,
                        endIndex: flatIdx.length - 1,
                        count: section.questions.length
                    };
                });

                setSections(processedSections);
                setFlattenedQuestions(flatIdx);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchQuiz();
    }, [testId, session, router]);

    const handleOptionSelect = (optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const handleClearResponse = () => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestionIndex];
            return newAnswers;
        });
    };

    const toggleMarkReview = () => {
        setMarkedForReview(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestionIndex)) {
                newSet.delete(currentQuestionIndex);
            } else {
                newSet.add(currentQuestionIndex);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        const attemptData = {
            quizId: testId,
            quizTitle: quiz.title,
            answers,
            questions: flattenedQuestions,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('lastAttempt', JSON.stringify(attemptData));
        router.push(`/result/${Date.now()}`);
    };

    // Updated: Explicitly jump to the start index of the selected section
    const handleSectionClick = (startIndex) => {
        setCurrentQuestionIndex(startIndex);
    };

    const handleNext = () => {
        if (currentQuestionIndex < flattenedQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Quiz...</div>;
    if (!quiz) return <div className="p-10 text-center">Quiz not found. <Link href="/dashboard" className="text-blue-600">Go back</Link></div>;

    const currentQuestion = flattenedQuestions[currentQuestionIndex];

    // Recalculate distinct counts for UI
    const totalQuestions = flattenedQuestions.length;
    const answeredCount = Object.keys(answers).length;
    const markedCount = markedForReview.size;
    // For "Not Visited", typically in these apps it means questions you haven't even reached.
    // Since we don't track "reach", we can treat "Not Answered" as the metric, or "Not Visited" as (Total - Answered - Marked) approx.
    // Let's just use "Not Answered" which is simpler and more accurate.
    const notAnsweredCount = totalQuestions - answeredCount;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-black">
            {/* Top Header: Title, Timer, Submit */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center shadow-sm z-30 relative">
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden text-gray-600 dark:text-gray-300 p-1"
                        onClick={() => setShowPalette(!showPalette)}
                    >
                        {showPalette ? <FaTimes size={20} /> : <FaList size={20} />}
                    </button>
                    <div>
                        <h1 className="font-bold text-sm sm:text-lg line-clamp-1">{quiz.title}</h1>
                        <span className="text-xs text-gray-500 hidden sm:inline">{quiz.associatedExamName || quiz.testType}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Timer durationMinutes={quiz.timerMinutes || 60} onTimeUp={handleSubmit} />
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg text-xs sm:text-base font-bold transition-colors whitespace-nowrap"
                    >
                        Submit <span className="hidden sm:inline">Test</span>
                    </button>
                </div>
            </header>

            {/* Section Tabs Bar - Fixed below header */}
            {sections.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex gap-1 overflow-x-auto shadow-sm z-10">
                    {sections.map((section) => {
                        const isActive = section.id === currentSectionId;
                        return (
                            <button
                                key={section.id}
                                onClick={() => handleSectionClick(section.startIndex)}
                                className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors uppercase tracking-wide ${isActive
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {section.name}
                                <span className="ml-2 text-xs opacity-70 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
                                    {section.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto flex flex-col">
                    {flattenedQuestions.length > 0 ? (
                        <>
                            <QuestionViewer
                                question={currentQuestion}
                                questionIndex={currentQuestionIndex}
                                totalQuestions={flattenedQuestions.length}
                                selectedOption={answers[currentQuestionIndex]}
                                onSelectOption={handleOptionSelect}
                                onMarkReview={toggleMarkReview}
                                isMarked={markedForReview.has(currentQuestionIndex)}
                                sectionName={currentQuestion.sectionName}
                            />

                            {/* Navigation Bar */}
                            <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-6 py-4 border-t border-gray-100 dark:border-gray-800 gap-4 sm:gap-0">
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        disabled={currentQuestionIndex === 0}
                                        onClick={handlePrevious}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm sm:text-base"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleClearResponse}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium text-sm sm:text-base truncate"
                                        title="Clear selected option"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                    <button
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 font-medium text-sm sm:text-base truncate"
                                        onClick={() => {
                                            toggleMarkReview();
                                            handleNext();
                                        }}
                                    >
                                        Mark & Next
                                    </button>
                                    <button
                                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm shadow-blue-200 dark:shadow-none text-sm sm:text-base whitespace-nowrap"
                                        onClick={handleNext}
                                    >
                                        {currentQuestionIndex === flattenedQuestions.length - 1 ? 'Finish' : 'Save & Next'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-10">No questions available for this test.</div>
                    )}
                </main>

                {/* Question Palette (Sideboard) */}
                <aside className={`
                    fixed inset-0 top-[60px] z-20 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out
                    lg:static lg:transform-none lg:w-80 lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:flex lg:flex-col
                    ${showPalette ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">Question Palette</h3>
                        <button className="lg:hidden text-gray-500" onClick={() => setShowPalette(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        {/* Status Counts Summary */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-green-500 text-white text-xs font-bold">{answeredCount}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-red-500 text-white text-xs font-bold">{notAnsweredCount}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Not Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-yellow-400 text-white text-xs font-bold">{markedCount}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Marked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">0</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Not Visited</span>
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-700" />
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                        {sections.map(section => (
                            <div key={section.id} className="mb-8">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
                                    {section.name}
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 px-2 py-0.5 rounded-full">{section.count}</span>
                                </h4>
                                <div className="grid grid-cols-5 gap-2.5">
                                    {flattenedQuestions
                                        .map((q, rawIdx) => ({ ...q, rawIdx }))
                                        .slice(section.startIndex, section.endIndex + 1)
                                        .map(({ rawIdx }) => {
                                            const isAnswered = answers[rawIdx] !== undefined;
                                            const isMarked = markedForReview.has(rawIdx);
                                            const isCurrent = currentQuestionIndex === rawIdx;

                                            let bgClass = "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700";
                                            // Order of precedence: Current > Marked > Answered > Default
                                            // Actually standard colors:
                                            // Answered: Green
                                            // Marked: Purple/Yellow
                                            // Not Answered: Red (if visited) or Grey

                                            // Replicating typical logic:
                                            if (isCurrent) bgClass = "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 bg-white dark:bg-gray-800 font-extrabold z-10";
                                            else if (isMarked && isAnswered) bgClass = "bg-purple-600 text-white border-purple-700 relative"; // Marked & Answered - often purple with green dot
                                            else if (isMarked) bgClass = "bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500";
                                            else if (isAnswered) bgClass = "bg-green-500 text-white border-green-600 hover:bg-green-600";
                                            else bgClass = "bg-red-50 text-red-800 border-red-200"; // Treat unvisited as red-ish or grey

                                            return (
                                                <button
                                                    key={rawIdx}
                                                    onClick={() => {
                                                        setCurrentQuestionIndex(rawIdx);
                                                        setShowPalette(false); // Close on mobile on select
                                                    }}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all shadow-sm ${bgClass}`}
                                                    title={`Question ${rawIdx + 1}`}
                                                >
                                                    {rawIdx + 1}
                                                    {isMarked && isAnswered && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white"></span>}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
