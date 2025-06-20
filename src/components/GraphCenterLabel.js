import React from "react";

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function GraphCenterLabel({ hasData, totalSeconds, isDetail = false }) {
  return (
    <div
      style={{
        position: "absolute",
        top: isDetail ? "52%" : "47%", // ← 詳細なら下にずらす
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "1rem",
        color: "#333",
        textAlign: "center",
        pointerEvents: "none"
      }}
    >
      {hasData ? formatTime(totalSeconds) : "No Data"}
    </div>
  );
}

export default GraphCenterLabel;