import React from "react";
import HybridDateInput from "./HybridDateInput";

function SearchBar({
  keyword,
  setKeyword,
  tagFilter,
  setTagFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  return (
    <div style={{ padding: "0.5rem 0" }}>
      {/* キーワード入力 */}
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
          placeholder="例:キーワード　小説　執筆"
          style={{ flex: 1, height: "2rem" }}
        />
      </div>

      {/* タグ入力 */}
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
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="seamless-input"
          placeholder="例:タグ　小説　執筆"
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