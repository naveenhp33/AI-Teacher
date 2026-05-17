// pages/GalleryPage.jsx
// Displays all generated images in a grid gallery

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImages, deleteImage } from "../services/api";
import "../styles/Gallery.css";

// Skeleton cards shown while loading
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-text" />
    <div className="skeleton-text short" />
  </div>
);

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // For lightbox
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadImages(1);
  }, []);

  const loadImages = async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const data = await getImages(page, 12);
      setImages(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError("Failed to load gallery. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (image, e) => {
    e?.stopPropagation(); // Don't open lightbox when clicking download
    const link = document.createElement("a");
    link.href = image.imageData;
    const filename = `ai-${image.prompt
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .slice(0, 30)}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (imageId, e) => {
    e?.stopPropagation();
    if (!confirm("Delete this image from your gallery?")) return;

    try {
      setDeleting(imageId);
      await deleteImage(imageId);
      // Remove from local state
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      if (selectedImage?._id === imageId) setSelectedImage(null);
    } catch (err) {
      alert("Failed to delete image: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="gallery-page__header">
        <h1>🖼️ Image Gallery</h1>
        <span className="gallery-page__count">
          {pagination.total} image{pagination.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            color: "#fca5a5",
            marginBottom: "1.5rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton grid */}
      {loading && (
        <div className="gallery-skeleton">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && images.length === 0 && !error && (
        <div className="gallery-empty">
          <div className="gallery-empty__icon">🎨</div>
          <h2>No images yet</h2>
          <p>Generate your first AI image to see it appear here</p>
          <button
            className="gallery-empty__btn"
            onClick={() => navigate("/generate")}
          >
            ✦ Generate Image
          </button>
        </div>
      )}

      {/* Image grid */}
      {!loading && images.length > 0 && (
        <>
          <div className="gallery-grid">
            {images.map((image) => (
              <div
                key={image._id}
                className="gallery-card"
                onClick={() => setSelectedImage(image)}
              >
                <div className="gallery-card__image-wrapper">
                  <img
                    src={image.imageData}
                    alt={image.prompt}
                    loading="lazy"
                  />
                  {/* Overlay with action buttons */}
                  <div className="gallery-card__overlay">
                    <button
                      className="gallery-overlay-btn gallery-overlay-btn--download"
                      onClick={(e) => handleDownload(image, e)}
                      title="Download"
                    >
                      ⬇
                    </button>
                    <button
                      className="gallery-overlay-btn gallery-overlay-btn--delete"
                      onClick={(e) => handleDelete(image._id, e)}
                      disabled={deleting === image._id}
                      title="Delete"
                    >
                      {deleting === image._id ? "..." : "🗑"}
                    </button>
                  </div>
                </div>

                {/* Card info */}
                <div className="gallery-card__footer">
                  <p className="gallery-card__prompt">{image.prompt}</p>
                  <div className="gallery-card__meta">
                    <span className="gallery-card__date">
                      {formatDate(image.createdAt)}
                    </span>
                    <span
                      className={`gallery-card__badge ${
                        image.generatedBy === "huggingface"
                          ? "gallery-card__badge--hf"
                          : "gallery-card__badge--placeholder"
                      }`}
                    >
                      {image.generatedBy === "huggingface" ? "🤗 HF" : "Demo"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="gallery-pagination">
              <button
                className="pagination-btn"
                onClick={() => loadImages(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ← Prev
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${
                      pagination.page === page ? "active" : ""
                    }`}
                    onClick={() => loadImages(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="pagination-btn"
                onClick={() => loadImages(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox modal for full-size view */}
      {selectedImage && (
        <div
          className="lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageData}
              alt={selectedImage.prompt}
              className="lightbox__image"
            />
            <div className="lightbox__footer">
              <p className="lightbox__prompt">📝 {selectedImage.prompt}</p>
              <button
                className="download-btn"
                onClick={() => handleDownload(selectedImage)}
              >
                ⬇ Download
              </button>
            </div>
          </div>
          <button
            className="lightbox__close"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
