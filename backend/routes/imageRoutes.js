// routes/imageRoutes.js
// Express router for image generation endpoints

const express = require("express");
const router = express.Router();
const {
  createImage,
  getImages,
  deleteImage,
} = require("../controllers/imageController");

// POST /api/generate-image - Generate new image from prompt
router.post("/generate-image", createImage);

// GET /api/images - Get gallery of all generated images
router.get("/images", getImages);

// DELETE /api/images/:id - Delete an image
router.delete("/images/:id", deleteImage);

module.exports = router;
