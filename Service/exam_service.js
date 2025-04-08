const Exam = require("../Model/exam_model");
require("dotenv").config();
const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const Language = require("../Model/lang_model");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.generateOrFetchExam = async (
  courseId,
  mainTopic,
  subtopicsString,
  lang
) => {
  try {
    const existingExam = await Exam.findOne({ course: courseId });

    if (existingExam) {
      return { success: true, message: existingExam.exam };
    }

    const prompt = `Strictly in ${lang},
        generate a strictly 10 question MCQ quiz on title ${mainTopic} based on each topics :- ${subtopicsString}, At least One question per topic. Add options A, B, C, D and only one correct answer. Give your response Strictly in JSON format like this :-
        {
          "${mainTopic}": [
            {
              "topic": "topic title",
              "question": "",
              "options": [
               "",
               "",
               "",
               ""
              ],
              "answer": "correct option like A, B, C, D"
            },
            {
              "topic": "topic title",
              "question": "",
              "options": [
               "",
               "",
               "",
               ""
              ],
              "answer": "correct option like A, B, C, D"
            },
            {
              "topic": "topic title",
              "question": "",
              "options": [
               "",
               "",
               "",
               ""
              ],
              "answer": "correct option like A, B, C, D"
            }
          ]
        }
        `;

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const txt = response.text();
    let output = txt.slice(7, txt.length - 4);

    const newExam = new Exam({
      course: courseId,
      exam: output,
      marks: "0",
      passed: false,
    });
    await newExam.save();

    return { success: true, message: output };
  } catch (error) {
    console.error(error);
    throw new Error("Error generating or fetching exam");
  }
};

exports.updateExamResult = async (courseId, marksString) => {
  try {
    const result = await ExamSchema.findOneAndUpdate(
      { course: courseId },
      [{ $set: { marks: marksString, passed: true } }],
      { new: true }
    );

    return !!result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.fetchExamResult = async (courseId) => {
  try {
    const existingNotes = await Exam.findOne({ course: courseId });
    const lang = await Language.findOne({ course: courseId });

    if (existingNotes) {
      return {
        success: true,
        message: existingNotes.passed,
        lang: lang ? lang.lang : "English",
      };
    } else {
      return {
        success: false,
        message: false,
        lang: lang ? lang.lang : "English",
      };
    }
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the controller
  }
};
