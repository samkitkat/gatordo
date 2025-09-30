import React from "react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <div>
      <div className="border"></div>

      <footer className="footer">
        <p>
          created using <strong>vite</strong>, <strong>react</strong>, &{" "}
          <strong>supabase</strong>
        </p>
        <p>
          deployed with <strong>netlify</strong>
        </p>
        <a
          href="https://github.com/samkitkat/gatordo"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          title="View on GitHub"
        >
          <FaGithub />
        </a>
      </footer>
    </div>
  );
}