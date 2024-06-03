const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    repo: {
        type: String,
        required: true
    },
    // add list of object which contain label name and random  color
    labels: [{
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            required: true
        }
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;