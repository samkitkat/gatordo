import { useState } from "react";
import supabase from "./helper/supabaseClient";
import Footer from "./components/Footer";

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
    setMessage(
      error ? error.message : "🐊 Check your inbox for the magic link! 🐊"
    );
    if (!error) setEmail("");
  }

  async function continueAsGuest() {
    setMessage("");
    const { error } = await supabase.auth.signInAnonymously();
    if (error) setMessage(error.message);
  }

  return (
    <div className="container">
      <div className="border"></div>

      <div className="header">
        <h1>GatorDo 🐊</h1>
      </div>

      <h2>Sign in with Email</h2>
      <form onSubmit={handleLogin} className="emailForm">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="signIn">
          Send Magic Link
        </button>
      </form>

      {message && <p className="login-message">{message}</p>}

      <div className="guestButton">
        <h2>OR</h2>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button className="signIn" onClick={continueAsGuest}>
            Continue as guest
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MagicLinkForm;