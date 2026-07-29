// ============================================================
// STYLEX · /api/notify-scheduled
// Triggered daily by Vercel Cron (see vercel.json). Two jobs:
//  1. Rebook nudge — confirmed bookings from ~26-30 days ago with no
//     nudge sent yet: "time for your next appointment?"
//  2. Appointment reminder — confirmed bookings with a real
//     appointment_at in the next ~24-26h with no reminder sent yet.
//
// Guarded by CRON_SECRET so this can't be triggered by anyone else —
// it fans out pushes to real users, so it must not be publicly callable.
//
// Env needed: CRON_SECRET, VAPID_EMAIL, VAPID_PUBLIC_KEY,
// VAPID_PRIVATE_KEY (VAPID vars already set — same ones push.js uses).
// ============================================================
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function pushToClients(supabase, bookings, buildMessage) {
  if (bookings.length === 0) return 0;

  const proIds = [...new Set(bookings.map(b => b.pro_id).filter(Boolean))];
  const { data: pros } = proIds.length > 0
    ? await supabase.from("profiles").select("id, full_name").in("id", proIds)
    : { data: [] };
  const proNameById = Object.fromEntries((pros || []).map(p => [p.id, p.full_name]));

  const clientIds = [...new Set(bookings.map(b => b.client_id).filter(Boolean))];
  const { data: subs } = clientIds.length > 0
    ? await supabase.from("push_subscriptions").select("user_id, subscription").in("user_id", clientIds)
    : { data: [] };
  const subByUser = Object.fromEntries((subs || []).map(s => [s.user_id, s.subscription]));

  let sent = 0;
  for (const b of bookings) {
    const sub = subByUser[b.client_id];
    if (!sub) continue;
    try {
      await webpush.sendNotification(sub, JSON.stringify({
        ...buildMessage(b, proNameById[b.pro_id]),
        icon: "/logo192.png",
        badge: "/logo192.png",
        url: "https://app.stylex.pro",
      }));
      sent++;
    } catch (err) {
      console.error("scheduled push failed:", err);
    }
  }
  return sent;
}

async function runRebookNudges(supabase) {
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

  const bookings = dueBookings || [];
  const sent = await pushToClients(supabase, bookings, (b, proName) => ({
    title: "Time for your next appointment?",
    body: `It's been about a month since your ${b.service || "last visit"}${proName ? ` with ${proName}` : ""} — ready to rebook?`,
  }));

  if (bookings.length > 0) {
    await supabase.from("bookings").update({ notified_at: new Date().toISOString() }).in("id", bookings.map(b => b.id));
  }
  return { checked: bookings.length, sent };
}

async function runAppointmentReminders(supabase) {
  const now = new Date();
  const windowStart = new Date(now); windowStart.setHours(now.getHours() + 24);
  const windowEnd = new Date(now); windowEnd.setHours(now.getHours() + 26);

  const { data: dueBookings } = await supabase
    .from("bookings")
    .select("id, client_id, pro_id, service, date, time, appointment_at")
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .not("appointment_at", "is", null)
    .gte("appointment_at", windowStart.toISOString())
    .lte("appointment_at", windowEnd.toISOString());

  const bookings = dueBookings || [];
  const sent = await pushToClients(supabase, bookings, (b, proName) => ({
    title: "📅 Appointment reminder",
    body: `${b.service || "Your appointment"}${proName ? ` with ${proName}` : ""} is tomorrow${b.time ? ` at ${b.time}` : ""}.`,
  }));

  if (bookings.length > 0) {
    await supabase.from("bookings").update({ reminder_sent_at: new Date().toISOString() }).in("id", bookings.map(b => b.id));
  }
  return { checked: bookings.length, sent };
}

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

    const [rebookNudges, appointmentReminders] = await Promise.all([
      runRebookNudges(supabase),
      runAppointmentReminders(supabase),
    ]);

    return res.status(200).json({ rebookNudges, appointmentReminders });
  } catch (err) {
    console.error("notify-scheduled error:", err);
    return res.status(500).json({ error: err.message });
  }
}
