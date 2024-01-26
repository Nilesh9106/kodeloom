const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    labels: [{
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['TODO', 'In Progress', 'Completed'],
        default: 'TODO'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;