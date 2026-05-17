// services/imageService.js
// Image generation using Hugging Face Inference API
// Falls back to a placeholder if API is unavailable

const axios = require("axios");

/**
 * Generate an image using Hugging Face Inference API
 * Model: stabilityai/stable-diffusion-xl-base-1.0
 * @param {string} prompt - Text description of the image to generate
 * @returns {Object} { imageData (base64), generatedBy }
 */
const generateImage = async (prompt) => {
  const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

  // Primary model - FLUX.1-schnell produces high quality images and is currently supported
  const modelUrl =
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

  try {
    console.log(`🎨 Generating image for prompt: "${prompt}"`);

    const response = await axios.post(
      modelUrl,
      {
        inputs: prompt,
        parameters: {
          negative_prompt:
            "blurry, bad quality, distorted, ugly, watermark, text",
          num_inference_steps: 20,   // Balance speed vs quality
          guidance_scale: 7.5,       // How closely to follow prompt
          width: 512,
          height: 512,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        responseType: "arraybuffer",  // Receive binary image data
        timeout: 60000,               // 60 second timeout for generation
      }
    );

    // Convert binary response to base64 for storage and display
    const base64Image = Buffer.from(response.data).toString("base64");
    const imageData = `data:image/png;base64,${base64Image}`;

    console.log("✅ Image generated successfully via Hugging Face");
    return { imageData, generatedBy: "huggingface" };

  } catch (error) {
    console.error("❌ Hugging Face API Error:", error.message);

    // Check if model is loading (503) - common with free tier
    if (error.response?.status === 503) {
      throw new Error(
        "Image model is loading, please wait 20-30 seconds and try again"
      );
    }

    // Check for auth errors
    if (error.response?.status === 401) {
      throw new Error(
        "Invalid Hugging Face API token. Please check your .env file"
      );
    }

    // Fallback: Return a gradient placeholder image
    console.log("⚠️  Falling back to placeholder image");
    const placeholderData = generatePlaceholderImage(prompt);
    return { imageData: placeholderData, generatedBy: "placeholder" };
  }
};

/**
 * Generate a simple SVG placeholder when the AI service is unavailable
 * This ensures the app still works for demo purposes
 * @param {string} prompt - Used for display text
 * @returns {string} Data URL of SVG image
 */
const generatePlaceholderImage = (prompt) => {
  const shortPrompt =
    prompt.length > 40 ? prompt.substring(0, 40) + "..." : prompt;

  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#grad)" />
      <rect x="40" y="40" width="432" height="432" rx="12" 
            fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="256" y="220" font-family="Arial" font-size="60" 
            fill="white" text-anchor="middle" opacity="0.9">🎨</text>
      <text x="256" y="280" font-family="Arial" font-size="18" 
            fill="white" text-anchor="middle" opacity="0.9">AI Generated Image</text>
      <text x="256" y="320" font-family="Arial" font-size="13" 
            fill="rgba(255,255,255,0.7)" text-anchor="middle">${shortPrompt}</text>
      <text x="256" y="460" font-family="Arial" font-size="12" 
            fill="rgba(255,255,255,0.5)" text-anchor="middle">
        Add HF token for real images
      </text>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
};

module.exports = { generateImage };
