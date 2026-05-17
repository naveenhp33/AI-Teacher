// services/geminiService.js
// Google Gemini AI integration for chat functionality

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a chat response using Google Gemini
 * @param {Array} messages - Array of {role, content} message objects
 * @returns {string} AI response text
 */
const generateChatResponse = async (messages) => {
  try {
    // Use gemini-1.5-flash model - fast and capable
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert our message format to Gemini's expected format
    // Gemini uses 'user' and 'model' roles (not 'assistant')
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start a chat session with conversation history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,      // Balance creativity and accuracy
        topP: 0.8,
        topK: 40,
      },
    });

    // Send the latest user message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error(`AI service error: ${error.message}`);
  }
};

module.exports = { generateChatResponse };
