import { useState } from "react";
import supabase from "./helper/supabaseClient";
import { FaGithub } from "react-icons/fa";

function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/welcome` },
    });
    setMessage(error ? error.message : "💌 Check your inbox for the magic link!");
    if (!error) setEmail("");
  }

  async function continueAsGuest() {
    setMessage("");
    const { error } = await supabase.auth.signInAnonymously();
    if (error) setMessage(error.message);
    // success: onAuthStateChange in App.jsx will render YourTodoApp
  }

  return (
    <div className="container">
      <div className="border"></div>

      <div className="header"><h1>GatorDo 🐊</h1></div>

      <h2>Sign in with Email</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="signIn">Send Magic Link</button>
      </form>

      <div style={{ marginTop: 12, textAlign: "center" }}>
        <button className="signIn" onClick={continueAsGuest}>Continue as guest</button>
      </div>

      {message && <p className="login-message">{message}</p>}

      <div className="border"></div>
      <footer className="footer">
        <p>created using <strong>vite</strong>, <strong>react</strong>, & <strong>supabase</strong></p>
        <a href="https://github.com/samkitkat" target="_blank" rel="noopener noreferrer" className="github-link" title="View on GitHub">
          <FaGithub />
        </a>
      </footer>
    </div>
  );
}

export default MagicLinkForm;
