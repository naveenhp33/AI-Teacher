// models/Chat.js
// Mongoose schema for storing chat history

const mongoose = require("mongoose");

/**
 * Message sub-schema for individual messages within a chat
 */
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "model"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Chat Session Schema
 * Groups messages into conversation sessions
 */
const chatSchema = new mongoose.Schema(
  {
    // Session title derived from first message
    title: {
      type: String,
      default: "New Chat",
      maxlength: 100,
    },

    // Array of messages in this chat session
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
