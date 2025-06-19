import React from "react";

function SearchBar({
  keyword,
  setKeyword,
  tagFilter,
  setTagFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo
}) {
  return (
    <div style={{ padding: "0.5rem" }}>
      <input
        type="text"
        placeholder="キーワードで検索"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="seamless-input"
      />
      <input
        type="text"
        placeholder="タグで絞り込み"
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
        className="seamless-input"
      />
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="seamless-input"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="seamless-input"
      />
    </div>
  );
}

export default SearchBar;