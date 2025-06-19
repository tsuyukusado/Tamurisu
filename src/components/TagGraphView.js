// TagGraphView.js（更新版）
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function TagGraphView({ tasks, completedTasks, taskRecords, onTagClick }) {  const tagTotals = useMemo(() => {
    const totals = {};
    const allTasks = [...tasks, ...completedTasks];

    allTasks.forEach((task) => {
      const records = taskRecords[task.id];
      if (!records || !task.tags) return;
      const sum = records.reduce((a, b) => a + b, 0);
      task.tags.forEach((tag) => {
        if (!totals[tag]) totals[tag] = 0;
        totals[tag] += sum;
      });
    });

    return Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tasks, completedTasks, taskRecords]);

  const chartData = {
    labels: tagTotals.map(d => d.name),
    datasets: [
      {
        data: tagTotals.map(d => d.value),
        backgroundColor: [
          "#71a4d9", "#4C6FBF", "#0000FF", "#000080",
          "#000000", "#505050", "#B0B0B0", "#FFD700",
          "#FFA500", "#FF69B4",
       ],
        borderWidth: 0,
      },
    ],
  };

  const handleClick = (event, elements) => {
    if (!elements.length) return;
    const index = elements[0].index;
    const tag = tagTotals[index].name;
    onTagClick(tag);
  };

  const options = {
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
    onClick: (evt, elements) => {
      if (!elements.length) return;
      const index = elements[0].index;
      const tag = chartData.labels[index];
      if (onTagClick) onTagClick(tag); // ✅ 安全に呼ぶ
    },
  };


  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default TagGraphView;
