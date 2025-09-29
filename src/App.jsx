import React, { useEffect, useState } from "react";
import "./App.css";
import supabase from "./helper/supabaseClient";
import MagicLinkForm from "./MagicLinkForm";
import YourTodoApp from "./pages/YourTodoApp";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) =>
      setSession(sess)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return <MagicLinkForm />;
  return <YourTodoApp user={session.user} />;
}