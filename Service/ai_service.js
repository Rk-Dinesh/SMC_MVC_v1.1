require('dotenv').config();
const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const showdown = require("showdown");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  exports.generateChatResponse = async (promptString) => {
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
  
    try {
      const result = await model.generateContent(promptString);
      const response = result.response;
      const generatedText = response.text();
  
      const converter = new showdown.Converter();
      const htmlContent = converter.makeHtml(generatedText);
  
      return htmlContent;
    } catch (error) {
      throw new Error("Failed to generate chat response");
    }
  };