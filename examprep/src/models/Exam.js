import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: String,
    description: {
        type: String,
        default: "",
    },
    image: {
        type: String, // URL for cover image
        default: "",
    },
    category: {
        type: String, // e.g., "NEET", "Government"
        default: "General",
    },
    quizIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    previousYearExamsIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PreviousYearPaper'
    }],
    mockExamIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MockTest'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Force recompilation in dev mode to pick up schema changes
if (mongoose.models.Exam) {
    delete mongoose.models.Exam;
}

export default mongoose.model('Exam', ExamSchema);
