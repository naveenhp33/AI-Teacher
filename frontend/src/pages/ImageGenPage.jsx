// pages/ImageGenPage.jsx
// AI Image generation interface

import { useState } from "react";
import { generateImage } from "../services/api";
import "../styles/ImageGen.css";

// Example prompts to help users get started
const EXAMPLE_PROMPTS = [
  "A futuristic city at sunset, neon lights, cyberpunk style",
  "A serene Japanese garden with cherry blossoms",
  "An astronaut riding a horse on Mars, photorealistic",
  "A cozy cabin in the snowy mountains at night",
  "Abstract digital art with vibrant colors",
];

const ImageGenPage = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setGeneratedImage(null);

    try {
      const data = await generateImage(prompt.trim());
      setGeneratedImage(data.data);
    } catch (err) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Download the generated image to user's device
  const handleDownload = () => {
    if (!generatedImage) return;

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = generatedImage.imageData;

    // Sanitize prompt for filename
    const filename = `ai-image-${generatedImage.prompt
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .slice(0, 30)}.png`;

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="imagegen-page">
      <div className="imagegen-page__header">
        <h1>🎨 Generate AI Image</h1>
        <p>Describe your vision and watch AI bring it to life</p>
      </div>

      {/* Prompt input form */}
      <div className="imagegen-form-card">
        <h2>Image Prompt</h2>

        <div className="imagegen-input-wrapper">
          <textarea
            className="imagegen-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to generate... e.g. 'A majestic dragon flying over medieval castle at dawn, fantasy art style'"
            disabled={loading}
          />
          <button
            className="imagegen-generate-btn"
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Generating...
              </>
            ) : (
              <>✦ Generate</>
            )}
          </button>
        </div>

        {/* Example prompt suggestions */}
        <div className="imagegen-examples">
          <p className="imagegen-examples__label">Try an example:</p>
          <div className="imagegen-examples__chips">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex}
                className="example-chip"
                onClick={() => handleExampleClick(ex)}
                disabled={loading}
              >
                {ex.length > 45 ? ex.slice(0, 45) + "..." : ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="imagegen-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="imagegen-loading">
          <div className="imagegen-loading__spinner" />
          <p>Generating your image...</p>
          <p className="imagegen-loading__note">
            This may take 20-60 seconds. The model may need to warm up first.
          </p>
        </div>
      )}

      {/* Generated image result */}
      {generatedImage && !loading && (
        <div className="imagegen-result">
          <h2>Generated Image</h2>
          <div className="imagegen-result-card">
            <img
              src={generatedImage.imageData}
              alt={generatedImage.prompt}
              loading="lazy"
            />
            <div className="imagegen-result-card__footer">
              <p className="imagegen-result-card__prompt">
                📝 {generatedImage.prompt}
              </p>
              <button className="download-btn" onClick={handleDownload}>
                ⬇ Download
              </button>
            </div>
          </div>

          {/* Generation info */}
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            Generated by:{" "}
            {generatedImage.generatedBy === "huggingface"
              ? "🤗 Hugging Face SDXL"
              : "⚡ Placeholder (add HF token for real images)"}
            {" "}· Saved to Gallery ✓
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGenPage;
