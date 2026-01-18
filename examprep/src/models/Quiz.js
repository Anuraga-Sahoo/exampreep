import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    id: String,
    text: String,
    imageUrl: String,
    isCorrect: {
        type: Boolean,
        default: false,
    },
    publicId: String, // For Cloudinary or similar
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
    publicId: String,
    aiTags: [String],
    options: [OptionSchema],
});

const SectionSchema = new mongoose.Schema({
    id: String,
    name: String,
    questions: [QuestionSchema],
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    testType: {
        type: String,
        default: "Mock",
    },
    timerMinutes: {
        type: Number,
        default: 60,
    },
    associatedExamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam', // Assuming this links back to the Exam model
    },
    associatedExamName: String,
    description: String,
    sections: [SectionSchema],
    status: {
        type: String,
        default: "Draft",
    },
    premium: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
