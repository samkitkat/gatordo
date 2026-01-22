import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../helper/supabaseClient";

function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ArchivePage({ user }) {
  const [now, setNow] = useState(new Date());
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("local");
  const [warning, setWarning] = useState("");

  const storageKey = useMemo(() => {
    return user?.id ? `gatordo.todos.${user.id}` : "gatordo.todos.guest";
  }, [user?.id]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setWarning("");
    if (user?.id) {
      (async () => {
        const ok = await tryFetchFromSupabase();
        if (ok) setMode("supabase");
        else {
          setMode("local");
          setWarning("Cloud sync unavailable — showing local archive.");
          loadLocal();
        }
      })();
    } else {
      setMode("local");
      loadLocal();
    }
  }, [user?.id, storageKey]);

  function loadLocal() {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const completed = (Array.isArray(parsed) ? parsed : [])
        .filter((t) => t.status === "completed" && t.completed_at)
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
      setItems(completed);
    } catch (e) {
      console.warn("Failed to load local archive", e);
      setItems([]);
    }
  }

  async function tryFetchFromSupabase() {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
      return true;
    } catch (e) {
      console.warn("Supabase archive fetch failed", e);
      return false;
    }
  }

  return (
    <div className="container">
      <div
        className="signOutButton"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link className="signOutLink" to="/" title="Back to app">
          ← Back
        </Link>

        <span style={{ opacity: 0.8, fontSize: "0.95rem" }}>
          {mode === "supabase" ? "cloud archive" : "local archive"}
        </span>
      </div>

      {warning && (
        <p className="login-message" style={{ marginTop: 8 }}>
          {warning}
        </p>
      )}

      <h3>📦 archive</h3>

      {items.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No completed todos yet.</p>
      ) : (
        <div>
          {items.map((t) => (
            <div
              key={t.id}
              className="todo-item todo-completed"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: "0.9rem", opacity: 0.75 }}>
                  completed: {formatDateTime(t.completed_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}