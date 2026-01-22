import { useEffect, useRef, useState } from "react";
import supabase from "./helper/supabaseClient";

function MagicLinkForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);

    // focus the modal for accessibility
    setTimeout(() => modalRef.current?.focus?.(), 0);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });

      setMessage(
        error ? error.message : "🐊 Check your inbox for the magic link! 🐊"
      );
      if (!error) setEmail("");
    } catch (e) {
      setMessage("Sign-in is unavailable right now (Supabase offline).");
      console.warn(e);
    }
  }

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div className="modal-backdrop" onMouseDown={onBackdropClick}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="modal-content">
          <h3>Sign in with Email</h3>

          <form onSubmit={handleLogin} className="emailForm">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="signIn">
              Send Magic Link
            </button>
          </form>

          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default MagicLinkForm;