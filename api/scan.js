// api/scan.js — serverless function for the AI Style Scanner.
// Receives a base64 image + scanType, sends it to Claude's vision API,
// and returns structured style analysis as JSON.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured in Vercel' });
  }

  const { scanType, image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });

  const prompts = {
    face: "Analyze this person's face shape. Identify the face shape (oval, round, square, heart, oblong, or diamond).",
    hair: "Analyze this person's hair. Identify the hair type/texture (e.g. type 3C curly, type 4C coily, straight, wavy).",
    nails: "Analyze the nails in this image. Identify the nail shape and condition.",
    skin: "Analyze this person's skin tone and undertone (warm, cool, or neutral)."
  };

  // "full" is a single comprehensive selfie scan — face + hair + skin (+ beard
  // if visible) together, with richer per-category recommendations. Nails still
  // needs its own separate scan (a different photo of the hand).
  if (scanType === 'full') return handleFullScan(req, res, image);

  const instruction = prompts[scanType] || prompts.face;

  const systemPrompt = `You are a professional beauty consultant for STYLEX, a Nigerian beauty marketplace. ${instruction}

Respond ONLY with a valid JSON object (no markdown, no backticks) in exactly this shape:
{
  "type": "the identified type/shape in a few words",
  "description": "a warm, encouraging 1-2 sentence description",
  "styles": ["style 1", "style 2", "style 3", "style 4"],
  "tips": "one practical beauty tip relevant to what you see"
}

IMPORTANT for "styles": give 4 specific, well-known style names that would return good photo results if searched online (e.g. "knotless box braids", "soft glam makeup", "almond acrylic nails", "taper fade"). Keep each style name 2-4 words, real and searchable — not vague descriptions. Tailor them to Nigerian/African beauty where relevant.

If the image is unclear or doesn't show what's needed, still return the JSON with your best guess and mention it gently in the description.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: 'Analyze this image and respond with the JSON only.' }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    let text = data.content[0].text.trim();
    text = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: 'Could not read the analysis. Please try again.' });
    }
    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Same enum values as api/passport-scan.js, so a full scan's results can be
// saved straight into beauty_passports without any transformation.
const FULL_SCAN_ALLOWED = {
  face_shape:   ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Triangle"],
  hair_type:    ["Type 1 · Straight", "Type 2 · Wavy", "Type 3A · Loose Curls", "Type 3B · Springy Curls", "Type 3C · Tight Curls", "Type 4A · Soft Coils", "Type 4B · Z-Pattern Coils", "Type 4C · Tight Coils"],
  hair_density: ["Low", "Medium", "High"],
  hairline:     ["Straight", "Rounded", "Widow's Peak", "M-Shaped", "Receding"],
  skin_tone:    ["Fair", "Light", "Medium", "Olive", "Tan", "Caramel", "Deep", "Ebony"],
  skin_type:    ["Normal", "Oily", "Dry", "Combination", "Sensitive"],
  beard_style:  ["None", "Clean Shaven", "Stubble", "Short Beard", "Full Beard", "Goatee", "Van Dyke"],
};

async function handleFullScan(req, res, image) {
  const prompt =
`You are a professional beauty consultant for STYLEX, a Nigerian beauty marketplace. Analyze this selfie comprehensively — face shape, hair, and skin together (and beard, if visible) — and recommend real, specific styles.

Return ONLY a JSON object, no markdown, no backticks, shaped exactly like this:
{
  "face_shape": "<one of: ${FULL_SCAN_ALLOWED.face_shape.join(" | ")}>",
  "hair_type": "<one of: ${FULL_SCAN_ALLOWED.hair_type.join(" | ")}>",
  "hair_density": "<one of: ${FULL_SCAN_ALLOWED.hair_density.join(" | ")}>",
  "hairline": "<one of: ${FULL_SCAN_ALLOWED.hairline.join(" | ")}>",
  "skin_tone": "<one of: ${FULL_SCAN_ALLOWED.skin_tone.join(" | ")}>",
  "skin_type": "<one of: ${FULL_SCAN_ALLOWED.skin_type.join(" | ")}>",
  "beard_style": "<one of: ${FULL_SCAN_ALLOWED.beard_style.join(" | ")}, or null if not visible/not applicable>",
  "confidence": <0 to 1, overall reliability of this read>,
  "confidence_note": "<one short sentence on why, e.g. lighting/angle>",
  "summary": "<a warm, encouraging 1-2 sentence overview>",
  "hairstyles": ["4 specific, real, searchable hairstyle names suited to this hair type and face shape"],
  "beard_styles": ["2-4 specific beard/grooming style names — ONLY if beard_style is not null, otherwise an empty array"],
  "makeup_looks": ["4 specific, real, searchable makeup look names suited to this skin tone"],
  "skincare_routine": ["3-5 short, generic, non-medical skincare routine steps suited to this skin type — no product brand names, no medical claims"],
  "colour_recommendations": ["3-4 colour suggestions for hair colour or clothing tones that would suit this skin tone"]
}

Rules:
- Every style/look name must be 2-4 words, real and specific enough to search for online (e.g. "knotless box braids", "soft glam makeup"), not vague descriptions. Tailor them to Nigerian/African beauty where relevant.
- Never diagnose or infer medical or health conditions. Skincare suggestions are cosmetic routine steps only (cleanse, moisturize, SPF, etc.), never treatment advice.
- If a field genuinely can't be read from the photo (bad lighting, angle, partially out of frame), set it to null rather than guessing, and lower the confidence.
- Output the JSON object only.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 900,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    let text = data.content[0].text.trim();
    text = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: 'Could not read the analysis. Please try again.' });
    }

    // Whitelist the enum fields so a "Save to Beauty Passport" action can
    // never write an invented value.
    const result = {};
    for (const key of Object.keys(FULL_SCAN_ALLOWED)) {
      result[key] = FULL_SCAN_ALLOWED[key].includes(parsed[key]) ? parsed[key] : null;
    }
    result.confidence = typeof parsed.confidence === 'number' ? parsed.confidence : null;
    result.confidence_note = typeof parsed.confidence_note === 'string' ? parsed.confidence_note.slice(0, 160) : null;
    result.summary = typeof parsed.summary === 'string' ? parsed.summary.slice(0, 300) : null;
    for (const listKey of ['hairstyles', 'beard_styles', 'makeup_looks', 'skincare_routine', 'colour_recommendations']) {
      result[listKey] = Array.isArray(parsed[listKey]) ? parsed[listKey].filter(s => typeof s === 'string').slice(0, 5) : [];
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}