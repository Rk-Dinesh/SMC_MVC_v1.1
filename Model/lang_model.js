const mongoose = require('mongoose');
const languageSchema = new mongoose.Schema({
    course: String,
    lang: String,
}, { timestamps: true });
const Language = mongoose.model('Language', languageSchema);
module.exports = Language;