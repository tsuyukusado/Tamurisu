import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function CalendarView({ tasks = [], onDateSelect }) {
  const events = tasks
    .filter((task) => !!task.dueDate)
    .map((task) => ({
      title: task.title,
      date: task.dueDate,
    }));

return (
  <div className="calendar-wrapper">
<FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events}
  dateClick={(info) => onDateSelect(info.dateStr)}
  height="auto"
  headerToolbar={{
    left: "title",         // ← 空にする
    center: "",  // ← 〜
    right: "prev,next today" // ← ボタンを右側に追いやる
  }}
/>
  </div>
);
}

export default CalendarView;