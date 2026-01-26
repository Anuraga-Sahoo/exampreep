import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    id: String,
    text: String,
    imageUrl: String,
    isCorrect: {
        type: Boolean,
        default: false,
    },
    aiTags: [String],
});

const QuestionSchema = new mongoose.Schema({
    id: String,
    text: String,
    imageUrl: String,
    marks: {
        type: Number,
        default: 1,
    },
    negativeMarks: {
        type: Number,
        default: 0,
    },
    explanation: String,
    aiTags: [String],
    options: [OptionSchema],
});

const SectionSchema = new mongoose.Schema({
    id: String,
    name: String,
    questions: [QuestionSchema],
});

const PreviousYearPaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    testType: {
        type: String,
        default: "Previous Year",
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    associatedExamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam', // Links back to Exam
    },
    associatedExamName: String,
    tags: [String],
    timerMinutes: {
        type: Number,
        default: 60,
    },
    sections: [SectionSchema],
    status: {
        type: String,
        default: "Draft",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'previousYearTests' }); // Explicitly force collection name if needed, assuming likely camelCase or plural

// Force recompilation
if (mongoose.models.PreviousYearPaper) {
    delete mongoose.models.PreviousYearPaper;
}

export default mongoose.model('PreviousYearPaper', PreviousYearPaperSchema);
