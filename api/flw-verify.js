import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { tx_ref, tx_id, type, meta } = req.body;

    // Verify transaction with Flutterwave
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${tx_id}/verify`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status !== "success" || data.data.status !== "successful") {
      return res.status(400).json({ error: "Payment verification failed", data });
    }

    const { amount, currency, customer } = data.data;

    // Store payment record in Supabase
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
    );

    await supabase.from("payments").insert({
      user_id: meta?.user_id || null,
      type,
      amount,
      flw_tx_ref: tx_ref,
      flw_tx_id: String(tx_id),
      status: "successful",
      meta,
    });

    // Apply the effect based on payment type
    if (type === "booking" && meta?.booking_id) {
      const { data: booking } = await supabase.from("bookings").update({
        payment_status: "paid",
        flw_tx_ref: tx_ref,
        flw_tx_id: String(tx_id),
        status: "confirmed",
      }).eq("id", meta.booking_id).select().maybeSingle();

      if (booking?.client_id) {
        const { data: sub } = await supabase.from("push_subscriptions").select("subscription").eq("user_id", booking.client_id).maybeSingle();
        if (sub) {
          try {
            await webpush.sendNotification(sub.subscription, JSON.stringify({
              title: "🎉 Booking confirmed!",
              body: `${booking.service || "Your appointment"} on ${booking.date || ""} at ${booking.time || ""}`,
              icon: "/logo192.png",
              badge: "/logo192.png",
              url: "https://app.stylex.pro",
            }));
          } catch (pushErr) {
            console.error("booking-confirmed push failed:", pushErr);
          }
        }
      }
    }

    if (type === "verification" && meta?.user_id) {
      const expires = new Date();
      if (meta.billing === "annually") expires.setFullYear(expires.getFullYear() + 1);
      else expires.setMonth(expires.getMonth() + 1);
      await supabase.from("profiles").update({
        is_verified: true,
        verification_plan: meta.billing || "monthly",
        verification_expires: expires.toISOString(),
      }).eq("id", meta.user_id);
    }

    if (type === "boost" && meta?.user_id) {
      const expires = new Date();
      if (meta.billing === "annually") expires.setFullYear(expires.getFullYear() + 1);
      else expires.setMonth(expires.getMonth() + 1);
      await supabase.from("profiles").update({
        is_boosted: true,
        boost_plan: meta.billing || "monthly",
        boost_expires: expires.toISOString(),
      }).eq("id", meta.user_id);
    }

    if (type === "product" && meta?.product_id) {
      await supabase.from("products").update({ sold: true }).eq("id", meta.product_id);
    }

    return res.status(200).json({ success: true, amount, currency });

  } catch (err) {
    console.error("flw-verify error:", err);
    return res.status(500).json({ error: err.message });
  }
}