import React, { useRef, useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

function formatDisplayValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

function HybridDateTimeInput({ value, onChange }) {
  const hiddenInputRef = useRef();
  const [text, setText] = useState("");

  useEffect(() => {
    if (value) setText(formatDisplayValue(value));
  }, [value]);

const handleTextChange = (e) => {
  const raw = e.target.value;
  setText(raw);

  const parsed = Date.parse(raw.replace(/\//g, "-"));
  if (!isNaN(parsed)) {
    onChange(parsed);
  }
};

  const handleDatePick = (e) => {
    const iso = e.target.value;
    const timestamp = new Date(iso).getTime();
    onChange(timestamp);
    setText(formatDisplayValue(timestamp));
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="yyyy/mm/dd hh:mm"
        className="seamless-input"
        style={{ width: "100%", paddingRight: "2rem", fontSize: "1rem" }}
      />
      <button
        type="button"
        onClick={() => hiddenInputRef.current?.showPicker()}
        style={{
          position: "absolute",
          right: "0.3rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.1rem",
          color: "#71A4D9",
        }}
        aria-label="日時を選択"
      >
        <FaCalendarAlt />
      </button>
      <input
        ref={hiddenInputRef}
        type="datetime-local"
        value={value ? new Date(value).toISOString().slice(0, 16) : ""}
        onChange={handleDatePick}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default HybridDateTimeInput;