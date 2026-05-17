// routes/chatRoutes.js
// Express router for all chat endpoints

const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  getChatById,
} = require("../controllers/chatController");

// POST /api/chat - Send message and get AI response
router.post("/", sendMessage);

// GET /api/chat/history - Get all chat sessions
router.get("/history", getChatHistory);

// GET /api/chat/:id - Get specific chat session
router.get("/:id", getChatById);

module.exports = router;
