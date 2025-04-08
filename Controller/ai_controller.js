require('dotenv').config();
const AIService = require("../Service/ai_service");
const gis = require("g-i-s");
const youtubesearchapi = require("youtube-search-api");
const { YoutubeTranscript } = require("youtube-transcript");
const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const showdown = require("showdown");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.generatePrompt = async (req, res) => {
    const receivedData = req.body;

    const promptString = receivedData.prompt;
  
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
      model: "gemini-pro",
      safetySettings,
    });
  
    const prompt = promptString;
    
  
    await model
      .generateContent(prompt)
      .then((result) => {
        const response = result.response;
        const generatedText = response.text();
        res.status(200).json({ generatedText });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
};


exports.generateTheory = async (req, res) => {

    const receivedData = req.body;
  
    const promptString = receivedData.prompt;
  
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
      model: "gemini-pro",
      safetySettings,
    });
  
    const prompt = promptString;
  
    await model
      .generateContent(prompt)
      .then((result) => {
        const response = result.response;
        const txt = response.text();
        const converter = new showdown.Converter();
        const markdownText = txt;
        const text = converter.makeHtml(markdownText);
        res.status(200).json({ text });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
};

exports.fetchImage = async (req, res, next) => {
  const receivedData = req.body;
  const promptString = receivedData.prompt;
  gis(promptString, logResults);
  function logResults(error, results) {
    if (error) {
      //ERROR
    } else {
      res.status(200).json({ url: results[0].url });
    }
  }
};

exports.fetchYouTubeVideo = async (req, res, next) => {
  try {
    const receivedData = req.body;
    const promptString = receivedData.prompt;
    const video = await youtubesearchapi.GetListByKeyword(
      promptString,
      [false],
      [1],
      [{ type: "video" }]
    );
    const videoId = await video.items[0].id;
    res.status(200).json({ url: videoId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.fetchTranscript = async (req, res, next) => {
  const receivedData = req.body;
  const promptString = receivedData.prompt;
  YoutubeTranscript.fetchTranscript(promptString)
    .then((video) => {
      res.status(200).json({ url: video });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
};

exports.generateChatResponse = async (req, res, next) => {
    try {
      const { prompt } = req.body;

      const htmlContent = await AIService.generateChatResponse(prompt);
  
      res.status(200).json({ text: htmlContent });
    } catch (error) {
      next(error);
    }
  };