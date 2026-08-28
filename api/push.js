// api/push.js — merges push-send.js + push-subscribe.js (same domain:
// push subscription management) to stay under Vercel Hobby's 12-function
// cap. Routed by { action: "subscribe" | "send" } in the POST body.
import webpush from "web-push";
import { getCaller } from "../lib/auth.js";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const APP_URL = process.env.APP_URL || "https://app.stylex.pro";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { action, user_id, subscription, title, body, icon } = req.body || {};

    // Both actions were previously open to anyone: "send" let a stranger push
    // an arbitrary title, body and link to any user_id — a phishing message
    // arriving as a genuine STYLEX notification.
    const caller = await getCaller(req);
    if (!caller) return res.status(401).json({ error: "Sign in required" });

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc"
    );

    if (action === "subscribe") {
      if (!subscription) return res.status(400).json({ error: "Missing fields" });
      // Bound to the caller's own id so nobody can point someone else's
      // account at a device they control.
      await supabase.from("push_subscriptions").upsert({ user_id: caller.id, subscription }, { onConflict: "user_id" });
      return res.status(200).json({ success: true });
    }

    if (action === "send") {
      if (!user_id || !title) return res.status(400).json({ error: "Missing fields" });
      const { data } = await supabase.from("push_subscriptions").select("subscription").eq("user_id", user_id).maybeSingle();
      if (!data) return res.status(404).json({ error: "No subscription found for user" });
      const payload = JSON.stringify({
        title,
        body,
        icon: icon || "/logo192.png",
        badge: "/logo192.png",
        // Fixed server-side. A caller-supplied link is the whole payload of a
        // push-phishing attack, and nothing legitimate needs to vary it.
        url: APP_URL,
      });
      await webpush.sendNotification(data.subscription, payload);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Missing or invalid action" });
  } catch (err) {
    console.error("push error:", err);
    return res.status(500).json({ error: err.message });
  }
}
