import React from "react";
import "./CompletedTasks.css"; // 再利用CSS
import BackButton from "./BackButton"; // ✅ 戻るボタンをインポート

function InfoPage({ setSubView }) {
  return (
    <div className="others-view" style={{ padding: "1rem" }}>
      <ul className="task-list">
        <li className="task-row">
          <input className="task-edit" value="Developer: Tsuyukusa Kureyon" readOnly />
        </li>
        <li className="task-row">
          <input className="task-edit" value="Version: 2025/06/20" readOnly />
        </li>
        <li className="task-row">
          <input className="task-edit" value="Contact: tsuyukusado@gmail.com" readOnly />
        </li>
        <li className="task-row" style={{ justifyContent: "flex-end" }}>
          <BackButton onClick={() => setSubView(null)} />
        </li>
      </ul>
    </div>
  );
}

export default InfoPage;