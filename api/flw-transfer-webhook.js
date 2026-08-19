export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Flutterwave signs webhook calls with this header — verifying it stops
  // anyone else from POSTing a fake "transfer successful" event.
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== process.env.FLW_SECRET_HASH) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    const { event, data } = req.body;
    if (event !== "transfer.completed" || !data) {
      return res.status(200).json({ received: true });
    }

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
    console.error("flw-transfer-webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
}
