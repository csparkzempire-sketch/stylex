import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Server-side source of truth for what each plan costs. The browser sends the
// checkout amount, so prices can never be trusted from the request — every
// paid effect below is gated on the amount Flutterwave actually settled.
const PLAN_PRICING = {
  verification: { monthly: 2500, annually: 25000 },
  boost: { monthly: 5000, annually: 50000 },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { tx_id } = req.body;
    if (!tx_id) return res.status(400).json({ error: "Missing tx_id" });

    // Verify transaction with Flutterwave
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${tx_id}/verify`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status !== "success" || data.data?.status !== "successful") {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Everything below comes from Flutterwave's own record of the transaction,
    // never from the request body. The body used to carry `type` and `meta`,
    // which let a caller pay for one thing and claim another (or replay a
    // stranger's transaction id) to grant themselves a paid plan for free.
    const amount = Number(data.data.amount);
    const currency = data.data.currency;
    const tx_ref = data.data.tx_ref;
    const meta = data.data.meta || {};
    const type = meta.type;

    if (currency !== "NGN") {
      return res.status(400).json({ error: "Unexpected currency" });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
    );

    // Idempotency — the same transaction must never apply its effect twice,
    // however many times this endpoint is called with it.
    const { data: seen } = await supabase.from("payments")
      .select("id").eq("flw_tx_id", String(tx_id)).maybeSingle();
    if (seen) {
      return res.status(200).json({ success: true, already_processed: true, amount, currency });
    }

    await supabase.from("payments").insert({
      user_id: meta.user_id || null,
      type,
      amount,
      flw_tx_ref: tx_ref,
      flw_tx_id: String(tx_id),
      status: "successful",
      meta,
    });

    // Apply the effect based on payment type
    if (type === "booking" && meta.booking_id) {
      const { data: booking } = await supabase.from("bookings")
        .select("id, price, reference, client_id, service, date, time, payment_status")
        .eq("id", meta.booking_id).maybeSingle();

      if (!booking) return res.status(400).json({ error: "Unknown booking" });
      // The reference is generated with the booking, so this ties the payment
      // to that exact booking rather than any booking id the caller names.
      if (booking.reference !== tx_ref) {
        return res.status(400).json({ error: "Payment does not match this booking" });
      }
      if (amount < Number(booking.price)) {
        return res.status(400).json({ error: "Amount paid is less than the booking total" });
      }

      await supabase.from("bookings").update({
        payment_status: "paid",
        flw_tx_ref: tx_ref,
        flw_tx_id: String(tx_id),
        status: "confirmed",
      }).eq("id", booking.id);

      if (booking.client_id) {
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

        // Loyalty points — ref_id + the DB's unique(user_id, reason, ref_id)
        // constraint make this idempotent if verify ever runs twice.
        await supabase.from("loyalty_points").insert({ user_id: booking.client_id, points: 20, reason: "booking_confirmed", ref_id: booking.id });

        // Referral bonus — only on the referred client's FIRST confirmed booking,
        // so a referral can't be farmed by rebooking.
        const { count: confirmedCount } = await supabase.from("bookings").select("id", { count: "exact", head: true }).eq("client_id", booking.client_id).eq("status", "confirmed");
        if (confirmedCount === 1) {
          const { data: client } = await supabase.from("profiles").select("referred_by").eq("id", booking.client_id).maybeSingle();
          if (client?.referred_by) {
            await supabase.from("loyalty_points").insert({ user_id: client.referred_by, points: 50, reason: "referral_bonus", ref_id: booking.client_id });
            await supabase.from("loyalty_points").insert({ user_id: booking.client_id, points: 20, reason: "referral_welcome", ref_id: booking.client_id });
          }
        }
      }
    }

    if ((type === "verification" || type === "boost") && meta.user_id) {
      const billing = meta.billing === "annually" ? "annually" : "monthly";
      const required = PLAN_PRICING[type][billing];
      // Without this, a ₦100 checkout carrying meta.type "verification" would
      // have bought a full plan.
      if (amount < required) {
        return res.status(400).json({ error: "Amount paid does not cover this plan" });
      }

      const expires = new Date();
      if (billing === "annually") expires.setFullYear(expires.getFullYear() + 1);
      else expires.setMonth(expires.getMonth() + 1);

      const updates = type === "verification"
        ? { is_verified: true, verification_plan: billing, verification_expires: expires.toISOString() }
        : { is_boosted: true, boost_plan: billing, boost_expires: expires.toISOString() };

      await supabase.from("profiles").update(updates).eq("id", meta.user_id);
    }

    if (type === "product" && meta.product_id) {
      const { data: product } = await supabase.from("products")
        .select("id, price").eq("id", meta.product_id).maybeSingle();
      if (!product) return res.status(400).json({ error: "Unknown product" });
      if (amount < Number(product.price)) {
        return res.status(400).json({ error: "Amount paid is less than the product price" });
      }
      await supabase.from("products").update({ sold: true }).eq("id", product.id);
    }

    return res.status(200).json({ success: true, amount, currency });

  } catch (err) {
    console.error("flw-verify error:", err);
    return res.status(500).json({ error: err.message });
  }
}
