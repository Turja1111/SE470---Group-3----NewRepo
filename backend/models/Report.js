import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['review', 'profile-report', 'chat-report'],
        required: true
    },
    details: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'rejected'],
        default: 'pending'
    }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
