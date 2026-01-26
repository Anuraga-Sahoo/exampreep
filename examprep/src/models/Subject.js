import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    associatedChapterIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }],
    // Add other fields from your DB if needed, e.g., icon, createdAt
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Force recompilation in dev mode to pick up schema changes
if (mongoose.models.Subject) {
    delete mongoose.models.Subject;
}

export default mongoose.model('Subject', SubjectSchema);
