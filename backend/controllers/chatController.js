// controllers/chatController.js
// Handles all chat-related API logic

const { generateChatResponse } = require("../services/geminiService");
const Chat = require("../models/Chat");

/**
 * POST /api/chat
 * Send a message and get AI response
 * Body: { message: string, sessionId?: string }
 */
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId, history = [] } = req.body;

    // Validate input
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Build message array for Gemini (include conversation history)
    const messages = [
      ...history,
      { role: "user", content: message.trim() },
    ];

    // Generate AI response using Gemini
    const aiResponse = await generateChatResponse(messages);

    // Save or update chat session in MongoDB
    let chat;
    if (sessionId) {
      // Add to existing session
      chat = await Chat.findByIdAndUpdate(
        sessionId,
        {
          $push: {
            messages: [
              { role: "user", content: message.trim() },
              { role: "model", content: aiResponse },
            ],
          },
        },
        { new: true }
      );
    } else {
      // Create new chat session
      // Use first 60 chars of message as title
      const title =
        message.length > 60 ? message.substring(0, 60) + "..." : message;

      chat = await Chat.create({
        title,
        messages: [
          { role: "user", content: message.trim() },
          { role: "model", content: aiResponse },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        sessionId: chat._id,
        title: chat.title,
      },
    });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate response",
    });
  }
};

/**
 * GET /api/chat/history
 * Retrieve all chat sessions (for sidebar)
 */
const getChatHistory = async (req, res) => {
  try {
    // Get all chats, sorted by most recent, with limited fields
    const chats = await Chat.find({})
      .select("title createdAt messages")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error("Get History Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve chat history",
    });
  }
};

/**
 * GET /api/chat/:id
 * Get a specific chat session by ID
 */
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.error("Get Chat Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve chat",
    });
  }
};

module.exports = { sendMessage, getChatHistory, getChatById };
