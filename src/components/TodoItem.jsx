import React, { useState } from "react";
import { FaCheck, FaPen, FaTrash, FaUndo } from "react-icons/fa";

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onStatusChange,
  onCelebrate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const saveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, editTitle);
    }
    setIsEditing(false);
  };

  return (
    <div className={`todo-item todo-${todo.status.replace(" ", "-")}`}>
      {isEditing ? (
        <input
          className="edit-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") {
              setEditTitle(todo.title);
              setIsEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <span>{todo.title}</span>
      )}

      <div className="actions">
        {todo.status === "incomplete" && (
          <>
            <button
              className="ip"
              onClick={() => onStatusChange(todo.id, "in progress")}
              title="Mark as In Progress"
            >
              <b>IP</b>
            </button>
            <button
              className="complete"
              onClick={(e) => {
                onStatusChange(todo.id, "completed");
                onCelebrate?.(e);
              }}
              title="Mark as Complete"
            >
              <FaCheck />
            </button>
          </>
        )}

        {todo.status === "in progress" && (
          <>
            <button
              className="complete"
              onClick={(e) => {
                onStatusChange(todo.id, "completed");
                onCelebrate?.(e);
              }}
              title="Mark as Complete"
            >
              <FaCheck />
            </button>
            <button
              className="ip"
              onClick={() => onStatusChange(todo.id, "incomplete")}
              title="Reset to Incomplete"
            >
              <FaUndo />
            </button>
          </>
        )}

        {todo.status === "completed" && (
          <button
            className="ip"
            onClick={() => onStatusChange(todo.id, "in progress")}
            title="Back to In Progress"
          >
            <FaUndo />
          </button>
        )}

        {!isEditing && (
          <button
            className="update"
            onClick={() => setIsEditing(true)}
            title="Edit Todo"
          >
            <FaPen />
          </button>
        )}

        <button
          className="delete"
          onClick={() => onDelete(todo.id)}
          title="Delete Todo"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
