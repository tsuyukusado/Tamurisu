// components/InfoPage.js
import React from "react";
import "./CompletedTasks.css"; // 共通のUI用CSS（task-listやtask-editなど）

function InfoPage({ setSubView }) {
  return (
    <div className="others-view" style={{ padding: "1rem" }}>
      <ul className="task-list">
        <li className="task-row">
          <input className="task-edit" value="開発者：露草くれよん" readOnly />
        </li>
        <li className="task-row">
          <input className="task-edit" value="バージョン：2025/06/20" readOnly />
        </li>
        <li className="task-row">
          <input className="task-edit" value="問い合わせ：tsuyukusado@gmail.com" readOnly />
        </li>
      </ul>
    </div>
  );
}

export default InfoPage;