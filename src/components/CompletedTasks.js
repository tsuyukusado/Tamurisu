import React from "react";
// これがないとCSSは適用されない！
import "./CompletedTasks.css";
import { AnimatePresence, motion } from "framer-motion";

function CompletedTasks({ completedTasks, restoreTask, deleteTask, setSubView }) {  return (
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
              <input className="task-edit" value={task.title} readOnly />
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

        <li className="task-row" onClick={() => setSubView(null)}>
          <input className="task-edit" value="← Back" readOnly />
        </li>
      </ul>
    </div>
  );
}

export default CompletedTasks;