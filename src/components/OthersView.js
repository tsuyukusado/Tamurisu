// components/OthersView.js
import React from "react";

function OthersView({ setSubView }) {
  return (
    <div className="others-view" style={{ padding: "1rem" }}>
      <ul className="task-list">
        <li className="task-row" onClick={() => setSubView("completed")}>
          <input className="task-edit" value="完了済みタスク" readOnly />
        </li>
        <li className="task-row" onClick={() => setSubView("info")}>
          <input className="task-edit" value="情報" readOnly />
        </li>
      </ul>
    </div>
  );
}

export default OthersView;