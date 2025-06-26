const Quiz = require("../Model/quizz_model");

exports.getAllQuizzes = async () => {
  try {
    const quizzes = await Quiz.find();
    return quizzes;
  } catch (error) {
    throw new Error("Error fetching quizzes");
  }
};

exports.getQuizById = async (courseId) => {
  try {
    const quiz = await Quiz.findOne({courseId});
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    return quiz;
  } catch (error) {
    throw new Error("Error fetching quiz by ID");
  }
};  

