import React from "react";
import "./BackButton.css"; // 任意：スタイル分離したい場合

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent",
      border: "none",
      color: "#555",
      fontSize: "0.9rem",
      cursor: "pointer",
      padding: "0.5rem 1rem",
      marginTop: "1rem",
      alignSelf: "flex-end"
    }}>
      Back
    </button>
  );
}

export default BackButton;