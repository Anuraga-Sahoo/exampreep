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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
