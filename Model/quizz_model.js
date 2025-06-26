const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const QuizSchema = new mongoose.Schema({
    courseId: { type: String},
    mainTopic: {
        type: String,
        required: true
    },
    questionAnswers: [questionSchema]
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
