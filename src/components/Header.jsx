import React from "react";

export default function Header({ now }) {
  return (
    <header className="header" role="banner">
      {/* MAIN HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>GatorDo 🐊</h1>

        <div className="datetime" aria-hidden>
          <div className="date">
            {now.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>

          <div className="time">
            {now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </header>
  );
}