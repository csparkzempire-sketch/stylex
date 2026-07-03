export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    // Filter out the initial assistant greeting (Claude API needs user message first)
    const filtered = messages.filter(m => !(m.role === "assistant" && messages.indexOf(m) === 0));

    // Make sure we have at least one message
    if (!filtered || filtered.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: "You are STYLEX's friendly beauty assistant. You help users discover hairstyles, makeup looks, skincare routines, and find the right beauty professional for them. Keep answers short, warm, and practical. You serve a global audience but know Nigeria's beauty market well. Never recommend specific products by brand name — focus on styles, techniques and tips.",
        messages: filtered.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content || m.text || ""
        }))
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return res.status(500).json({ error: "AI service error", detail: errText });
    }

    const data = await response.json();
    const reply = data.content && data.content[0] && data.content[0].text;

    return res.status(200).json({ reply: reply || "I'm not sure about that — try asking me about hairstyles, makeup or skincare!" });

  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Something went wrong: " + err.message });
  }
}