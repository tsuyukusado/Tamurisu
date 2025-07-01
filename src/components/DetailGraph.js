import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GraphCenterLabel from "./GraphCenterLabel"; // ✅ 中央表示用
import BackButton from "./BackButton";             // ✅ 戻るボタン用
import ChartWithLegendWrapper from "./ChartWithLegendWrapper";

ChartJS.register(ArcElement, Tooltip, Legend);

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function DetailGraph({ tag, tasks, completedTasks, taskRecords, onBack }) { // ✅ onBack 追加
  const taskData = useMemo(() => {
    if (!tag) return [];
    console.log("📛 tag:", tag);
    const allTasks = [...tasks, ...completedTasks];
    const filtered = allTasks.filter((task) => task.tags?.includes(tag));

    console.log("🔖 allTasks:", allTasks);
console.log("📦 filtered:", filtered);

    return filtered
      .map((task) => {
        const records = taskRecords?.[task.id] || [];
const total = (records || []).reduce((sum, record) => sum + (record.duration || 0), 0);

console.log(`🧮 task: ${task.title}, records:`, records, "→ total:", total);

        return { title: task.title, value: total };
      })
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [tag, tasks, completedTasks, taskRecords]);

  const totalSeconds = taskData.reduce((sum, d) => sum + d.value, 0);

  const chartData = {
    
    labels: taskData.map((d) => d.title),
    datasets: [
      {
        data: taskData.map((d) => d.value),
        backgroundColor: [
          "#71a4d9", "#4C6FBF", "#0000FF", "#000080",
          "#000000", "#505050", "#B0B0B0", "#FFD700",
          "#FFA500", "#FF69B4"
        ],
        borderWidth: 0,
      },
    ],
  };

const options = {
  responsive: true,
  plugins: {
    legend: { display: false }, // ← ここを変更！
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const value = ctx.raw;
          return `${ctx.label}: ${formatTime(value)}`;
        },
      },
    },
  },
  cutout: "50%",
};

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
      <h3 style={{ textAlign: "center" }}>{tag}</h3>

<ChartWithLegendWrapper
  chart={<Doughnut data={chartData} options={options} />}
/>

      <GraphCenterLabel
        hasData={true}
        totalSeconds={totalSeconds}
        isDetail={true}
      />
      {onBack && <BackButton onClick={onBack} />} {/* ✅ 下に表示 */}
    </div>
  );
}

export default DetailGraph;