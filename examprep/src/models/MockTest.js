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

const MockTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    testType: {
        type: String,
        default: "Mock",
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
        ref: 'Exam',
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
}, { collection: 'mockTests' });

// Force recompilation
if (mongoose.models.MockTest) {
    delete mongoose.models.MockTest;
}

export default mongoose.model('MockTest', MockTestSchema);
