// Everything pro-payout-related lives in this one file — bank list, account
// verification, payout requests, and the Flutterwave transfer webhook — to
// stay under Vercel Hobby's 12-serverless-function cap. The four concerns
// are distinguished by method / an explicit `action` field / the webhook's
// signature header, and delegate to their own handler below.

const MIN_PAYOUT_AMOUNT = 1000; // ₦1,000 minimum, to keep transfer fees from eating small payouts

export default async function handler(req, res) {
  // Flutterwave calls this same URL as its Transfers webhook.
  if (req.method === "POST" && req.headers["verif-hash"]) {
    return handleWebhook(req, res);
  }

  if (req.method === "GET") return handleListBanks(req, res);

  if (req.method === "POST") {
    const action = req.body?.action;
    if (action === "resolve") return handleResolveAccount(req, res);
    if (action === "request") return handleRequestPayout(req, res);
    return res.status(400).json({ error: "Unknown or missing action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function handleListBanks(req, res) {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/banks/NG", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.status !== "success") return res.status(500).json({ error: "Failed to load bank list" });
    return res.status(200).json({ banks: (data.data || []).map(b => ({ code: b.code, name: b.name })) });
  } catch (err) {
    console.error("flw-payout (list banks) error:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function handleResolveAccount(req, res) {
  try {
    const { account_number, bank_code } = req.body;
    if (!account_number || !bank_code) return res.status(400).json({ error: "Missing account_number or bank_code" });

    const response = await fetch("https://api.flutterwave.com/v3/accounts/resolve", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_number, account_bank: bank_code }),
    });
    const data = await response.json();
    if (data.status !== "success") return res.status(400).json({ error: data.message || "Could not verify this account" });
    return res.status(200).json({ account_name: data.data.account_name });
  } catch (err) {
    console.error("flw-payout (resolve account) error:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function handleRequestPayout(req, res) {
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
          callback_url: `${process.env.APP_URL || "https://app.stylex.pro"}/api/flw-payout`,
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
    console.error("flw-payout (request payout) error:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function handleWebhook(req, res) {
  // Flutterwave signs webhook calls with this header — verifying it stops
  // anyone else from POSTing a fake "transfer successful" event.
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== process.env.FLW_SECRET_HASH) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    const { event, data } = req.body;
    if (event !== "transfer.completed" || !data) return res.status(200).json({ received: true });

    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(
      process.env.SUPABASE_URL || "https://utvrujgqzheifblizarw.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const reference = data.reference;
    const status = (data.status || "").toUpperCase();
    if (!reference) return res.status(200).json({ received: true });

    const { data: payout } = await db.from("payouts").select("id, status").eq("reference", reference).maybeSingle();
    if (!payout || payout.status !== "processing") {
      // Already finalized (or unknown reference) — nothing to do.
      return res.status(200).json({ received: true });
    }

    if (status === "SUCCESSFUL") {
      await db.from("payouts").update({ status: "successful", completed_at: new Date().toISOString() }).eq("id", payout.id);
    } else if (status === "FAILED") {
      await db.from("payouts").update({ status: "failed", failure_reason: data.complete_message || "Transfer failed" }).eq("id", payout.id);
      // Release the bookings back to the available balance so the pro can retry.
      await db.from("bookings").update({ payout_id: null }).eq("payout_id", payout.id);
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("flw-payout (webhook) error:", err);
    return res.status(500).json({ error: err.message });
  }
}
