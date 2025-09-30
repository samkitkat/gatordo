import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({
  title,
  todos,
  onUpdate,
  onDelete,
  onStatusChange,
  onCelebrate,
}) {
  return (
    <>
      {title && <h3>{title}</h3>}
      <div>
        {todos.length === 0 && <div style={{ opacity: 0.6 }}>No items</div>}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onCelebrate={onCelebrate}
          />
        ))}
      </div>
    </>
  );
}
