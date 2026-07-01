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