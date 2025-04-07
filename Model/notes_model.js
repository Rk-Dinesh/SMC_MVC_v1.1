const mongoose = require('mongoose');
const notesSchema = new mongoose.Schema({
    course: String,
    notes: String,
},{ timestamps: true });

const Notes = mongoose.model('Notes', notesSchema);
module.exports = Notes;
