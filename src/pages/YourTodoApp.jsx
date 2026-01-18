import React, { useEffect, useMemo, useState } from "react";
import supabase from "../helper/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoList from "../components/TodoList";
import { FaPlus } from "react-icons/fa";

function safeUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function sortByMostRecentCompleted(todos) {
  return [...todos].sort((a, b) => {
    const aTime = a.completed_at || a.created_at;
    const bTime = b.completed_at || b.created_at;

    return new Date(bTime) - new Date(aTime);
  });
}

export default function YourTodoApp({ user, onOpenAuth, onCloseAuth }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [now, setNow] = useState(new Date());

  // "supabase" or "local"
  const [mode, setMode] = useState("local");
  const [cloudWarning, setCloudWarning] = useState("");

  const [showCompleted, setShowCompleted] = useState(true);

  const storageKey = useMemo(() => {
    // Keep separate buckets so people can sign in later without losing guest todos
    return user?.id ? `gatordo.todos.${user.id}` : "gatordo.todos.guest";
  }, [user?.id]);

  function loadLocal() {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      setTodos(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.warn("Failed to load local todos", e);
      setTodos([]);
    }
  }

  function saveLocal(nextTodos) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextTodos));
    } catch (e) {
      console.warn("Failed to save local todos", e);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Decide mode + initial load
  useEffect(() => {
    setCloudWarning("");

    if (!user?.id) {
      setMode("local");
      loadLocal();
      return;
    }

    // If signed in, try Supabase first. If it fails, fall back to local.
    (async () => {
      const ok = await tryFetchFromSupabase();
      if (ok) {
        setMode("supabase");
      } else {
        setMode("local");
        setCloudWarning("Cloud sync unavailable — using local mode.");
        loadLocal();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, storageKey]);

  async function tryFetchFromSupabase() {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setTodos(data || []);
      return true;
    } catch (e) {
      console.warn("Supabase fetch failed", e);
      return false;
    }
  }

  async function fetchTodos() {
    if (mode === "supabase" && user?.id) {
      const ok = await tryFetchFromSupabase();
      if (!ok) {
        setMode("local");
        setCloudWarning("Cloud sync unavailable — using local mode.");
        loadLocal();
      }
      return;
    }

    loadLocal();
  }

  async function addTodo() {
    if (!title.trim()) return;

    if (mode === "supabase" && user?.id) {
      try {
        const { error } = await supabase
          .from("todos")
          .insert([{ title, status: "incomplete", user_id: user.id }]);

        if (error) throw error;

        setTitle("");
        fetchTodos();
        return;
      } catch (e) {
        console.warn("Supabase add failed; switching to local.", e);
        setMode("local");
        setCloudWarning("Cloud sync unavailable — using local mode.");
        // fall through to local add
      }
    }

    const createdAt = new Date().toISOString();

    const next = [
      ...todos,
      {
        id: safeUUID(),
        title,
        status: "incomplete",
        user_id: user?.id ?? null,
        created_at: createdAt,
        completed_at: null,
      },
    ];

    setTodos(next);
    saveLocal(next);
    setTitle("");
  }

  async function updateTodo(id, newTitle) {
    if (mode === "supabase" && user?.id) {
      try {
        const { error } = await supabase
          .from("todos")
          .update({ title: newTitle })
          .eq("id", id);
        if (error) throw error;
        fetchTodos();
        return;
      } catch (e) {
        console.warn("Supabase update failed; switching to local.", e);
        setMode("local");
        setCloudWarning("Cloud sync unavailable — using local mode.");
      }
    }

    const next = todos.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t
    );

    setTodos(next);
    saveLocal(next);
  }

  async function deleteTodo(id) {
    if (mode === "supabase" && user?.id) {
      try {
        const { error } = await supabase.from("todos").delete().eq("id", id);
        if (error) throw error;
        fetchTodos();
        return;
      } catch (e) {
        console.warn("Supabase delete failed; switching to local.", e);
        setMode("local");
        setCloudWarning("Cloud sync unavailable — using local mode.");
      }
    }

    const next = todos.filter((t) => t.id !== id);
    setTodos(next);
    saveLocal(next);
  }

  async function updateStatus(id, newStatus) {
    if (mode === "supabase" && user?.id) {
      try {
        const { error } = await supabase
          .from("todos")
          .update({
            status: newStatus,
            completed_at:
              newStatus === "completed" ? new Date().toISOString() : null,
          })
          .eq("id", id);

        if (error) throw error;
        fetchTodos();
        return;
      } catch (e) {
        console.warn("Supabase status update failed; switching to local.", e);
        setMode("local");
        setCloudWarning("Cloud sync unavailable — using local mode.");
      }
    }

    const next = todos.map((t) => {
      if (t.id !== id) return t;

      return {
        ...t,
        status: newStatus,
        completed_at:
          newStatus === "completed" ? new Date().toISOString() : null,
      };
    });

    setTodos(next);
    saveLocal(next);
  }

  // GATOR CONFETTI
  function gatorBurst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.textContent = "🐊";
      span.className = "gator-burst";
      span.style.left = x + "px";
      span.style.top = y + "px";
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 35;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance * -1;
      const rot = Math.random() * 90 - 45 + "deg";
      span.style.setProperty("--tx", `${tx}px`);
      span.style.setProperty("--ty", `${ty}px`);
      span.style.setProperty("--rot", rot);
      span.style.fontSize = 16 + Math.floor(Math.random() * 10) + "px";

      document.body.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    }
  }

  function handleCelebrateFromEvent(e) {
    gatorBurst(e.clientX, e.clientY);
  }
  // GATOR CONFETTI

  return (
    <div className="container">
      {/* Top bar */}
      <div
        className="signOutButton"
        style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
      >
        {!user ? (
          <button onClick={onOpenAuth} className="signOut" title="Sign in">
            Sign in
          </button>
        ) : (
          <button
            onClick={() => supabase.auth.signOut()}
            className="signOut"
            title="Sign out"
          >
            Sign out
          </button>
        )}
      </div>

      {cloudWarning && (
        <p className="login-message" style={{ marginTop: 6 }}>
          {cloudWarning}
        </p>
      )}

      <div className="border"></div>
      <Header now={now} />

      <h3>✍🏼 todos</h3>

      <div className="inputContainer">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="add your todo"
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add" onClick={addTodo} title="Add Todo">
          <FaPlus />
        </button>
      </div>

      <TodoList
        title=""
        todos={todos.filter((t) => t.status === "incomplete")}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onStatusChange={updateStatus}
        onCelebrate={handleCelebrateFromEvent}
      />
      <TodoList
        title="⏳ in progress"
        todos={todos.filter((t) => t.status === "in progress")}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onStatusChange={updateStatus}
        onCelebrate={handleCelebrateFromEvent}
      />

      <h3
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
        onClick={() => setShowCompleted((v) => !v)}
        title={showCompleted ? "Hide completed" : "Show completed"}
      >
        ✅ completed
        <span aria-hidden="true">{showCompleted ? "▾" : "▸"}</span>
      </h3>

      {showCompleted && (
        <TodoList
          title=""
          todos={sortByMostRecentCompleted(
            todos.filter((t) => t.status === "completed")
          )}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onStatusChange={updateStatus}
          onCelebrate={handleCelebrateFromEvent}
        />
      )}

      <Footer />
    </div>
  );
}
