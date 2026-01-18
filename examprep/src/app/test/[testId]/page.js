'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Timer from '@/components/Timer';
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

    // Derived state for current section
    const currentSectionId = useMemo(() => {
        if (!flattenedQuestions[currentQuestionIndex]) return null;
        return flattenedQuestions[currentQuestionIndex].sectionId;
    }, [currentQuestionIndex, flattenedQuestions]);

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

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-black">
            {/* Top Header: Title, Timer, Submit */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center shadow-sm z-20">
                <div>
                    <h1 className="font-bold text-lg">{quiz.title}</h1>
                    <span className="text-sm text-gray-500">{quiz.associatedExamName || quiz.testType}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Timer durationMinutes={quiz.timerMinutes || 60} onTimeUp={handleSubmit} />
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        Submit Test
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
                            <div className="flex justify-between items-center mt-6 py-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    disabled={currentQuestionIndex === 0}
                                    onClick={handlePrevious}
                                    className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        className="px-4 py-2.5 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 font-medium"
                                        onClick={() => {
                                            toggleMarkReview();
                                            handleNext();
                                        }}
                                    >
                                        Mark for Review & Next
                                    </button>
                                    <button
                                        className="px-8 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm shadow-blue-200 dark:shadow-none"
                                        onClick={handleNext}
                                    >
                                        {currentQuestionIndex === flattenedQuestions.length - 1 ? 'Finish Test' : 'Save & Next'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-10">No questions available for this test.</div>
                    )}
                </main>

                {/* Question Palette (Sideboard) */}
                <aside className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">Question Palette</h3>
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500"></span> Answered</div>
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Marked</div>
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"></span> Not Visited</div>
                            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-white border-2 border-blue-500"></span> Current</div>
                        </div>
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
                                            if (isCurrent) bgClass = "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 bg-white dark:bg-gray-800 font-extrabold z-10";
                                            else if (isMarked) bgClass = "bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500";
                                            else if (isAnswered) bgClass = "bg-green-500 text-white border-green-600 hover:bg-green-600";

                                            return (
                                                <button
                                                    key={rawIdx}
                                                    onClick={() => setCurrentQuestionIndex(rawIdx)}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all shadow-sm ${bgClass}`}
                                                    title={`Question ${rawIdx + 1}`}
                                                >
                                                    {rawIdx + 1}
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
