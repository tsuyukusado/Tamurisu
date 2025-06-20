import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function CalendarView({ tasks, onDateSelect, onTaskClick }) {
  const events = tasks
    .filter((task) => !!task.dueDate)
    .map((task) => ({
      title: task.title,
      date: task.dueDate,
      id: task.id,
      extendedProps: {
        id: task.id,
      },
    }));

  return (
    <div className="calendar-wrapper">
<FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events}
  dateClick={(info) => onDateSelect(info.dateStr)}
  eventClick={(info) => {
    const taskId = info.event.extendedProps.id;
    if (taskId) {
      onTaskClick(taskId);
    }
  }}
  height="auto"
  headerToolbar={{
    left: "title",
    center: "",
    right: "prev,next today"
  }}
  eventBackgroundColor="#71A4D9"
  eventTextColor="#ffffff"
/>
    </div>
  );
}

export default CalendarView;

