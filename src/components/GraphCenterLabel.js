import React from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/en"; // 英語ロケール
dayjs.extend(localeData);
dayjs.locale("en");

const now = dayjs(); // 必ず locale 適用の「後」に呼ぶこと！

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatRangeLabel(range, now) {
  switch (range) {
    case "day":
      return now.format("MM/DD");
    case "week":
      const startOfWeek = now.startOf("isoWeek");
      const endOfWeek = now.endOf("isoWeek");
      return `${startOfWeek.format("MM/DD")}〜${endOfWeek.format("MM/DD")}`;
    case "month":
      return now.format("MMMM");
    case "year":
      return now.format("YYYY");
    case "all":
    default:
      return "";
  }
}

function GraphCenterLabel({ hasData, totalSeconds, range = "all", now = dayjs(), isDetail = false }) {
  const localizedNow = now.locale("en"); // ← ここで確実に英語ロケールに変換！

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "0.9rem",
        color: "#333",
        textAlign: "center",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}>
        {formatRangeLabel(range, localizedNow)}
      </div>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {hasData ? formatTime(totalSeconds) : "No Data"}
      </div>
    </div>
  );
}

export default GraphCenterLabel;