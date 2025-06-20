import React, { useRef, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

function HybridDateInput({ value, onChange, label }) {
  const [text, setText] = useState(() => {
    return value ? value.replaceAll("-", "") : "";
  });

  const hiddenDateRef = useRef();

  const handleTextChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    setText(raw);

    if (raw.length === 8) {
      const yyyy = raw.slice(0, 4);
      const mm = raw.slice(4, 6);
      const dd = raw.slice(6, 8);
      const iso = `${yyyy}-${mm}-${dd}`;
      if (!isNaN(new Date(iso).getTime())) {
        onChange(iso);
      }
    }
  };

  const handleDatePick = (e) => {
    const iso = e.target.value;
    onChange(iso);
    setText(iso.replaceAll("-", ""));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", maxWidth: "600px", width: "100%", gap: "1rem", marginBottom: "1rem" }}>
      {/* ラベル */}
      <label style={{ minWidth: "3rem", textAlign: "right" }}>{label}</label>

      {/* テキスト入力（横幅いっぱいに） */}
      <div style={{ position: "relative", flex: 1 }}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="yyyymmdd"
          maxLength={8}
          className="seamless-input"
          style={{
            width: "100%",
            paddingRight: "2rem", // アイコン分
            fontSize: "1rem",
          }}
        />

        {/* カレンダーアイコン：右端に絶対配置 */}
        <button
          type="button"
          onClick={() => hiddenDateRef.current?.showPicker()}
          style={{
            position: "absolute",
            right: "0.2rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#71A4D9"
          }}
          aria-label="日付を選択"
        >
          <FaCalendarAlt />
        </button>
      </div>

      {/* 隠し date input */}
      <input
        type="date"
        value={value}
        onChange={handleDatePick}
        ref={hiddenDateRef}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default HybridDateInput;