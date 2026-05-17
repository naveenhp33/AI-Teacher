// server.js
// Main Express server entry point for MERN AI App

require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import route files
const chatRoutes = require("./routes/chatRoutes");
const imageRoutes = require("./routes/imageRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Enable CORS for frontend requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON request bodies
// Limit set high to handle base64 image data in responses
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "MERN AI App Server is running 🚀",
    version: "1.0.0",
    endpoints: {
      chat: "/api/chat",
      generateImage: "/api/generate-image",
      images: "/api/images",
    },
  });
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api", imageRoutes); // handles /api/generate-image and /api/images

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  MongoDB: Connecting...`);
});
