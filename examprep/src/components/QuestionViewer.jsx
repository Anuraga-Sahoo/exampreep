import Image from 'next/image';

export default function QuestionViewer({
    question,
    questionIndex,
    totalQuestions,
    selectedOption,
    onSelectOption,
    onMarkReview,
    isMarked,
    sectionName
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        Question {questionIndex + 1}
                    </h2>
                    {sectionName && <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">{sectionName}</span>}
                </div>
                <div className="flex gap-2 text-sm text-gray-500">
                    <span>Marks: +{question.marks || 1}</span>
                    <span>Neg: -{question.negativeMarks || 0}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-6">
                <div className="mb-6">
                    <p className="text-lg font-medium text-gray-900 mb-4 leading-relaxed whitespace-pre-wrap">
                        {question.text}
                    </p>
                    {question.imageUrl && (
                        <div className="relative w-full max-w-lg h-60 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                                src={question.imageUrl}
                                alt="Question Image"
                                fill
                                className="object-contain bg-gray-50"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {question.options.map((option, idx) => (
                        <div
                            key={option.id || idx}
                            onClick={() => onSelectOption(idx)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${selectedOption === idx
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`mt-0.5 min-w-[24px] h-6 rounded-full border flex items-center justify-center text-xs font-bold ${selectedOption === idx
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-400 text-gray-500'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <div className="flex-1">
                                {option.text && <p className="text-gray-700">{option.text}</p>}
                                {option.imageUrl && (
                                    <div className="relative w-full max-w-[200px] h-32 mt-2 rounded border border-gray-200">
                                        <Image
                                            src={option.imageUrl}
                                            alt={`Option ${idx + 1}`}
                                            fill
                                            className="object-contain bg-white"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-right">
                <button
                    onClick={onMarkReview}
                    className={`text-sm px-3 py-1 rounded border transition-colors ${isMarked
                        ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                        : 'bg-transparent border-gray-300 text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    {isMarked ? '★ Marked' : '☆ Mark for Review'}
                </button>
            </div>
        </div>
    );
}
