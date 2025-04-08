const ExamService = require("../Service/exam_service");
const { transporter } = require("../Service/transporter_service");

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

exports.updateResult = async (req, res) => {
  const { courseId, marksString } = req.body;

  try {
    const success = await ExamService.updateExamResult(courseId, marksString);

    if (success) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.getMyResult = async (req, res) => {
  const { courseId } = req.body;

  try {
    const result = await ExamService.fetchExamResult(courseId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.sendExamMail = async (req, res) => {
  const { html, email, subjects } = req.body;
  const options = {
      from: process.env.EMAIL, 
      to: email,               
      subject:"" + subjects,       
      html: html               
  };

  try {
      await transporter.sendMail(options);
      res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

