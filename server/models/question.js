const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    options: [{ text: String, isCorrect: Boolean }]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);