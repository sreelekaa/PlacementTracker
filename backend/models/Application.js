const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Interviewing', 'Offered', 'Rejected'],
        default: 'Applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    link: {
        type: String
    },
    notes: {
        type: String
    },
    reminderDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
