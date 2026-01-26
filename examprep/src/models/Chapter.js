import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
