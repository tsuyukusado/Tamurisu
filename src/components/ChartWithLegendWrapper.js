import React from "react";

function ChartWithLegendWrapper({ chart, centerLabel, legend }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          aspectRatio: "1", // 正円に
        }}
      >
        {chart}
        {centerLabel && centerLabel}
      </div>
      {legend && <div style={{ marginTop: "1rem", textAlign: "center" }}>{legend}</div>}
    </div>
  );
}

export default ChartWithLegendWrapper;