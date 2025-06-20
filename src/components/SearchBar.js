// SearchBar.js（仕様変更済み）
import React from "react";
import HybridDateInput from "./HybridDateInput";

function SearchBar({
  keyword,
  setKeyword,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  return (
    <div style={{ padding: "0.5rem 0" }}>
      {/* キーワード入力（タグと統合） */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "600px",
          width: "100%",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="seamless-input"
          placeholder="Keywords Tags"
          style={{ flex: 1, height: "2rem" }}
        />
      </div>

      {/* From日付 */}
      <HybridDateInput
        label="From"
        value={dateFrom}
        onChange={setDateFrom}
      />

      {/* To日付 */}
      <HybridDateInput
        label="To"
        value={dateTo}
        onChange={setDateTo}
      />
    </div>
  );
}

export default SearchBar;
