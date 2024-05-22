const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({ 
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    role : {
        type: String,
        enum: ["member", "manager"],
        default: "member"
    },
}, { timestamps: true });

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;