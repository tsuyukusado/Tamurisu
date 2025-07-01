import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaCalendarAlt } from "react-icons/fa";
import HybridDateTimeInput from "./HybridDateTimeInput";
import { AnimatePresence } from "framer-motion";
import AnimatedItem from "./AnimatedItem";
import FlexibleDateTimeInput from "./FlexibleDateTimeInput";




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

function formatLocalDatetimeInputValue(timestamp) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function TaskRecordList({ taskId, onChange }) {
  const [records, setRecords] = useState([]);

  // 👇 useRefを配列で管理
  const dateRefs = useRef([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("taskRecords")) || {};
    const list = stored[taskId] || [];

    let updated = false;
const normalized = list.map((r, index) => {
  console.log("💾 raw record from localStorage:", r);
  if (typeof r === "number") {
    updated = true;
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      duration: r,
    };
  }
  return {
    id: r.id ?? crypto.randomUUID(),
    timestamp:
      typeof r.timestamp === "number"
        ? r.timestamp
        : typeof r.date === "string"
        ? new Date(r.date).getTime()
        : Date.now(),
    duration: typeof r.duration === "number" ? r.duration : 0,
  };
});
    // ⏺️ 上書き保存（初回だけ）
    if (updated) {
      stored[taskId] = normalized;
      localStorage.setItem("taskRecords", JSON.stringify(stored));
    }

    // 💾 IDを付けて setRecords に渡す
    setRecords(normalized); // ← id はもう中にあるので再生成しない！
  }, [taskId]);

  const saveRecords = (newRecords) => {
    const cleaned = newRecords.map(({ id, timestamp, duration }) => ({ id, timestamp, duration })); const all = JSON.parse(localStorage.getItem("taskRecords")) || {};
    all[taskId] = cleaned;
    localStorage.setItem("taskRecords", JSON.stringify(all));

    // 🔍 前と同じなら setRecords しない
    const prev = JSON.stringify(records.map(r => ({ id: r.id, timestamp: r.timestamp, duration: r.duration })));
    const next = JSON.stringify(cleaned);

    // 👇 ここで必ずログを出す！
    console.log("prev:", prev);
    console.log("next:", next);
    console.log("equal?", prev === next);

    if (prev !== next) {
      setRecords(newRecords);
    }

    if (onChange) onChange(all);

  };

  const handleEdit = (index, field, value) => {

    console.log("📝 handleEdit called:", index, field, value);

    const updated = [...records];
    if (field === "duration") {
      const sec = parseDuration(value);
      if (sec !== null) updated[index].duration = sec;
    } else if (field === "timestamp") {
      updated[index].timestamp = value; // ←これでいい！
    }
    saveRecords(updated);
  };

  const handleDelete = (index) => {
    const updated = [...records];
    updated.splice(index, 1);
    saveRecords(updated);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <AnimatePresence>
            {records.map((rec, idx) => {
              console.log("Rendering record:", rec.id);
              return (
                <AnimatedItem key={rec.id} tag="tr">
                  <td style={{ minWidth: "220px" }}>
                    <FlexibleDateTimeInput
                      value={rec.timestamp}
                      onChange={(val) => handleEdit(idx, "timestamp", val)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="seamless-input"
                      value={formatDuration(rec.duration)}
                      onChange={(e) => handleEdit(idx, "duration", e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#D9534F",
                        fontSize: "0.9rem",
                      }}
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </AnimatedItem>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(TaskRecordList);