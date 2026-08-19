const MIN_PAYOUT_AMOUNT = 1000; // ₦1,000 minimum, to keep transfer fees from eating small payouts

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing authorization" });

    const { createClient } = await import("@supabase/supabase-js");
    const SUPABASE_URL = process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co";

    // Verify the caller's identity from their own session token — a payout
    // must never trust a client-supplied pro_id, since that would let anyone
    // request a withdrawal of someone else's earnings.
    const authClient = createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: userData, error: authErr } = await authClient.auth.getUser(token);
    if (authErr || !userData?.user) return res.status(401).json({ error: "Invalid session" });
    const proId = userData.user.id;

    // Service-role client for the actual ledger writes — a payout must not
    // depend on the pro's own RLS-scoped write access.
    const db = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: profile, error: profileErr } = await db.from("profiles")
      .select("bank_account_number, bank_code, bank_account_name, full_name")
      .eq("id", proId).maybeSingle();
    if (profileErr || !profile) return res.status(400).json({ error: "Profile not found" });
    if (!profile.bank_account_number || !profile.bank_code) {
      return res.status(400).json({ error: "Add your bank details before requesting a payout" });
    }

    const { data: eligibleBookings, error: bookingsErr } = await db.from("bookings")
      .select("id, pro_amount")
      .eq("pro_id", proId)
      .eq("status", "confirmed")
      .eq("payment_status", "paid")
      .is("payout_id", null);
    if (bookingsErr) return res.status(500).json({ error: bookingsErr.message });

    const amount = (eligibleBookings || []).reduce((sum, b) => sum + (b.pro_amount || 0), 0);
    if (amount < MIN_PAYOUT_AMOUNT) {
      return res.status(400).json({ error: `Minimum payout is ₦${MIN_PAYOUT_AMOUNT.toLocaleString()}. Your available balance is ₦${amount.toLocaleString()}.` });
    }

    const reference = "SXPO-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    const { data: payout, error: payoutInsertErr } = await db.from("payouts").insert({
      pro_id: proId,
      amount,
      status: "processing",
      reference,
      bank_account_number: profile.bank_account_number,
      bank_code: profile.bank_code,
      bank_account_name: profile.bank_account_name,
    }).select().maybeSingle();
    if (payoutInsertErr || !payout) return res.status(500).json({ error: payoutInsertErr?.message || "Could not create payout" });

    // Lock these bookings to this payout before calling Flutterwave, so a
    // second request can't also claim them while this one is in flight.
    const bookingIds = (eligibleBookings || []).map(b => b.id);
    const { data: locked, error: lockErr } = await db.from("bookings")
      .update({ payout_id: payout.id })
      .in("id", bookingIds)
      .is("payout_id", null)
      .select("id");
    if (lockErr || !locked || locked.length !== bookingIds.length) {
      // Couldn't cleanly claim every booking (e.g. a race with another
      // request) — release whatever was locked and abort without calling
      // Flutterwave, so no money moves against an inconsistent ledger.
      await db.from("bookings").update({ payout_id: null }).eq("payout_id", payout.id);
      await db.from("payouts").update({ status: "failed", failure_reason: "Could not lock eligible bookings" }).eq("id", payout.id);
      return res.status(409).json({ error: "Your balance changed — please try again." });
    }

    try {
      const transferRes = await fetch("https://api.flutterwave.com/v3/transfers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_bank: profile.bank_code,
          account_number: profile.bank_account_number,
          amount,
          currency: "NGN",
          narration: "STYLEX payout",
          reference,
          callback_url: `${process.env.APP_URL || "https://app.stylex.pro"}/api/flw-transfer-webhook`,
        }),
      });
      const transferData = await transferRes.json();

      if (transferData.status !== "success") {
        await db.from("bookings").update({ payout_id: null }).eq("payout_id", payout.id);
        await db.from("payouts").update({ status: "failed", failure_reason: transferData.message || "Transfer rejected" }).eq("id", payout.id);
        return res.status(400).json({ error: transferData.message || "Transfer failed" });
      }

      const flwStatus = (transferData.data?.status || "").toUpperCase();
      const updates = { flw_transfer_id: String(transferData.data?.id || "") };
      if (flwStatus === "SUCCESSFUL") { updates.status = "successful"; updates.completed_at = new Date().toISOString(); }
      else if (flwStatus === "FAILED") { updates.status = "failed"; }
      // otherwise leave status "processing" — the webhook finalizes it

      await db.from("payouts").update(updates).eq("id", payout.id);
      if (updates.status === "failed") {
        await db.from("bookings").update({ payout_id: null }).eq("payout_id", payout.id);
      }

      return res.status(200).json({ success: true, payout_id: payout.id, amount, status: updates.status || "processing" });

    } catch (transferErr) {
      // Flutterwave call itself threw — release the lock so the balance
      // isn't stuck in limbo with no transfer actually initiated.
      await db.from("bookings").update({ payout_id: null }).eq("payout_id", payout.id);
      await db.from("payouts").update({ status: "failed", failure_reason: transferErr.message }).eq("id", payout.id);
      return res.status(500).json({ error: "Could not reach the payment processor. Please try again." });
    }

  } catch (err) {
    console.error("request-payout error:", err);
    return res.status(500).json({ error: err.message });
  }
}
