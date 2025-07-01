import React, { useRef, useEffect, useState } from "react";
import "./ExpandingNoteInput.css";

function ExpandingNoteInput({ value, onChange }) {
  const [text, setText] = useState(value || "");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

const handleChange = (e) => {
  const newText = e.target.value;
  setText(newText);
  onChange?.(newText);
};

  return (
    <textarea
      ref={textareaRef}
      className="expanding-note-input"
      value={text}
      onChange={handleChange}
      rows={1}
      placeholder="memo..."
    />
  );
}

export default ExpandingNoteInput;