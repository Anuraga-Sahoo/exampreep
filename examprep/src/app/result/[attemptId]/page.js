"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ResultPage() {
    const params = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        // In a real app, we would fetch from API using params.attemptId
        // For MVP, we load from localStorage as per the TestPage logic
        const storedResult = localStorage.getItem('lastAttempt');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
        }
    }, []);

    if (!result) return <div className="p-10 text-center">Loading Results...</div>;

    const { quizTitle, answers, questions } = result;

    // Calculate Score
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q, idx) => {
        const selectedOptIdx = answers[idx];
        const isAttempted = selectedOptIdx !== undefined;

        maxScore += (q.marks || 1);

        if (isAttempted) {
            const selectedOption = q.options[selectedOptIdx];
            if (selectedOption && selectedOption.isCorrect) {
                correctCount++;
                totalScore += (q.marks || 1);
            } else {
                incorrectCount++;
                totalScore -= (q.negativeMarks || 0);
            }
        } else {
            unattemptedCount++;
        }
    });

    const accuracy = ((correctCount / (correctCount + incorrectCount)) * 100) || 0;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Test Result</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">{quizTitle}</p>
            </div>

            {/* Score Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{totalScore}/{maxScore}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Score</div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{correctCount}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Correct</div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                    <div className="text-3xl font-bold text-red-500 mb-1">{incorrectCount}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Wrong</div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{Math.round(accuracy)}%</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Accuracy</div>
                </div>
            </div>

            {/* Detailed Analysis */}
            <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
            <div className="space-y-6">
                {questions.map((q, idx) => {
                    const selectedOptIdx = answers[idx];
                    const isAttempted = selectedOptIdx !== undefined;
                    const correctOptIdx = q.options.findIndex(o => o.isCorrect);
                    const isCorrect = isAttempted && selectedOptIdx === correctOptIdx;

                    // Determine border color based on status
                    let statusColor = "border-gray-200 dark:border-gray-800";
                    if (!isAttempted) statusColor = "border-gray-200 dark:border-gray-700 opacity-70";
                    else if (isCorrect) statusColor = "border-green-200 bg-green-50/30 dark:border-green-900/50";
                    else statusColor = "border-red-200 bg-red-50/30 dark:border-red-900/50";

                    return (
                        <div key={idx} className={`bg-white dark:bg-gray-900 p-6 rounded-xl border ${statusColor}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded mb-2">
                                        Question {idx + 1} {q.sectionName ? `(${q.sectionName})` : ''}
                                    </span>
                                    <h3 className="text-lg font-medium">{q.text}</h3>
                                    {q.imageUrl && (
                                        <div className="relative w-full max-w-sm h-40 mt-3 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            <img src={q.imageUrl} alt="Question" className="w-full h-full object-contain bg-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : isAttempted ? 'text-red-500' : 'text-gray-400'}`}>
                                        {isCorrect ? 'Correct' : isAttempted ? 'Incorrect' : 'Unattempted'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                {q.options.map((opt, optIdx) => {
                                    const isSelected = selectedOptIdx === optIdx;
                                    const isThisCorrect = opt.isCorrect;

                                    let optClass = "border-gray-200 dark:border-gray-700 bg-transparent";
                                    if (isSelected && isThisCorrect) optClass = "border-green-500 bg-green-50 dark:bg-green-900/20";
                                    else if (isSelected && !isThisCorrect) optClass = "border-red-500 bg-red-50 dark:bg-red-900/20";
                                    else if (isThisCorrect) optClass = "border-green-500 bg-green-50 dark:bg-green-900/10 border-dashed"; // Show correct answer if missed

                                    return (
                                        <div key={optIdx} className={`p-3 rounded border flex items-center gap-3 ${optClass}`}>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${isThisCorrect ? 'bg-green-500 text-white border-green-600' :
                                                    (isSelected ? 'bg-red-500 text-white border-red-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500')
                                                }`}>
                                                {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            <div>
                                                {opt.text && <span>{opt.text}</span>}
                                                {opt.imageUrl && <img src={opt.imageUrl} alt="Option" className="h-16 mt-1 object-contain" />}
                                                {isSelected && <span className="ml-2 text-xs font-bold">(Your Answer)</span>}
                                                {isThisCorrect && !isSelected && <span className="ml-2 text-xs text-green-600 font-bold">(Correct Answer)</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {q.explanation && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-200 rounded">
                                    <strong>Explanation:</strong> {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 text-center">
                <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
