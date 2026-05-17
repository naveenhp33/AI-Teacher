// components/Spinner.jsx
// Reusable loading spinner with optional message

const Spinner = ({ size = "md", message = "" }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 48,
  };

  const px = sizes[size] || sizes.md;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          width: px,
          height: px,
          border: `${size === "lg" ? 3 : 2}px solid var(--bg-tertiary)`,
          borderTopColor: "var(--accent-blue)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
          flexShrink: 0,
        }}
      />
      {message && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
