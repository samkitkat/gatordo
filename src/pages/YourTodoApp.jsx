import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoList from "../components/TodoList";
import { FaPlus } from "react-icons/fa";

export default function YourTodoApp({ user }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (!error) setTodos(data || []);
    else console.error(error);
  }

  async function addTodo() {
    if (!title.trim()) return;
    const { error } = await supabase
      .from("todos")
      .insert([{ title, status: "incomplete", user_id: user.id }]);
    if (!error) {
      setTitle("");
      fetchTodos();
    } else {
      console.error(error);
    }
  }

  async function updateTodo(id, newTitle) {
    const { error } = await supabase
      .from("todos")
      .update({ title: newTitle })
      .eq("id", id);
    if (!error) fetchTodos();
  }

  async function deleteTodo(id) {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) fetchTodos();
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from("todos")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchTodos();
  }

  //GATOR CONFETTI curtesy of chatgpt
  function gatorBurst(x, y) {
    const count = 10; // number of gators
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.textContent = "🐊";
      span.className = "gator-burst";
      // start at click point
      span.style.left = x + "px";
      span.style.top = y + "px";
      // random scatter
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 35; // px
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance * -1; // bias upward a bit
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
  //GATOR CONFETTI

  return (
    <div className="container">
      <div className="signOutButton">
        <button
          onClick={() => supabase.auth.signOut()}
          className="signOut"
          title="Sign out"
        >
          Sign out
        </button>
      </div>

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
      <TodoList
        title="✅ completed"
        todos={todos.filter((t) => t.status === "completed")}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onStatusChange={updateStatus}
        onCelebrate={handleCelebrateFromEvent}
      />

      <Footer />
      
    </div>
  );
}
