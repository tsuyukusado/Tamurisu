import React, { useState, useEffect, useRef } from "react";
import { parseFlexibleDateTime } from "../utils/parseFlexibleDateTime";
import { FaCalendarAlt } from "react-icons/fa";
import { COLORS } from "../constants/colors";

function FlexibleDateTimeInput({ value, onChange }) {
  const [text, setText] = useState("");
  const hiddenInputRef = useRef();

  const formatDisplay = (timestamp) => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  };

  useEffect(() => {
    if (value) {
      setText(formatDisplay(value));
    }
  }, [value]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const parsed = parseFlexibleDateTime(text);
      if (parsed) {
        const ts = parsed.getTime();
        onChange(ts);
        setText(formatDisplay(ts));
      }
    }
  };

  const handleCalendarClick = () => {
    hiddenInputRef.current?.showPicker();
  };

  const handleDatePick = (e) => {
    const [yyyy, mm, dd, hh, min] = e.target.value.match(/\d+/g).map(Number);
    const date = new Date(yyyy, mm - 1, dd, hh, min);
    const ts = date.getTime();
    onChange(ts);
    setText(formatDisplay(ts));
  };

  return (
    <div style={{ position: "relative", display: "inline-block", width: "180px" }}>
      <input
        type="text"
        className="seamless-input"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="例: 202507011233"
        style={{
          width: "100%",
          paddingRight: "28px",
        }}
      />
      <FaCalendarAlt
        onClick={handleCalendarClick}
        style={{
          position: "absolute",
          right: "4px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: COLORS.tsuyukusa,
        }}
      />
      <input
        ref={hiddenInputRef}
        type="datetime-local"
        style={{ display: "none" }}
        onChange={handleDatePick}
      />
    </div>
  );
}

export default FlexibleDateTimeInput;