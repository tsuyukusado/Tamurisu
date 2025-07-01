// UnifiedTagGraphView.js
import React, { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // ← これ！
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

dayjs.extend(utc); // ← 忘れずに！

ChartJS.register(ArcElement, Tooltip, Legend);

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const ranges = ["all", "day", "week", "month", "year"];

function UnifiedTagGraphView({ tasks, completedTasks, taskRecords, onTagClick }) {
  const [range, setRange] = useState("all");
  const [now] = useState(() => dayjs());
  const tagTotals = useMemo(() => {


    const totals = {};
    const allTasks = [...tasks, ...completedTasks];

allTasks.forEach((task) => {

  console.log("🧩 checking task:", task.id);
console.log("🔖 tags:", task.tags);
console.log("📦 records:", taskRecords[task.id?.toString()]);

  const records = taskRecords[task.id?.toString()] || [];
  if (!task.tags || !records) return;

  records.forEach((rec) => {
    if (Array.isArray(rec)) {
      console.warn("📛 nested array found!", rec);
      return;
    }

    const dur = typeof rec === "number" ? rec : rec.duration || 0;
const rawDate = typeof rec === "number" ? null : rec.date ?? rec.timestamp;
const date = rawDate ? dayjs(rawDate) : null;
    console.log("🧪 rec = ", rec);
    console.log("🕓 date = ", date, "→ dayjs(date) = ", dayjs(date).format());

if (range !== "all") {
  if (date == null) {
    console.warn("🚫 date 無効:", date);
    return;
  }

  const d = dayjs(date); // number なら .local() は不要
  if (!d.isValid()) {
    console.warn("❌ Invalid date:", date);
    return;
  }

  console.log("✅ timestamp raw:", date);
console.log("🕒 now =", now.format());
console.log("🧮 判定:", {
  day: d.isSame(now, "day"),
  week: d.isSame(now, "isoWeek"),
  month: d.isSame(now, "month"),
  year: d.isSame(now, "year"),
});

  const match =
    (range === "day" && d.isSame(now, "day")) ||
    (range === "week" && d.isSame(now, "isoWeek")) ||
    (range === "month" && d.isSame(now, "month")) ||
    (range === "year" && d.isSame(now, "year"));

  if (!match) return;
}

    // ✅ ここ！各 record に対応して加算
    task.tags.forEach((tag) => {
      if (!totals[tag]) totals[tag] = 0;
      totals[tag] += dur;
    });
  });
});

  return Object.entries(totals)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
},
[tasks, completedTasks, taskRecords, range]);

const hasData = tagTotals.length > 0;
const totalSeconds = tagTotals.reduce((sum, d) => sum + d.value, 0);

const chartData = {
  labels: hasData ? tagTotals.map((d) => d.name) : ["No Data"],
  datasets: [
    {
      data: hasData ? tagTotals.map((d) => d.value) : [1],
      backgroundColor: hasData
        ? [
          "#71a4d9", "#4C6FBF", "#0000FF", "#000080",
          "#000000", "#505050", "#B0B0B0", "#FFCC66",
          "#FFD700", "#FFA500", "#FF69B4"
        ]
        : ["#ccc"],
      borderWidth: 0,
    },
  ],
};

const options = {
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          if (!hasData) return "No Data";
          const value = ctx.raw;
          return `${ctx.label}: ${formatTime(value)}`;
        },
      },
    },
  },
  cutout: "50%",
  onClick: (evt, elements) => {
    if (!hasData || !elements.length) return;
    const index = elements[0].index;
    const tag = chartData.labels[index];
    if (onTagClick) onTagClick(tag);
  },
};

return (
  <div style={{ textAlign: "center", paddingTop: "1rem" }}>
    <div style={{ marginBottom: "1rem" }}>
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          style={{
            margin: "0 0.5rem",
            padding: "0.4rem 1rem",
            borderRadius: "0.5rem",
            border: range === r ? "2px solid #71a4d9" : "1px solid #ccc",
            background: range === r ? "#e3f0ff" : "#fff",
            cursor: "pointer",
          }}
        >
          {r === "all" ? "ALL" : r.toUpperCase()}
        </button>
      ))}
    </div>

    <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
      <Doughnut data={chartData} options={options} />
      <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
        {hasData ? `合計: ${formatTime(totalSeconds)}` : "No Data"}
      </div>
    </div>
  </div>
);
}

export default UnifiedTagGraphView;