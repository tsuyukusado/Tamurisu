import React, { useState, useEffect } from "react";

function RecordPage({ tasks, taskRecords, setTaskRecords }) {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isTiming) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTiming, startTime]);

  const handleStart = () => {
    if (!selectedTaskId) return;
    setElapsedTime(0);
    setTimeout(() => {
      setStartTime(Date.now());
      setIsTiming(true);
    }, 10);
  };

  const handleStop = () => {
    if (!isTiming) return;
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const updatedRecords = { ...taskRecords };
    if (!updatedRecords[selectedTaskId]) updatedRecords[selectedTaskId] = [];
    updatedRecords[selectedTaskId].push(duration);
    setTaskRecords(updatedRecords);
    setIsTiming(false);
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <select
        value={selectedTaskId}
        onChange={(e) => setSelectedTaskId(e.target.value)}
        style={{
          margin: "1rem 0",
          fontSize: "1.2rem",
          textAlign: "center",
          border: "none",
          outline: "none",
          background: "transparent",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
      >
        <option value="">Select a task▽</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>

      <div style={{ fontSize: "2.5rem", margin: "1.5rem 0" }}>
        {formatTime(elapsedTime)}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={isTiming ? handleStop : handleStart}
          disabled={!selectedTaskId}
          style={{
            fontSize: "1.2rem",
            padding: "0.75rem 2rem",
            backgroundColor: selectedTaskId ? "#71A4D9" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: selectedTaskId ? "pointer" : "not-allowed",
            opacity: selectedTaskId ? 1 : 0.6,
            transition: "background-color 0.2s, opacity 0.2s"
          }}
        >
          {isTiming ? "Stop" : "Start"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(taskRecords).map(([taskId, times]) => {
          const task = tasks.find((t) => t.id.toString() === taskId);
          if (!task) return null;
          return (
            <li key={taskId} style={{ marginBottom: "1rem" }}>
              {/* 表示内容は今後追加予定 */}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecordPage;