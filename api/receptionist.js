// ============================================================
// STYLEX · /api/receptionist
// POST { messages, proContext } -> { reply, action }
//
// A per-pro "AI Receptionist" for prospective clients browsing that
// pro's profile — answers pricing/availability/hours/policy questions
// grounded ONLY in what the pro actually entered. It never invents
// hours or policies the pro hasn't provided, and never books or pays
// itself — it can only return a "book" action that opens the real
// booking flow, same as the platform-wide Beauty Assistant.
//
// Env needed: ANTHROPIC_API_KEY (already set — same one the other
// Stylex AI endpoints use).
// ============================================================

const ALLOWED_ACTIONS = ["book"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured in Vercel" });
  }

  try {
    const { messages, proContext } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }
    if (!proContext || !proContext.name) {
      return res.status(400).json({ error: "Missing pro context." });
    }

    const clean = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-16);
    while (clean.length && clean[0].role === "assistant") clean.shift();
    if (clean.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    const system =
`You are the AI Receptionist for ${proContext.name}, a beauty professional on Stylex. You answer questions from PROSPECTIVE CLIENTS browsing this pro's profile — you work for this one pro, not the platform.

${proContext.name.toUpperCase()}'S REAL BUSINESS INFO (the only facts you know — never invent anything not listed here):
${JSON.stringify(proContext, null, 2)}

Rules:
- Only answer from the info above. If someone asks about hours, policies, or anything not listed (or the field is empty), say you don't have that on hand and suggest they message ${proContext.name} directly — never guess or make up an hours/policy answer.
- You cannot book, take payment, or change anything — you can only inform. If they want to book, encourage it and set action to {"type": "book"}.
- Keep replies short (1-3 sentences), warm, and professional — you're representing this pro's business.
- No medical claims. No discounts or promises the data doesn't support.

Respond with ONLY a JSON object, no markdown, no backticks:
{ "reply": "<your reply>", "action": null OR { "type": "book" } }

Use action "book" only when they've clearly indicated they want to book or are ready to — not on every message.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // cheap — high volume, low-stakes Q&A
        max_tokens: 400,
        system,
        messages: clean,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Anthropic error:", r.status, detail);
      return res.status(502).json({ error: "The receptionist is unavailable. Try again." });
    }

    const data = await r.json();
    const raw = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    const stripped = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(stripped);
    } catch {
      return res.status(200).json({ reply: raw || "Sorry, could you say that another way?", action: null });
    }

    const reply = typeof parsed.reply === "string" ? parsed.reply : "Sorry, could you say that another way?";

    let action = null;
    const a = parsed.action;
    if (a && typeof a === "object" && ALLOWED_ACTIONS.includes(a.type)) {
      action = { type: a.type };
    }

    return res.status(200).json({ reply, action });
  } catch (e) {
    console.error("receptionist error:", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
