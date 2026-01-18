import React, { useEffect, useState } from "react";
import supabase from "./helper/supabaseClient";
import MagicLinkForm from "./MagicLinkForm";
import YourTodoApp from "./pages/YourTodoApp";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);


  useEffect(() => {
    document.body.style.overflow = authOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [authOpen]);
  

  useEffect(() => {
    let subscription;

    // Protect against supabase being misconfigured / unavailable
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, sess) => setSession(sess)
        );

        subscription = listener.subscription;
      } catch (e) {
        // If Supabase is down/paused/misconfigured, we still want the app to load in local mode
        console.warn("Supabase auth unavailable; continuing in local mode.", e);
      }
    })();

    return () => subscription?.unsubscribe?.();
  }, []);

  const user = session?.user ?? null;

  return (
    <>
      <YourTodoApp
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onCloseAuth={() => setAuthOpen(false)}
      />

      {authOpen && !user && (
        <MagicLinkForm onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
}
