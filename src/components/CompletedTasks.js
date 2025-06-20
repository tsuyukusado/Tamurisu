import React from "react";
import "./CompletedTasks.css";
import { AnimatePresence, motion } from "framer-motion";
import BackButton from "./BackButton"; // ← 追加

function CompletedTasks({
  completedTasks,
  restoreTask,
  deleteTask,
  setSubView,
  onTaskClick // ← 追加！
}) {
  return (
    <div className="completed-view">
      <ul className="task-list">
        <AnimatePresence>
          {completedTasks.map((task) => (
            <motion.li
              key={task.id}
              className="task-row"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                className="task-edit"
                value={task.title}
                readOnly
                onClick={() => onTaskClick(task.id)} // ← ここ追加！
              />
              <div className="button-group">
                <button
                  className="restore-button"
                  onClick={() => restoreTask(task.id)}
                >
                  Restore
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>

<li className="task-row" style={{ justifyContent: "flex-end" }}>
  <BackButton onClick={() => setSubView(null)} />
</li>
      </ul>
    </div>
  );
}

export default CompletedTasks;