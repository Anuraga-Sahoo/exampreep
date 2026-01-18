import { MOCK_TESTS } from "@/lib/data";
import Link from 'next/link';

export default function MockTestsPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <Link href="/exams" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">← Back to Categories</Link>
                <h1 className="text-3xl font-bold">Mock Tests</h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {MOCK_TESTS.map(test => (
                    <div key={test.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mb-2 inline-block">
                                {test.category}
                            </span>
                            {test.premium && (
                                <span className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                                    🔒 Premium
                                </span>
                            )}
                            <h3 className="text-xl font-bold">{test.title}</h3>
                            <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                <span>{test.questionsCount} Questions</span>
                                <span>•</span>
                                <span>{test.durationMinutes} Mins</span>
                                <span>•</span>
                                <span className={test.difficulty === "Hard" ? "text-red-500" : "text-yellow-600"}>{test.difficulty}</span>
                            </div>
                        </div>
                        <Link href={`/test/${test.id}`} className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity text-center min-w-[120px]">
                            Start Test
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
