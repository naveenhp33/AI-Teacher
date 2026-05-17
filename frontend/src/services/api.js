// services/api.js
// Centralized Axios instance for all API calls

import axios from "axios";

// Base API URL - uses Vite proxy in dev, env variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Configured Axios instance
 * All API calls should use this instead of raw axios
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minute timeout (image generation can be slow)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract meaningful error message
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);

// ─── Chat API Functions ───────────────────────────────────────────────────────

/**
 * Send a chat message and receive AI response
 * @param {string} message - User's message
 * @param {string|null} sessionId - Existing session ID (null for new chat)
 * @param {Array} history - Previous messages for context
 */
export const sendChatMessage = async (message, sessionId = null, history = []) => {
  const response = await api.post("/api/chat", { message, sessionId, history });
  return response.data;
};

/**
 * Get all chat sessions for sidebar history
 */
export const getChatHistory = async () => {
  const response = await api.get("/api/chat/history");
  return response.data;
};

/**
 * Load a specific chat session by ID
 */
export const getChatById = async (id) => {
  const response = await api.get(`/api/chat/${id}`);
  return response.data;
};

// ─── Image API Functions ──────────────────────────────────────────────────────

/**
 * Generate an AI image from a text prompt
 * @param {string} prompt - Image description
 */
export const generateImage = async (prompt) => {
  const response = await api.post("/api/generate-image", { prompt });
  return response.data;
};

/**
 * Get gallery of all generated images
 * @param {number} page - Page number for pagination
 * @param {number} limit - Images per page
 */
export const getImages = async (page = 1, limit = 12) => {
  const response = await api.get(`/api/images?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Delete an image from the gallery
 */
export const deleteImage = async (id) => {
  const response = await api.delete(`/api/images/${id}`);
  return response.data;
};

export default api;
