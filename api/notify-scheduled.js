// ============================================================
// STYLEX · /api/notify-scheduled
// Triggered daily by Vercel Cron (see vercel.json). Finds confirmed
// bookings from ~26-30 days ago that haven't been nudged yet and
// sends a "time for your next appointment?" push to the client.
//
// Guarded by CRON_SECRET so this can't be triggered by anyone else —
// it fans out pushes to real users, so it must not be publicly callable.
//
// Env needed: CRON_SECRET, VAPID_EMAIL, VAPID_PUBLIC_KEY,
// VAPID_PRIVATE_KEY (VAPID vars already set — same ones push-send.js uses).
// ============================================================
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
    );

    const now = new Date();
    const windowStart = new Date(now); windowStart.setDate(now.getDate() - 30);
    const windowEnd = new Date(now); windowEnd.setDate(now.getDate() - 26);

    const { data: dueBookings } = await supabase
      .from("bookings")
      .select("id, client_id, pro_id, service, created_at")
      .eq("status", "confirmed")
      .is("notified_at", null)
      .gte("created_at", windowStart.toISOString())
      .lte("created_at", windowEnd.toISOString());

    if (!dueBookings || dueBookings.length === 0) {
      return res.status(200).json({ checked: 0, sent: 0 });
    }

    const proIds = [...new Set(dueBookings.map(b => b.pro_id).filter(Boolean))];
    const { data: pros } = proIds.length > 0
      ? await supabase.from("profiles").select("id, full_name").in("id", proIds)
      : { data: [] };
    const proNameById = Object.fromEntries((pros || []).map(p => [p.id, p.full_name]));

    const clientIds = [...new Set(dueBookings.map(b => b.client_id).filter(Boolean))];
    const { data: subs } = clientIds.length > 0
      ? await supabase.from("push_subscriptions").select("user_id, subscription").in("user_id", clientIds)
      : { data: [] };
    const subByUser = Object.fromEntries((subs || []).map(s => [s.user_id, s.subscription]));

    let sent = 0;
    const processedIds = [];
    for (const b of dueBookings) {
      // Mark as processed regardless of push outcome, so a dead subscription
      // doesn't cause this booking to be retried forever.
      processedIds.push(b.id);
      const sub = subByUser[b.client_id];
      if (!sub) continue;
      try {
        await webpush.sendNotification(sub, JSON.stringify({
          title: "Time for your next appointment?",
          body: `It's been about a month since your ${b.service || "last visit"}${proNameById[b.pro_id] ? ` with ${proNameById[b.pro_id]}` : ""} — ready to rebook?`,
          icon: "/logo192.png",
          badge: "/logo192.png",
          url: "https://app.stylex.pro",
        }));
        sent++;
      } catch (err) {
        console.error("scheduled push failed:", err);
      }
    }

    if (processedIds.length > 0) {
      await supabase.from("bookings").update({ notified_at: new Date().toISOString() }).in("id", processedIds);
    }

    return res.status(200).json({ checked: dueBookings.length, sent });
  } catch (err) {
    console.error("notify-scheduled error:", err);
    return res.status(500).json({ error: err.message });
  }
}
