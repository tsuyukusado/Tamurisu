// MenuBar.jsx の先頭にこれを入れておく
import { FiMoreHorizontal } from "react-icons/fi";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaChartBar,
  FaRegClock,
  FaTasks,
  FaCalendarDay,
} from "react-icons/fa";

function MenuBar({ setView, setSubView, view }) {
  const isActive = (target) => {
    if (target === "tasks") return view === "tasks" || view === "detail";
    return view === target;
  };

  const iconStyle = (targetView) => ({
    color: isActive(targetView) ? "#71A4D9" : "#666",
    cursor: "pointer"
  });

  return (
    <div className="menu-bar" style={{ display: "flex", justifyContent: "space-around", padding: "0.5rem 0" }}>
      <FiMoreHorizontal
        size={24}
        style={iconStyle("others")}
        onClick={() => { setView("others"); setSubView(null); }}
      />

      <FaTasks
        size={24}
        style={iconStyle("tasks")}
        onClick={() => setView("tasks")}
      />
      <FaRegClock
        size={24}
        style={iconStyle("record")}
        onClick={() => setView("record")}
      />
      <FaCalendarAlt
        size={24}
        style={iconStyle("calendar")}
        onClick={() => setView("calendar")}
      />
      <FaChartBar
        size={24}
        style={iconStyle("graph")}
        onClick={() => setView("graph")}
      />
    </div>
  );
}

export default MenuBar;