export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { account_number, bank_code } = req.body;
    if (!account_number || !bank_code) {
      return res.status(400).json({ error: "Missing account_number or bank_code" });
    }

    const response = await fetch("https://api.flutterwave.com/v3/accounts/resolve", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_number, account_bank: bank_code }),
    });

    const data = await response.json();
    if (data.status !== "success") {
      return res.status(400).json({ error: data.message || "Could not verify this account" });
    }

    return res.status(200).json({ account_name: data.data.account_name });

  } catch (err) {
    console.error("flw-resolve-account error:", err);
    return res.status(500).json({ error: err.message });
  }
}
