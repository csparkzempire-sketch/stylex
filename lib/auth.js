// Shared caller verification for the serverless endpoints.
// Lives outside api/ on purpose: anything inside api/ becomes its own
// serverless function, and the project sits exactly on Vercel Hobby's
// 12-function cap.

const SUPABASE_URL = process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co";
// The anon key is public by design (it ships in the browser bundle), so
// falling back to it here is safe and keeps token verification working even
// if the env var isn't set on the deployment.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc";

// Resolves the Supabase user behind a request's Bearer token.
// Returns null when the token is missing, malformed or rejected — callers
// must treat null as "unauthenticated" and refuse the request.
export async function getCaller(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return null;

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

// True when the caller's profile is flagged as an admin. Read with the
// service key so it can't be spoofed by whatever the caller can see.
export async function isAdmin(userId) {
  if (!userId) return false;
  const { createClient } = await import("@supabase/supabase-js");
  const db = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data } = await db.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  return data?.is_admin === true;
}
