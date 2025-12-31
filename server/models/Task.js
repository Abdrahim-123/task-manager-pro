const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
    category: {
        type: String,
        default: 'Personal',
    },
    dueDate: {
        type: Date,
    },
    userId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Task', TaskSchema);