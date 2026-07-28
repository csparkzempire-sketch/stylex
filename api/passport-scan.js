// ============================================================
// STYLEX · /api/passport-scan
// POST a selfie -> Claude vision -> structured Beauty Passport
// attributes, locked to the exact values the passport form uses.
//
// Env needed: ANTHROPIC_API_KEY  (same one /api/scan.js already uses)
// ============================================================

// The allowed values MUST match the <select> options in BeautyPassport.jsx.
// The endpoint whitelists against these, so only valid values ever reach the form.
const ALLOWED = {
  face_shape:   ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Triangle"],
  hair_type:    ["Type 1 · Straight", "Type 2 · Wavy", "Type 3A · Loose Curls", "Type 3B · Springy Curls", "Type 3C · Tight Curls", "Type 4A · Soft Coils", "Type 4B · Z-Pattern Coils", "Type 4C · Tight Coils"],
  hair_density: ["Low", "Medium", "High"],
  hairline:     ["Straight", "Rounded", "Widow's Peak", "M-Shaped", "Receding"],
  skin_tone:    ["Fair", "Light", "Medium", "Olive", "Tan", "Caramel", "Deep", "Ebony"],
  skin_type:    ["Normal", "Oily", "Dry", "Combination", "Sensitive"],
  beard_style:  ["None", "Clean Shaven", "Stubble", "Short Beard", "Full Beard", "Goatee", "Van Dyke"],
};

// A field only survives into the response if the model's own confidence
// in that specific field clears this bar — otherwise it's left null so a
// shaky guess never silently overwrites what the user typed.
const FIELD_CONFIDENCE_THRESHOLD = 0.6;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured in Vercel" });
  }

  try {
    const { image, mediaType } = req.body || {};
    if (!image) return res.status(400).json({ error: "No image provided." });

    // Accept a data URL or a raw base64 string.
    const base64 = image.includes(",") ? image.split(",")[1] : image;
    const media = mediaType || "image/jpeg";

    const prompt =
`You are a cosmetic styling assistant for Stylex (not medical). Look at this selfie and describe the person's visible beauty attributes for their profile.

Return ONLY a JSON object — no markdown, no commentary. For each of these keys, pick EXACTLY ONE value from its list, or null if you cannot tell from the photo:

face_shape: ${ALLOWED.face_shape.join(" | ")}
hair_type: ${ALLOWED.hair_type.join(" | ")}
hair_density: ${ALLOWED.hair_density.join(" | ")}
hairline: ${ALLOWED.hairline.join(" | ")}
skin_tone: ${ALLOWED.skin_tone.join(" | ")}
skin_type: ${ALLOWED.skin_type.join(" | ")}
beard_style: ${ALLOWED.beard_style.join(" | ")}

Also return a "confidences" object with one entry per key above, each a number from 0 to 1 for how sure you are of THAT specific field — judge each independently, not just an overall impression. And a "note": one short, friendly sentence for the user (max 16 words).

Rules:
- Never infer medical or health conditions.
- Be conservative: if you are not genuinely confident about a field, set its value to null and give it a low confidence score rather than guessing a plausible-sounding answer.
- Hair density, hairline, and skin type are the easiest to get wrong from a single photo — only commit to them when the photo clearly shows enough to judge, otherwise null.
- If the image overall is dark, blurry, at a bad angle, or the face isn't clearly visible, set the affected fields to null and their confidences low.

Respond with the JSON object only, shaped like:
{"face_shape": "...", "hair_type": "...", "hair_density": "...", "hairline": "...", "skin_tone": "...", "skin_type": "...", "beard_style": "...", "confidences": {"face_shape": 0.0, "hair_type": 0.0, "hair_density": 0.0, "hairline": 0.0, "skin_tone": 0.0, "skin_type": 0.0, "beard_style": 0.0}, "note": "..."}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        temperature: 0,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: media, data: base64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      console.error("Anthropic error:", anthropicRes.status, detail);
      return res.status(502).json({ error: "Scan failed. Try a clearer, well-lit photo." });
    }

    const data = await anthropicRes.json();
    const raw = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    // Strip any accidental code fences, then parse.
    const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error("Unparseable model output:", raw);
      return res.status(502).json({ error: "Couldn't read the scan result. Try again." });
    }

    // Whitelist: only genuine enum values pass through, and only when the
    // model's own per-field confidence clears the bar — everything else -> null.
    const confidences = parsed.confidences && typeof parsed.confidences === "object" ? parsed.confidences : {};
    const result = {};
    for (const key of Object.keys(ALLOWED)) {
      const value = ALLOWED[key].includes(parsed[key]) ? parsed[key] : null;
      const fieldConfidence = typeof confidences[key] === "number" ? confidences[key] : 0;
      result[key] = value !== null && fieldConfidence >= FIELD_CONFIDENCE_THRESHOLD ? value : null;
    }
    const scoredConfidences = Object.keys(ALLOWED).map((k) => confidences[k]).filter((c) => typeof c === "number");
    result.confidence = scoredConfidences.length
      ? scoredConfidences.reduce((a, b) => a + b, 0) / scoredConfidences.length
      : null;
    result.note = typeof parsed.note === "string" ? parsed.note.slice(0, 140) : null;

    return res.status(200).json(result);
  } catch (e) {
    console.error("passport-scan error:", e);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
