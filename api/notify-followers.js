// ============================================================
// STYLEX · /api/notify-followers
// POST { pro_id, title, body, url, audience } -> pushes a notification
// to an audience of this pro. audience: "followers" (default) or
// "waitlist". Used for event-triggered smart notifications: "X is now
// available", "X just posted new work", and waitlist notifications
// when a busy pro becomes available again (waitlist entries are
// cleared once notified, same as a real-world waitlist).
//
// Waitlist fan-out folded in here (rather than a new endpoint) since
// it's the same "notify people about this pro" domain — keeps us
// under Vercel Hobby's 12-function cap.
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
    const { pro_id, title, body, url, audience } = req.body || {};
    if (!pro_id || !title) return res.status(400).json({ error: "Missing fields" });

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc"
    );

    let userIds;
    if (audience === "waitlist") {
      const { data: rows } = await supabase.from("waitlist").select("client_id").eq("pro_id", pro_id);
      userIds = (rows || []).map(r => r.client_id);
    } else {
      const { data: rows } = await supabase.from("follows").select("follower_id").eq("pro_id", pro_id);
      userIds = (rows || []).map(r => r.follower_id);
    }
    if (userIds.length === 0) return res.status(200).json({ sent: 0, failed: 0 });

    const { data: subs } = await supabase.from("push_subscriptions").select("user_id, subscription").in("user_id", userIds);
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

    // A waitlist is a one-time thing — once notified, clear it (matches a
    // real-world waitlist; the client can re-join if they want another turn).
    if (audience === "waitlist") {
      await supabase.from("waitlist").delete().eq("pro_id", pro_id);
    }

    return res.status(200).json({ sent, failed });
  } catch (err) {
    console.error("notify-followers error:", err);
    return res.status(500).json({ error: err.message });
  }
}
