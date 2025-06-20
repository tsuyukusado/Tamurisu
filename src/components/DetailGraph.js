import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GraphCenterLabel from "./GraphCenterLabel"; // ✅ 追加

ChartJS.register(ArcElement, Tooltip, Legend);

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function DetailGraph({ tag, tasks, completedTasks, taskRecords }) {
  const taskData = useMemo(() => {
    if (!tag) return [];
    const allTasks = [...tasks, ...completedTasks];
    const filtered = allTasks.filter((task) => task.tags?.includes(tag));

    return filtered
      .map((task) => {
        const records = taskRecords?.[task.id] || [];
        const total = records.reduce((a, b) => a + b, 0);
        return { title: task.title, value: total };
      })
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [tag, tasks, completedTasks, taskRecords]);

  if (taskData.length === 0) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h3>Tag: {tag}</h3>
        <p>No records found for this tag.</p>
      </div>
    );
  }

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

return (
  <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
    <h3 style={{ textAlign: "center" }}>{tag}</h3>
    <Doughnut
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
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
      }}
    />
    <GraphCenterLabel
      hasData={taskData.length > 0}
      totalSeconds={taskData.reduce((a, b) => a + b.value, 0)}
      isDetail={true} // ✅ ここで伝える！
    />
  </div>
);
}

export default DetailGraph;