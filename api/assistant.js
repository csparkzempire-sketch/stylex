// ============================================================
// STYLEX · /api/assistant
// POST { messages, passport } -> { reply, action }
//
// The assistant chats using the user's Beauty Passport as context.
// It NEVER makes bookings or payments itself — it returns a safe
// navigation "action" that the app executes (show matches, search
// pros, open passport). The user finishes any booking in the real
// flow, where they confirm.
//
// Env needed: ANTHROPIC_API_KEY (already set — same one /api/scan.js,
// /api/passport-scan.js and /api/recommend-pros.js use).
// ============================================================

const ALLOWED_ACTIONS = ["show_matches", "search_pros", "open_passport"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured in Vercel" });
  }

  try {
    const { messages, passport } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    // Only pass through clean {role, content} text turns.
    const clean = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-16); // keep the last ~16 turns

    // Claude requires the first message to be from the user.
    while (clean.length && clean[0].role === "assistant") clean.shift();

    if (clean.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    const system =
`You are the Stylex Beauty Assistant — warm, concise, and expert in hair, skin, nails, makeup and barbering. You help THIS user based on their Beauty Passport.

USER'S BEAUTY PASSPORT:
${passport && Object.keys(passport).length ? JSON.stringify(passport, null, 2) : "(not filled in yet)"}

You can suggest styles, answer beauty questions, and guide the user toward booking a professional. You do NOT complete bookings or take payments yourself — you point the user to the right place in the app and they finish there.

Respond with ONLY a JSON object, no markdown, no backticks:
{
  "reply": "<your natural, friendly reply>",
  "action": null OR { "type": "show_matches" } OR { "type": "search_pros", "query": "<short, e.g. 'wedding makeup'>" } OR { "type": "open_passport" }
}

Use an action ONLY when it clearly helps the user right now:
- "show_matches": they want professionals recommended for themselves.
- "search_pros": they want a specific service/style ("find a wedding makeup artist near me").
- "open_passport": their passport is empty, or they want to update their details.
Otherwise "action" is null.

Keep replies short (1–4 sentences), specific, and warm. Never give medical advice or claims.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5", // swap to "claude-haiku-4-5-20251001" to cut cost
        max_tokens: 600,
        system,
        messages: clean,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Anthropic error:", r.status, detail);
      return res.status(502).json({ error: "The assistant is unavailable. Try again." });
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
      // If the model didn't return clean JSON, treat the whole thing as a plain reply.
      return res.status(200).json({ reply: raw || "Sorry, could you say that another way?", action: null });
    }

    const reply = typeof parsed.reply === "string" ? parsed.reply : "Sorry, could you say that another way?";

    // Whitelist the action so the app never acts on anything unexpected.
    let action = null;
    const a = parsed.action;
    if (a && typeof a === "object" && ALLOWED_ACTIONS.includes(a.type)) {
      action = { type: a.type };
      if (a.type === "search_pros") {
        action.query = typeof a.query === "string" ? a.query.slice(0, 80) : "";
      }
    }

    return res.status(200).json({ reply, action });
  } catch (e) {
    console.error("assistant error:", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
