import React from "react";

function BackButton({ onClick }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
      <button
        onClick={onClick}
        style={{
          background: "transparent",
          border: "none",
          color: "#555",
          fontSize: "0.9rem",
          cursor: "pointer",
          padding: "0.5rem 1rem",
        }}
      >
        Back
      </button>
    </div>
  );
}

export default BackButton;