export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { company_name, contact_email, request_type, message } = req.body;

    if (!company_name || !contact_email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const typeEmoji = {
      collaboration: "🤝",
      promotion: "📣",
      advertisement: "📢",
    }[request_type] || "📩";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "STYLEX Partnerships <onboarding@resend.dev>",
        to: ["c.sparkz.empire@gmail.com"],
        subject: `${typeEmoji} New Partnership Request from ${company_name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0A0A0B; color: #F0EDE8; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #C9A84C; font-family: Georgia, serif;">STYLEX</div>
              <div style="font-size: 11px; color: #888898; letter-spacing: 3px; margin-top: 4px;">PARTNERSHIP REQUEST</div>
              <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #C9A84C, #E8D08A); margin: 12px auto 0;"></div>
            </div>

            <div style="background: #16161C; border: 1px solid #2A2A35; border-radius: 14px; padding: 28px; margin-bottom: 20px;">
              <div style="font-size: 22px; margin-bottom: 6px;">${typeEmoji}</div>
              <div style="font-size: 20px; font-weight: 800; color: #C9A84C; margin-bottom: 4px;">${company_name}</div>
              <div style="font-size: 13px; color: #888898; text-transform: capitalize;">Request type: ${request_type || "collaboration"}</div>
            </div>

            <div style="background: #16161C; border: 1px solid #2A2A35; border-radius: 14px; padding: 24px; margin-bottom: 20px;">
              <div style="font-size: 11px; color: #888898; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">CONTACT EMAIL</div>
              <a href="mailto:${contact_email}" style="font-size: 15px; color: #C9A84C; font-weight: 700; text-decoration: none;">📧 ${contact_email}</a>
            </div>

            <div style="background: #16161C; border: 1px solid #2A2A35; border-radius: 14px; padding: 24px; margin-bottom: 28px;">
              <div style="font-size: 11px; color: #888898; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">THEIR MESSAGE</div>
              <div style="font-size: 14px; color: #F0EDE8; line-height: 1.7;">${message || "No message provided"}</div>
            </div>

            <a href="mailto:${contact_email}?subject=Re: Partnership with STYLEX" style="display: block; background: linear-gradient(135deg, #C9A84C, #E8D08A); color: #0A0A0B; text-align: center; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
              Reply to ${company_name} →
            </a>

            <div style="text-align: center; font-size: 11px; color: #888898; line-height: 1.7;">
              You can also view and manage this request in your<br/>
              <a href="https://stylex-mauve.vercel.app/admin" style="color: #C9A84C;">STYLEX Admin Panel → Partnerships</a>
            </div>

          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("collab-notify error:", err);
    return res.status(500).json({ error: err.message });
  }
}