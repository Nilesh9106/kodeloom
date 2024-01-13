const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);