import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    associatedSubjectIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);
