export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const response = await fetch("https://api.flutterwave.com/v3/banks/NG", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.status !== "success") {
      return res.status(500).json({ error: "Failed to load bank list" });
    }

    const banks = (data.data || []).map(b => ({ code: b.code, name: b.name }));
    return res.status(200).json({ banks });

  } catch (err) {
    console.error("flw-banks error:", err);
    return res.status(500).json({ error: err.message });
  }
}
