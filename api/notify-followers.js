// ============================================================
// STYLEX · /api/notify-followers
// POST { pro_id, title, body, url } -> pushes a notification to
// everyone who follows this pro. Used for event-triggered smart
// notifications: "X is now available", "X just posted new work".
//
// Env needed: VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
// (already set — same ones /api/push.js uses).
// ============================================================
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { pro_id, title, body, url } = req.body || {};
    if (!pro_id || !title) return res.status(400).json({ error: "Missing fields" });

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc"
    );

    const { data: followers } = await supabase.from("follows").select("follower_id").eq("pro_id", pro_id);
    if (!followers || followers.length === 0) return res.status(200).json({ sent: 0, failed: 0 });

    const followerIds = followers.map(f => f.follower_id);
    const { data: subs } = await supabase.from("push_subscriptions").select("user_id, subscription").in("user_id", followerIds);
    if (!subs || subs.length === 0) return res.status(200).json({ sent: 0, failed: 0 });

    const payload = JSON.stringify({
      title,
      body,
      icon: "/logo192.png",
      badge: "/logo192.png",
      url: url || "https://stylex.pro",
    });

    let sent = 0, failed = 0;
    await Promise.all(subs.map(async (s) => {
      try {
        await webpush.sendNotification(s.subscription, payload);
        sent++;
      } catch (err) {
        failed++;
        // A 410/404 means the subscription is dead — clean it up so future
        // fan-outs don't keep retrying it.
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("user_id", s.user_id);
        }
      }
    }));

    return res.status(200).json({ sent, failed });
  } catch (err) {
    console.error("notify-followers error:", err);
    return res.status(500).json({ error: err.message });
  }
}
