// hooks/useTheme.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "gatordo.theme";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
  });

  // Sync theme to <html data-theme="">
  useEffect(() => {
    const root = document.documentElement;

    if (theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
    } else {
      root.removeAttribute("data-theme");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "y2k" ? "" : "y2k"));
  }

  return {
    theme,
    isY2K: theme === "y2k",
    toggleTheme,
  };
}