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

    const [isTestStarted, setIsTestStarted] = useState(false);
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
    const [showLastQuestionMarkedModal, setShowLastQuestionMarkedModal] = useState(false);
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); // Start with first question visited

    // Derived state for current section
    const currentSectionId = useMemo(() => {
        if (!flattenedQuestions[currentQuestionIndex]) return null;
        return flattenedQuestions[currentQuestionIndex].sectionId;
    }, [currentQuestionIndex, flattenedQuestions]);

    // Calculate Status Counts
    const statusCounts = useMemo(() => {

        // Exact count based on palette logic:
        const ansCount = Object.keys(answers).length;
        const markCount = markedForReview.size;
        const visitedCount = visitedQuestions.size;
        const total = flattenedQuestions.length;

        // Not Visited: Total - Visited count
        const notVisited = total - visitedCount;

        // Not Answered: Visited but NO answer and NOT marked (if we treat Marked as separate cat).
        // OR adhering to typical palette:
        // Red (Not Answered) = Visited - Answered - Marked (exclusive? depends).
        // Usually:
        // Answered (Green)
        // Marked (Purple)
        // Not Answered (Red) -> Visited & !Answered & !Marked
        // Not Visited (Grey) -> !Visited

        // Let's count properly:
        // User requested override: "not answered count means from the total question how many questions user not answered"
        // This likely means Total - Answered (regardless of visited status)
        const notAnswered = total - ansCount;

        return {
            answered: ansCount,
            marked: markCount,
            notAnswered: notAnswered,
            notVisited: notVisited
        };
    }, [answers, markedForReview, flattenedQuestions, visitedQuestions]);

    const { answered: answeredCount, marked: markedCount, notAnswered: notAnsweredCount, notVisited: notVisitedCount } = statusCounts;

    // Track visits
    useEffect(() => {
        if (!visitedQuestions.has(currentQuestionIndex)) {
            setVisitedQuestions(prev => new Set(prev).add(currentQuestionIndex));
        }
    }, [currentQuestionIndex, visitedQuestions]);

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

    const executeSubmit = async () => {
        setShowSubmitConfirmation(false); // Close modal if open
        setLoading(true); // Show loading state on submit

        // Calculate Score locally for immediate feedback (and sending to DB)
        // Note: For now we assume simple 1-point per question or just counts.
        // We need 'correctAnswer' to calculate score. 
        // IF correct answers are not in 'flattenedQuestions', we rely on backend or just store '0' for now if validation is server-side.
        // CHECK: Do we have correct answers in `flattenedQuestions`? 
        // Based on previous contexts, likely yes or we need to rely on 'quiz' data.

        // Let's assume we can calculate it or just send 0 if we can't.
        // Actually, let's look at `flattenedQuestions`. 
        // If `correctAnswer` is present in question object, we proceed.

        let correctCount = 0;
        flattenedQuestions.forEach((q, idx) => {
            const selectedOptIdx = Number(answers[idx]);
            if (!isNaN(selectedOptIdx) && q.options) {
                // Find index of correct option
                const correctOptIdx = q.options.findIndex(opt => opt.isCorrect);
                if (selectedOptIdx === correctOptIdx) {
                    correctCount++;
                }
            }
        });

        const score = correctCount;
        const total = flattenedQuestions.length;
        const percentage = total > 0 ? (score / total) * 100 : 0;

        const attemptData = {
            userId: session?.user?.id, // Optional here, handled by server session
            quizId: testId,
            quizTitle: quiz.title,
            quizType: quiz.testType || 'Unknown',
            score,
            totalQuestions: total,
            percentage,
            responses: answers
        };

        try {
            // Save to DB
            const res = await fetch('/api/attempts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attemptData)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("Failed to save attempt:", res.status, res.statusText, errData);
                // alert(`Failed to save progress: ${res.status} ${errData.error || ''}`); // Optional: notify user visually
            }

            // Still save to local storage for Result page redundancy
            localStorage.setItem('lastAttempt', JSON.stringify({
                ...attemptData,
                questions: flattenedQuestions, // Needed for result review
                timestamp: new Date().toISOString()
            }));

            router.push(`/result/${Date.now()}`);
        } catch (error) {
            console.error("Error submitting test:", error);
            // Fallback: still go to result
            router.push(`/result/${Date.now()}`);
        }
    };

    const handleSubmitRequest = () => {
        setShowSubmitConfirmation(true);
    };

    // Updated: Explicitly jump to the start index of the selected section
    const handleSectionClick = (startIndex) => {
        setCurrentQuestionIndex(startIndex);
    };

    const handleNext = () => {
        if (currentQuestionIndex < flattenedQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (currentQuestionIndex === flattenedQuestions.length - 1) {
            // If it's the last question and user clicks "Finish" (which calls this or similar logic)
            // We can trigger submit request here if the button logic unifies Next/Finish.
            handleSubmitRequest();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
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
    if (!quiz) return <div className="p-10 text-center">Quiz not found. <Link href="/dashboard" className="text-blue-600">Go back</Link></div>;

    const currentQuestion = flattenedQuestions[currentQuestionIndex];

    // Recalculate distinct counts for UI
    const totalQuestions = flattenedQuestions.length;
    // statusCounts already provides these
    // const answeredCount = Object.keys(answers).length;
    // const markedCount = markedForReview.size;
    // const notAnsweredCount = totalQuestions - answeredCount;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
            {/* Top Header: Title, Timer, Submit */}
            <header className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm z-30 relative">
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden text-gray-600 p-1"
                        onClick={() => setShowPalette(!showPalette)}
                    >
                        {showPalette ? <FaTimes size={20} /> : <FaList size={20} />}
                    </button>
                    <div>
                        <h1 className="font-bold text-sm sm:text-lg line-clamp-1 text-gray-800">{quiz.title}</h1>
                        <span className="text-xs text-gray-500 hidden sm:inline">{quiz.associatedExamName || quiz.testType}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {isTestStarted ? (
                        <Timer durationMinutes={quiz.timerMinutes || 60} onTimeUp={executeSubmit} />
                    ) : (
                        <div className="font-mono text-xl font-bold px-4 py-2 rounded-lg text-gray-700 bg-gray-100">
                            {quiz.timerMinutes || 60}:00
                        </div>
                    )}
                    <button
                        onClick={handleSubmitRequest}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg text-xs sm:text-base font-bold transition-colors whitespace-nowrap"
                    >
                        Submit <span className="hidden sm:inline">Test</span>
                    </button>
                </div>
            </header>

            {/* Section Tabs Bar - Fixed below header */}
            {sections.length > 0 && (
                <div className="bg-white border-b border-gray-100 px-6 flex gap-1 overflow-x-auto shadow-sm z-10">
                    {sections.map((section) => {
                        const isActive = section.id === currentSectionId;
                        return (
                            <button
                                key={section.id}
                                onClick={() => handleSectionClick(section.startIndex)}
                                className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors uppercase tracking-wide ${isActive
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {section.name}
                                <span className="ml-2 text-xs opacity-70 bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">
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
                <main className="flex-1 p-6 overflow-y-auto flex flex-col bg-white">
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
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 py-4 border-t border-gray-100 gap-3 sm:gap-0">
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        disabled={currentQuestionIndex === 0}
                                        onClick={handlePrevious}
                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-xs sm:text-base flex items-center justify-center gap-1.5"
                                    >
                                        <FaArrowLeft className="hidden sm:block text-[10px] sm:text-xs" /> Previous
                                    </button>
                                    <button
                                        onClick={handleClearResponse}
                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium text-xs sm:text-base flex items-center justify-center truncate"
                                        title="Clear selected option"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                    <button
                                        className="flex-1 sm:flex-none px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 font-medium text-xs sm:text-base flex items-center justify-center whitespace-nowrap"
                                        onClick={() => {
                                            toggleMarkReview();
                                            if (currentQuestionIndex === flattenedQuestions.length - 1) {
                                                setShowLastQuestionMarkedModal(true);
                                            } else {
                                                handleNext();
                                            }
                                        }}
                                    >
                                        Mark <span className="hidden xs:inline">& Next</span>
                                    </button>
                                    <button
                                        className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm shadow-blue-200 text-xs sm:text-base flex items-center justify-center whitespace-nowrap"
                                        onClick={handleNext}
                                    >
                                        {currentQuestionIndex === flattenedQuestions.length - 1 ? 'Finish' : (
                                            <>Save <span className="hidden xs:inline">& Next</span> <FaArrowRight className="hidden sm:block ml-1.5 text-[10px] sm:text-xs" /></>
                                        )}
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
                    fixed inset-0 top-[60px] z-20 bg-white transform transition-transform duration-300 ease-in-out
                    lg:static lg:transform-none lg:w-80 lg:border-l lg:border-gray-200 lg:flex lg:flex-col
                    ${showPalette ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Question Palette</h3>
                        <button className="lg:hidden text-gray-500" onClick={() => setShowPalette(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        {/* Status Counts Summary */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-green-500 text-white text-xs font-bold">{answeredCount}</span>
                                <span className="text-xs text-gray-600">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-red-500 text-white text-xs font-bold">{notAnsweredCount}</span>
                                <span className="text-xs text-gray-600">Not Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-yellow-400 text-white text-xs font-bold">{markedCount}</span>
                                <span className="text-xs text-gray-600">Marked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">{notVisitedCount}</span>
                                <span className="text-xs text-gray-600">Not Visited</span>
                            </div>
                        </div>

                        <hr className="border-gray-200" />
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                        {sections.map(section => (
                            <div key={section.id} className="mb-8">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
                                    {section.name}
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{section.count}</span>
                                </h4>
                                <div className="grid grid-cols-5 gap-2.5">
                                    {flattenedQuestions
                                        .map((q, rawIdx) => ({ ...q, rawIdx }))
                                        .slice(section.startIndex, section.endIndex + 1)
                                        .map(({ rawIdx }) => {
                                            const isAnswered = answers[rawIdx] !== undefined;
                                            const isMarked = markedForReview.has(rawIdx);
                                            const isCurrent = currentQuestionIndex === rawIdx;

                                            let bgClass = "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200";
                                            // Order of precedence: Current > Marked > Answered > Default
                                            // Actually standard colors:
                                            // Answered: Green
                                            // Marked: Purple/Yellow
                                            // Not Answered: Red (if visited) or Grey

                                            // Order of precedence: Current > Marked > Answered > Default
                                            // Actually standard colors:
                                            // Answered: Green
                                            // Marked: Purple/Yellow
                                            // Not Answered: Red (Visited but no answer)
                                            // Not Visited: Grey (Not visited)

                                            // Check visited state
                                            const isVisited = visitedQuestions.has(rawIdx);

                                            if (isCurrent) bgClass = "ring-2 ring-blue-500 ring-offset-2 bg-white font-extrabold z-10";
                                            else if (isMarked && isAnswered) bgClass = "bg-purple-600 text-white border-purple-700 relative"; // Marked & Answered - often purple with green dot
                                            else if (isMarked) bgClass = "bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500";
                                            else if (isAnswered) bgClass = "bg-green-500 text-white border-green-600 hover:bg-green-600";
                                            else if (isVisited) bgClass = "bg-red-50 text-red-800 border-red-200"; // Visited & Not Answered = Red
                                            else bgClass = "bg-gray-100 text-gray-400 border-gray-200"; // Not Visited = Grey

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

            {/* Confirmation Overlay */}
            {!isTestStarted && !loading && quiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 text-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <FaClock size={32} />
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-gray-900">{quiz.title}</h2>
                        <p className="text-gray-500 mb-6 text-sm">{quiz.associatedExamName || quiz.testType}</p>

                        <div className="flex justify-center gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                                <span className="font-bold text-gray-900 text-lg">{flattenedQuestions.length}</span>
                                <span>Questions</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                                <span className="font-bold text-gray-900 text-lg">{quiz.timerMinutes || 60}</span>
                                <span>Minutes</span>
                            </div>
                        </div>

                        <div className="text-left bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800">
                            <p className="font-bold mb-1">Instructions:</p>
                            <ul className="list-disc pl-4 space-y-1 opacity-90">
                                <li>The timer will start immediately after you click Start.</li>
                                <li>You cannot pause the test once started.</li>
                                <li>Ensure you have a stable internet connection.</li>
                                <li>Do not refresh the page during the test.</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setIsTestStarted(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Test Now
                        </button>

                        <button
                            onClick={() => router.back()}
                            className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                        >
                            Cancel and Go Back
                        </button>
                    </div>
                </div>
            )}
            {/* Submit Confirmation Overlay */}
            {showSubmitConfirmation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 text-center relative animate-in fade-in zoom-in duration-200">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <FaClipboardList size={28} />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900">Finish Test?</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you want to submit your test? You won't be able to change your answers after this.
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-center mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div>
                                <div className="text-lg font-bold text-green-600">{answeredCount}</div>
                                <div className="text-xs text-gray-500">Answered</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-600">{notAnsweredCount}</div>
                                <div className="text-xs text-gray-500">Unanswered</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitConfirmation(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={executeSubmit}
                                className="flex-1 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-200 transition-all transform hover:scale-[1.02]"
                            >
                                Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Last Question Marked for Review Modal */}
            {showLastQuestionMarkedModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 text-center relative animate-in fade-in zoom-in duration-200">
                        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                            <FaClipboardList size={28} />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900">Marked for Review</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            You have reached the last question. This question has been marked for review.
                        </p>

                        <button
                            onClick={() => setShowLastQuestionMarkedModal(false)}
                            className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02]"
                        >
                            Okay, Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
