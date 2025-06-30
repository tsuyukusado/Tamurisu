// components/TaskRecordList.jsx
import React, { useState } from "react";
import { format } from "date-fns";

function formatDuration(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function parseDuration(str) {
    const parts = str.split(":").map(n => parseInt(n, 10));
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function formatLocalDatetime(timestamp) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function TaskRecordList({ taskId, onChange }) {
const [records, setRecords] = useState(() => {
  const stored = JSON.parse(localStorage.getItem("taskRecords")) || {};
  const list = stored[taskId] || [];
  return list.map((r, index) => {
    if (typeof r === "number") {
      return {
        id: index,
        timestamp: Date.now() + index, // ✅ 1ミリ秒ずつずらす
        duration: r,
      };
    }
    return {
      id: index,
      timestamp: typeof r.timestamp === "number" ? r.timestamp : Date.now() + index,
      duration: typeof r.duration === "number" ? r.duration : 0,
    };
  });
});

    const handleEdit = (index, field, value) => {
        setRecords((prev) => {
            const copy = [...prev];
            if (field === "duration") {
                const seconds = parseDuration(value);
                if (seconds !== null) {
                    copy[index][field] = seconds;
                }
            } else if (field === "timestamp") {
                copy[index][field] = new Date(value).getTime();
            }
            return copy;
        });
    };

    const handleSave = () => {
        const cleaned = records.map(({ timestamp, duration }) => ({ timestamp, duration }));
        const all = JSON.parse(localStorage.getItem("taskRecords")) || {};
        all[taskId] = cleaned;
        localStorage.setItem("taskRecords", JSON.stringify(all));
        if (onChange) onChange(all); // 親に通知
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <h3>記録一覧</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>日時</th>
                        <th style={{ textAlign: "left" }}>時間（HH:MM:SS）</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((rec, idx) => (
                        <tr key={idx}>
                            <td>
<input
  type="datetime-local"
  value={formatLocalDatetime(rec.timestamp)}
  onChange={(e) => handleEdit(idx, "timestamp", e.target.value)}
/>                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={formatDuration(rec.duration)}
                                    onChange={(e) => handleEdit(idx, "duration", e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button style={{ marginTop: "0.5rem" }} onClick={handleSave}>
                保存
            </button>
        </div>
    );
}

export default TaskRecordList;