// api/push.js — merges push-send.js + push-subscribe.js (same domain:
// push subscription management) to stay under Vercel Hobby's 12-function
// cap. Routed by { action: "subscribe" | "send" } in the POST body.
import webpush from "web-push";
import { getCaller, isAdmin } from "../lib/auth.js";
import { limited } from "../lib/rateLimit.js";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const APP_URL = process.env.APP_URL || "https://app.stylex.pro";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (await limited(req, res, "push", { limit: 30, windowSeconds: 60 })) return;

  try {
    const { action, user_id, subscription, title, body, icon } = req.body || {};

    // Both actions were previously open to anyone: "send" let a stranger push
    // an arbitrary title, body and link to any user_id — a phishing message
    // arriving as a genuine STYLEX notification.
    const caller = await getCaller(req);
    if (!caller) return res.status(401).json({ error: "Sign in required" });

    if (!process.env.SUPABASE_SERVICE_KEY) {
      console.error("push: SUPABASE_SERVICE_KEY is not configured");
      return res.status(500).json({ error: "Server misconfigured" });
    }
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
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
      if (user_id === caller.id) return res.status(400).json({ error: "Cannot notify yourself" });

      // Still fixable further: caller was only required to be *someone*
      // signed in, so any account could push an arbitrary message to any
      // other user_id. Only allow it when there's a real reason this caller
      // would legitimately be notifying this person — an existing
      // conversation between them (messaging), a booking linking them
      // (client<->pro), or an admin caller.
      const [convo1, convo2, booking1, booking2, admin] = await Promise.all([
        supabase.from("conversations").select("id").eq("participant1_id", caller.id).eq("participant2_id", user_id).maybeSingle(),
        supabase.from("conversations").select("id").eq("participant1_id", user_id).eq("participant2_id", caller.id).maybeSingle(),
        supabase.from("bookings").select("id").eq("client_id", caller.id).eq("pro_id", user_id).limit(1).maybeSingle(),
        supabase.from("bookings").select("id").eq("pro_id", caller.id).eq("client_id", user_id).limit(1).maybeSingle(),
        isAdmin(caller.id),
      ]);
      const related = convo1.data || convo2.data || booking1.data || booking2.data || admin;
      if (!related) return res.status(403).json({ error: "You can only notify someone you have a conversation or booking with" });

      const { data } = await supabase.from("push_subscriptions").select("subscription").eq("user_id", user_id).maybeSingle();
      if (!data) return res.status(404).json({ error: "No subscription found for user" });
      const payload = JSON.stringify({
        title: String(title).slice(0, 120),
        body: typeof body === "string" ? body.slice(0, 300) : "",
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
    return res.status(500).json({ error: "Something went wrong." });
  }
}
