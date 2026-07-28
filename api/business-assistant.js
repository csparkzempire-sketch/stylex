// ============================================================
// STYLEX · /api/business-assistant
// POST { messages, businessContext } -> { reply }
//
// A chat assistant for PROFESSIONALS, scoped to their own business
// data (revenue, bookings, top services, repeat-customer rate, goal
// progress). Gives advice — pricing, marketing ideas, retention
// strategies, plain-English reports — it never writes to the
// database or takes any action itself.
//
// Env needed: ANTHROPIC_API_KEY (already set — same one the other
// Stylex AI endpoints use).
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured in Vercel" });
  }

  try {
    const { messages, businessContext } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    const clean = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-16);
    while (clean.length && clean[0].role === "assistant") clean.shift();
    if (clean.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    const system =
`You are Stylex's AI Business Assistant — you help a beauty professional understand and grow their own business on the platform.

THIS PRO'S REAL DATA (the only numbers you know about them — do not invent any other figures):
${JSON.stringify(businessContext || {}, null, 2)}

You can help with: explaining their revenue and booking trends, suggesting pricing adjustments, ideas for marketing or promotions, customer retention strategies, and plain-English summaries of how their business is doing.

For pricing questions specifically, weigh together: their price vs. competitorPricingInCategory (demand/competition), last8WeeksRevenue (is demand rising or falling), isAvailable and how full their booking load looks, currentMonth (e.g. December/wedding-season months support higher prices), and repeatCustomerPct (a loyal base tolerates a price rise better than a thin one). Give a specific number or range when the data supports it, not just "consider raising your prices."

For marketing questions, use trendingInYourCategory (real platform-wide booking counts for services in their category over the last 30 days) to suggest what to promote — e.g. if a service they already offer is trending, tell them to lead with it; if a trending service isn't in their topServices, suggest they could capture that demand.

Rules:
- Only reason from the numbers given above. If something relevant isn't in the data (e.g. exact competitor identities, customer names), say you don't have that info rather than guessing.
- Be specific and practical — reference their actual numbers in your answer, not generic advice.
- You cannot take any action (you can't change their prices, post to social media, or message clients for them) — you can only advise. If they ask you to DO something, tell them where in the app to do it (Dashboard → Business Profile for pricing, etc.) rather than pretending to do it.
- Keep replies short (2-5 sentences unless they ask for a detailed breakdown).
- No medical claims, no legal or tax advice beyond general awareness.

Respond in plain text — no JSON, no markdown formatting.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 500,
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
    const reply = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return res.status(200).json({ reply: reply || "Sorry, could you rephrase that?" });
  } catch (e) {
    console.error("business-assistant error:", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
