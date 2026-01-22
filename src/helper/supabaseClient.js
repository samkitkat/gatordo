import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase env vars missing. Running in local-only (guest) mode."
  );

  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signInWithOtp: async () => ({
        error: { message: "Supabase unavailable" },
      }),
      signOut: async () => {},
    },
    from: () => ({
      select: async () => ({
        data: null,
        error: new Error("Supabase unavailable"),
      }),
      insert: async () => ({ error: new Error("Supabase unavailable") }),
      update: async () => ({ error: new Error("Supabase unavailable") }),
      delete: async () => ({ error: new Error("Supabase unavailable") }),
      eq() {
        return this;
      },
      order() {
        return this;
      },
    }),
  };
}
export default supabase;