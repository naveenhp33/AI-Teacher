// models/Image.js
// Mongoose schema for storing generated image history

const mongoose = require("mongoose");

/**
 * Image Schema
 * Stores metadata about each AI-generated image
 */
const imageSchema = new mongoose.Schema(
  {
    // The prompt used to generate the image
    prompt: {
      type: String,
      required: [true, "Prompt is required"],
      trim: true,
      maxlength: [1000, "Prompt cannot exceed 1000 characters"],
    },

    // Base64 encoded image data OR URL from image service
    imageData: {
      type: String,
      required: [true, "Image data is required"],
    },

    // Which service was used to generate the image
    generatedBy: {
      type: String,
      enum: ["huggingface", "placeholder"],
      default: "huggingface",
    },

    // Image dimensions for display purposes
    width: {
      type: Number,
      default: 512,
    },
    height: {
      type: Number,
      default: 512,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Index on createdAt for fast sorting of recent images
imageSchema.index({ createdAt: -1 });

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
