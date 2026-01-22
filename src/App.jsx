import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import supabase from "./helper/supabaseClient";
import MagicLinkForm from "./MagicLinkForm";
import YourTodoApp from "./pages/YourTodoApp";
import ArchivePage from "./pages/ArchivePage";
import "./App.css";

const THEME_KEY = "gatordo.theme";

export default function App() {
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  // theme
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (theme === "y2k")
      document.documentElement.setAttribute("data-theme", "y2k");
    else document.documentElement.removeAttribute("data-theme");
  }, [theme]);

  const [authResolved, setAuthResolved] = useState(false);

  // body lock for modal
  useEffect(() => {
    document.body.style.overflow = authOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [authOpen]);

  useEffect(() => {
    let subscription;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);

        setAuthResolved(true);

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, sess) => {
            setSession(sess ?? null);
          }
        );
        subscription = listener.subscription;
      } catch (e) {
        console.warn("Supabase auth unavailable; continuing in local mode.", e);
        setAuthResolved(true);
      }
    })();

    return () => subscription?.unsubscribe?.();
  }, []);

  const user = session?.user ?? null;

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "y2k" ? null : "y2k";
      try {
        if (next) localStorage.setItem(THEME_KEY, next);
        else localStorage.removeItem(THEME_KEY);
      } catch {}
      return next;
    });
  }

  if (!authResolved) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <YourTodoApp
              user={user}
              onOpenAuth={() => setAuthOpen(true)}
              onCloseAuth={() => setAuthOpen(false)}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/archive"
          element={
            <ArchivePage
              user={user}
              onOpenAuth={() => setAuthOpen(true)}
              onCloseAuth={() => setAuthOpen(false)}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {authOpen && !user && (
        <MagicLinkForm onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
}