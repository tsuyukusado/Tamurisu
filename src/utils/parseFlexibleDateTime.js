// utils/parseFlexibleDateTime.js
export function parseFlexibleDateTime(input) {
  // 例：202507011233 → 2025-07-01T12:33
  if (/^\d{12}$/.test(input)) {
    const yyyy = input.slice(0, 4);
    const mm = input.slice(4, 6);
    const dd = input.slice(6, 8);
    const hh = input.slice(8, 10);
    const min = input.slice(10, 12);
    const dateStr = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // 通常のDateパース
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}