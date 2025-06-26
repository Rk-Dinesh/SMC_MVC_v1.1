const ExamService = require("../Service/exam_service");
const QuizService = require("../Service/quiz_service");

exports.generateAIQuiz = async (req, res) => {
  const { courseId, mainTopic, subtopicsString, lang } = req.body;

  try {
    const result = await ExamService.generateQuiz(
      courseId,
      mainTopic,
      subtopicsString,
      lang
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await ExamService.fetchAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getQuizById = async (req, res) => {
  const { courseId } = req.query;

  try {
    const quiz = await QuizService.getQuizById(courseId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};  