// ============================================================
// STYLEX · /api/recommend-pros
// POST { passport, pros }  ->  ranked matches with a "why this pro" reason.
//
// Design: the CLIENT loads the passport + a shortlist of candidate pros
// (already filtered by verification/location) and sends them here.
// This endpoint asks Claude to rank ONLY those pros and explain the fit,
// then whitelists the result so no invented pro can come back.
//
// Env needed: ANTHROPIC_API_KEY (already set — same one /api/scan.js
// and /api/passport-scan.js use).
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured in Vercel" });
  }

  try {
    const { passport, pros } = req.body || {};
    if (!passport || !Array.isArray(pros) || pros.length === 0) {
      return res.status(200).json({ ranked: [] });
    }

    // Trim to a small, model-friendly payload.
    const slim = pros.slice(0, 20).map((p) => ({
      id: p.id,
      name: p.name ?? p.full_name ?? p.business_name ?? "Pro",
      specialties: p.specialties ?? p.services ?? p.category ?? null,
      price_range: p.price_range ?? p.priceRange ?? null,
      location: p.location ?? p.city ?? p.country ?? null,
      bio: p.bio ?? p.about ?? null,
      verified: p.verified ?? p.is_verified ?? null,
    }));
    const validIds = new Set(slim.map((p) => String(p.id)));

    const prompt =
`You are Stylex's matchmaking assistant. Match this client's beauty passport to the best professionals from the list, and rank them best-first.

CLIENT BEAUTY PASSPORT:
${JSON.stringify(passport, null, 2)}

PROFESSIONALS (choose ONLY from these, by id):
${JSON.stringify(slim, null, 2)}

Return ONLY a JSON array, no markdown:
[{ "pro_id": "<id from the list>", "score": <0-100 fit>, "reason": "<one short sentence, max 18 words, why THIS pro fits THIS client>" }]

Rules:
- Use only pro ids from the list above. Never invent a professional.
- Base the match on real overlap: the pro's specialty vs the client's preferred styles and goals, budget fit, hair/skin suitability, location.
- Weak match = low score. Don't force a good reason where there isn't one.
- Reasons must be specific and warm, not generic filler. No medical claims.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5", // swap to "claude-haiku-4-5-20251001" to cut cost
        max_tokens: 900,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Anthropic error:", r.status, detail);
      return res.status(502).json({ error: "Couldn't build recommendations. Try again." });
    }

    const data = await r.json();
    const raw = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error("Unparseable model output:", raw);
      return res.status(502).json({ error: "Couldn't read recommendations. Try again." });
    }

    // Whitelist: keep only real pro ids, clamp score, cap reason, sort best-first.
    const ranked = (Array.isArray(parsed) ? parsed : [])
      .filter((x) => x && validIds.has(String(x.pro_id)))
      .map((x) => ({
        pro_id: String(x.pro_id),
        score: Math.max(0, Math.min(100, Number(x.score) || 0)),
        reason: typeof x.reason === "string" ? x.reason.slice(0, 160) : "",
      }))
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({ ranked });
  } catch (e) {
    console.error("recommend-pros error:", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
