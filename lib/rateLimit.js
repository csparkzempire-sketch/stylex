// Fixed-window rate limiting for the serverless endpoints.
//
// Serverless instances don't share memory, so counters live in Postgres —
// an in-process Map would reset on every cold start and be trivially bypassed
// by parallel requests landing on different instances.
//
// Lives outside api/ because anything in there becomes its own serverless
// function, and the project sits on Vercel Hobby's 12-function cap.

const SUPABASE_URL = process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co";

export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.headers["x-real-ip"] || "unknown";
}

// Returns { allowed, remaining }. Fails OPEN: if the limiter itself errors,
// requests are allowed through rather than taking the endpoint down with it.
export async function rateLimit(key, { limit = 20, windowSeconds = 60 } = {}) {
  try {
    if (!process.env.SUPABASE_SERVICE_KEY) return { allowed: true, remaining: limit };

    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000);
    const bucket = `${key}:${windowStart.toISOString()}`;

    const { data, error } = await db.rpc("bump_rate_limit", {
      p_key: bucket,
      p_window_start: windowStart.toISOString(),
    });
    if (error) return { allowed: true, remaining: limit };

    const count = Number(data) || 0;
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return { allowed: true, remaining: limit };
  }
}

// Convenience wrapper: applies the limit and writes the 429 itself.
// Returns true when the caller should stop handling the request.
export async function limited(req, res, name, opts) {
  const { allowed } = await rateLimit(`${name}:${clientIp(req)}`, opts);
  if (!allowed) {
    res.setHeader("Retry-After", String(opts?.windowSeconds || 60));
    res.status(429).json({ error: "Too many requests. Please slow down and try again shortly." });
    return true;
  }
  return false;
}
