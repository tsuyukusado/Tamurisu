import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaBars } from "react-icons/fa";
import "./TaskList.css";
const MotionLi = motion((props) => <li {...props} />);

function TaskList({
  tasks,
  newTask,
  inputRef,
  isComposing,
  removingId,
  setNewTask,
  setIsComposing,
  handleKeyDown,
  toggleTask,
  deleteTask,
  handleDragEnd,
  setSelectedTask,
  setView
}) {
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <ul className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            <AnimatePresence>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <motion.li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="task-row"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        setSelectedTask(task);
                        setView("detail");
                      }}
                    >
                     <span {...provided.dragHandleProps} className="drag-handle">
  <FaBars />
</span>
                      <input
                        type="checkbox"
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleTask(task.id)}
                      />
                      <div className="task-title">{task.title}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                      >
                        Delete
                      </button>
                    </motion.li>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
<li>
  <input
    ref={inputRef}
    className="task-input new-task-input"  // ← 追加クラス名をつける！
    placeholder="New Task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
            </li>
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;