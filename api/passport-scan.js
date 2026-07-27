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

Return ONLY a JSON object — no markdown, no commentary. For each key, pick EXACTLY ONE value from its list, or use null if you genuinely cannot tell from the photo:

face_shape: ${ALLOWED.face_shape.join(" | ")}
hair_type: ${ALLOWED.hair_type.join(" | ")}
hair_density: ${ALLOWED.hair_density.join(" | ")}
hairline: ${ALLOWED.hairline.join(" | ")}
skin_tone: ${ALLOWED.skin_tone.join(" | ")}
skin_type: ${ALLOWED.skin_type.join(" | ")}
beard_style: ${ALLOWED.beard_style.join(" | ")}

Also include:
confidence: a number from 0 to 1 for overall reliability
note: one short, friendly sentence for the user (max 16 words)

Rules: Never infer medical or health conditions. If the image is dark, blurry, or the face isn't clearly visible, set fields to null and lower the confidence. Output the JSON object only.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
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

    // Whitelist: only genuine enum values pass through; everything else -> null.
    const result = {};
    for (const key of Object.keys(ALLOWED)) {
      result[key] = ALLOWED[key].includes(parsed[key]) ? parsed[key] : null;
    }
    result.confidence = typeof parsed.confidence === "number" ? parsed.confidence : null;
    result.note = typeof parsed.note === "string" ? parsed.note.slice(0, 140) : null;

    return res.status(200).json(result);
  } catch (e) {
    console.error("passport-scan error:", e);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
