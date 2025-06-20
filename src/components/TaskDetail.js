import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./TaskDetail.css";
import HybridDateInput from "./HybridDateInput";

function TaskDetail({ task, onClose, onUpdate, onUpdateTags }) {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(task.tags || []);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [recordTime, setRecordTime] = useState(0); // 秒
  const [editedTime, setEditedTime] = useState(""); // "HH:MM:SS" 形式
  const [dueDate, setDueDate] = useState(task.dueDate || ""); // 日付形式

  useEffect(() => {
    setEditedTitle(task.title);
    setTags(task.tags || []);
    setDueDate(task.dueDate || "");

    const records = JSON.parse(localStorage.getItem("taskRecords")) || {};
    const durations = records[task.id] || [];
    const total = durations.reduce((acc, sec) => acc + sec, 0);
    setRecordTime(total);
    setEditedTime(formatTime(total));
  }, [task]);

  const handleTitleUpdate = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate({ ...task, title: editedTitle.trim() });
    }
  };

  const handleTimeUpdate = () => {
    const parts = editedTime.split(":").map((p) => parseInt(p, 10));
    if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
      const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      const records = JSON.parse(localStorage.getItem("taskRecords")) || {};
      records[task.id] = [totalSeconds];
      localStorage.setItem("taskRecords", JSON.stringify(records));
      setRecordTime(totalSeconds);
      setEditedTime(formatTime(totalSeconds));
    } else {
      setEditedTime(formatTime(recordTime));
    }
  };

  const handleDueDateChange = (e) => {
    const date = e.target.value;
    setDueDate(date);
    onUpdate({ ...task, dueDate: date });
  };

const handleAddTag = (e) => {
  if (e.key === "Enter" && !e.nativeEvent.isComposing && newTag.trim()) {
    const splitTags = newTag
      .split(/\s+/) // ← 半角スペース、全角スペース、タブなどで分割
      .map(t => t.trim())
      .filter(t => t.length > 0 && !tags.includes(t)); // 重複除外

    if (splitTags.length > 0) {
      const updated = [...tags, ...splitTags];
      setTags(updated);
      onUpdateTags(task.id, updated);
      setNewTag("");
    }
  }
};

  const handleDeleteTag = (index) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    onUpdateTags(task.id, updated);
  };

  const handleEditTag = (index) => {
    const tagText = tags[index];
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    onUpdateTags(task.id, updated);
    setNewTag(tagText);
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="task-detail">
      <h2>Task Detail</h2>

      {/* タイトル */}
      <input
        className="seamless-input task-title-input"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={handleTitleUpdate}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.target.blur();
          }
        }}
      />

      {/* 記録時間 */}
      <input
        className="seamless-input record-time-input"
        value={editedTime}
        onChange={(e) => setEditedTime(e.target.value)}
        onBlur={handleTimeUpdate}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.target.blur();
          }
        }}
      />

{/* 期日 */}
<div className="due-date-section" style={{ maxWidth: "600px", marginBottom: "1rem" }}>
  <HybridDateInput
    label="To"
    value={dueDate}
    onChange={(v) => {
      setDueDate(v);
      onUpdate({ ...task, dueDate: v });
    }}
  />
</div>

      {/* タグ */}
      {tags.length > 0 && <hr className="tag-divider" />}
      <div className="tags-section">
        <div className="tags-list">
          {tags.map((tag, index) => (
            <div className="tag-pill" key={index}>
              <span onClick={() => handleEditTag(index)}>{tag}</span>
              <span className="tag-delete-circle" onClick={() => handleDeleteTag(index)}>
                <FaTimes size={10} />
              </span>
            </div>
          ))}
        </div>

        {tags.length > 0 && <hr className="tag-divider" />}

<input
  type="text"
  placeholder="Add new tag..."
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  onKeyDown={handleAddTag}
  className="tag-input seamless-input"
/>
      </div>

      <hr className="tag-divider" />
    </div>
  );
}

export default TaskDetail;