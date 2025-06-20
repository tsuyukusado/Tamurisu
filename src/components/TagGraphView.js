// TagGraphView.js（最終改良版）
import React, { useMemo, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GraphCenterLabel from "./GraphCenterLabel";
ChartJS.register(ArcElement, Tooltip, Legend);

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function TagGraphView({ tasks, completedTasks, taskRecords, onTagClick, graphRefreshKey }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    console.log("graphRefreshKey changed:", graphRefreshKey);
    setKey((prev) => prev + 1); // ✅ key を更新して再描画トリガー
  }, [graphRefreshKey]);

  const tagTotals = useMemo(() => {
    console.log("Calculating tagTotals:", { tasks, completedTasks, taskRecords });
    const totals = {};
    const allTasks = [...tasks, ...completedTasks];

    allTasks.forEach((task) => {
      const records = taskRecords[task.id.toString()];
      if (!records || !task.tags) return;
      const sum = records.reduce((a, b) => a + b, 0);
      task.tags.forEach((tag) => {
        if (!totals[tag]) totals[tag] = 0;
        totals[tag] += sum;
      });
    });

    const result = Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    console.log("tagTotals result:", result);
    return result;
  }, [tasks, completedTasks, taskRecords, graphRefreshKey]);

  const hasData = tagTotals.length > 0;
  const totalSeconds = tagTotals.reduce((sum, d) => sum + d.value, 0);

  const chartData = {
    labels: hasData ? tagTotals.map((d) => d.name) : ["データなし"],
    datasets: [
      {
        data: hasData ? tagTotals.map((d) => d.value) : [1],
        backgroundColor: hasData
          ? [
              "#71a4d9", "#4C6FBF", "#0000FF", "#000080",
              "#000000", "#505050", "#B0B0B0", "#FFD700",
              "#FFCC66", // ← 薄橙
              "#FFA500", "#FF69B4",
            ]
          : ["#ccc"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (!hasData) return "データなし";
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

  console.log("Rendering Doughnut chart with key:", key);

return (
  <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
    <Doughnut key={key} data={chartData} options={options} />
    <GraphCenterLabel hasData={hasData} totalSeconds={totalSeconds} />
  </div>
);
}

export default TagGraphView;
