import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Can facilitate manual population if needed, usually just an ID ref
        required: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    quizType: {
        type: String,
        enum: ['MockTest', 'PreviousYearPaper', 'PracticeQuiz', 'Unknown', 'Mock', 'Previous Year'],
        default: 'Unknown'
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    responses: {
        type: Map,
        of: String // or Number, depending on how we store option index
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically delete 24 hours after this timestamp
    }
});

// Force recompilation to pick up enum changes
if (mongoose.models.Attempt) {
    delete mongoose.models.Attempt;
}

export default mongoose.model('Attempt', AttemptSchema);
