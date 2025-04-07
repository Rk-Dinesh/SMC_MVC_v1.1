const ExamService = require("../services/exam_service");

exports.generateAIExam = async (req, res) => {
  const { courseId, mainTopic, subtopicsString, lang } = req.body;

  try {
    const result = await ExamService.generateOrFetchExam(
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
