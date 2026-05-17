// controllers/imageController.js
// Handles image generation and retrieval logic

const { generateImage } = require("../services/imageService");
const Image = require("../models/Image");

/**
 * POST /api/generate-image
 * Generate an AI image from a text prompt
 * Body: { prompt: string }
 */
const createImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    if (prompt.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "Prompt must be at least 3 characters",
      });
    }

    console.log(`📸 Image generation request: "${prompt.trim()}"`);

    // Call the image generation service
    const { imageData, generatedBy } = await generateImage(prompt.trim());

    // Save to MongoDB for gallery history
    const savedImage = await Image.create({
      prompt: prompt.trim(),
      imageData,
      generatedBy,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: savedImage._id,
        prompt: savedImage.prompt,
        imageData: savedImage.imageData,
        generatedBy: savedImage.generatedBy,
        createdAt: savedImage.createdAt,
      },
    });
  } catch (error) {
    console.error("Image Controller Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate image",
    });
  }
};

/**
 * GET /api/images
 * Retrieve all generated images for the gallery
 * Supports pagination via ?page=1&limit=12
 */
const getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Get images sorted by newest first
    const images = await Image.find({})
      .select("prompt imageData generatedBy createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Image.countDocuments();

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Images Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve images",
    });
  }
};

/**
 * DELETE /api/images/:id
 * Remove an image from the gallery
 */
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete Image Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to delete image",
    });
  }
};

module.exports = { createImage, getImages, deleteImage };
