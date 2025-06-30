import React, { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
ChartJS.register(ArcElement, Tooltip, Legend);

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

const ranges = ["day", "week", "month", "year"];

function TimeRangeGraphView({ tasks, completedTasks, taskRecords }) {
    const [range, setRange] = useState("week");
    const now = dayjs();

    const tagTotals = useMemo(() => {
        const totals = {};
        const allTasks = [...tasks, ...completedTasks];

        allTasks.forEach((task) => {
            const records = taskRecords[task.id] || [];
            if (!records || !task.tags) return;

            records.forEach((rec) => {
                const dur = typeof rec === "number" ? rec : rec.duration || 0;
                const date = typeof rec === "number" ? null : rec.date;
                if (!date) return;

                const d = dayjs(date);
                const match =
                    (range === "day" && d.isSame(now, "day")) ||
                    (range === "week" && d.isSame(now, "week")) ||
                    (range === "month" && d.isSame(now, "month")) ||
                    (range === "year" && d.isSame(now, "year"));

                if (!match) return;

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
    }, [tasks, completedTasks, taskRecords, range]);

    const hasData = tagTotals.length > 0;
    const totalSeconds = tagTotals.reduce((sum, d) => sum + d.value, 0);

    const chartData = {
        labels: hasData ? tagTotals.map((d) => d.name) : ["No Data"],
        datasets: [
            {
                data: hasData ? tagTotals.map((d) => d.value) : [1],
                backgroundColor: hasData
                    ? ["#71a4d9", "#4C6FBF", "#0000FF", "#000080", "#FF69B4", "#FFD700"]
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
    };

    return (
        <div style={{ textAlign: "center" }}>
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
                        {r.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={{ maxWidth: 400, margin: "0 auto" }}>
                <Doughnut data={chartData} options={options} />
                <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
                    {hasData ? `合計: ${formatTime(totalSeconds)}` : "No Data"}
                </div>
            </div>
        </div>
    );
}

export default TimeRangeGraphView;