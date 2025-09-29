import React from "react";

export default function Header({ now }) {
  return (
    <div className="header">
      <h1>GatorDo 🐊</h1>
      <div className="datetime">
        <div className="date">
          {now.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="time">
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}