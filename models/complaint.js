const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    wardNumber: {
        type: String,
        required: true
    },
    raisedBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Processing', 'Resolved'],
        default: 'Pending'
    },
    assignedTo: {
        type: String,
        default: null
    },
    images: {
        type: [String], // Store Base64 encoded strings
        default: []
    },
    location: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
