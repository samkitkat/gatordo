import React from "react";

const TOOLS = [
  { name: "Vite", href: "https://vitejs.dev" },
  { name: "React", href: "https://react.dev" },
  { name: "Supabase", href: "https://supabase.com" },
  { name: "Netlify", href: "https://www.netlify.com" },
];

export default function Footer() {
  return (
    <div>
      <div className="border"></div>

      <footer className="footer">
        <p className="footer-line">
          built with{" "}
          {TOOLS.map((tool, i) => (
            <span key={tool.name}>
              <a href={tool.href} target="_blank" rel="noopener noreferrer">
                {tool.name}
              </a>
              {i < TOOLS.length - 1 && " · "}
            </span>
          ))}
        </p>

        <p className="footer-line">
          view the project on{" "}
          <a
            href="https://github.com/samkitkat/gatordo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
