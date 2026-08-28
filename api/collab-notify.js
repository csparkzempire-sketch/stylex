import { getCaller } from "../lib/auth.js";

const APP_URL = process.env.APP_URL || "https://app.stylex.pro";

// Emails render user-supplied text as HTML, so anything interpolated below has
// to be escaped or a sender could inject markup into the message.
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Also handles friend-invite emails (kind: "invite") — folded in here rather
// than a separate function file to stay under Vercel Hobby's 12-function cap.
async function sendInviteEmail(req, res) {
  const { friend_email } = req.body;
  if (!friend_email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Was open to anyone: an unauthenticated caller could send mail from the
  // STYLEX domain to any address, with a link of their choosing.
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ error: "Sign in required" });

  // Built server-side from the caller's own id — never taken from the body,
  // so an invite can't be turned into a link to somewhere else.
  const referral_link = `${APP_URL}/?ref=${caller.id}`;
  const inviter_name = req.body.inviter_name;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "STYLEX <onboarding@resend.dev>",
      to: [friend_email],
      subject: `${inviter_name || "A friend"} invited you to STYLEX ✨`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0A0A0B; color: #F0EDE8; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">

          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #C9A84C; font-family: Georgia, serif;">STYLEX</div>
            <div style="font-size: 11px; color: #888898; letter-spacing: 3px; margin-top: 4px;">BEAUTY MARKETPLACE</div>
            <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #C9A84C, #E8D08A); margin: 12px auto 0;"></div>
          </div>

          <div style="background: #16161C; border: 1px solid #2A2A35; border-radius: 14px; padding: 28px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 22px; margin-bottom: 10px;">💌</div>
            <div style="font-size: 18px; font-weight: 800; color: #C9A84C; margin-bottom: 8px;">${esc(inviter_name || "A friend")} thinks you'd love STYLEX</div>
            <div style="font-size: 14px; color: #F0EDE8cc; line-height: 1.7;">Book trusted beauty professionals near you, or list your own services and start getting bookings.</div>
          </div>

          <a href="${esc(referral_link)}" style="display: block; background: linear-gradient(135deg, #C9A84C, #E8D08A); color: #0A0A0B; text-align: center; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
            Join STYLEX →
          </a>

          <div style="text-align: center; font-size: 11px; color: #888898; line-height: 1.7;">
            If you weren't expecting this, you can safely ignore this email.
          </div>

        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Failed to send invite" });
  }

  return res.status(200).json({ success: true });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (req.body?.kind === "invite") return await sendInviteEmail(req, res);

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
              <div style="font-size: 20px; font-weight: 800; color: #C9A84C; margin-bottom: 4px;">${esc(company_name)}</div>
              <div style="font-size: 13px; color: #888898; text-transform: capitalize;">Request type: ${esc(request_type || "collaboration")}</div>
            </div>

            <div style="background: #16161C; border: 1px solid #2A2A35; border-radius: 14px; padding: 24px; margin-bottom: 20px;">
              <div style="font-size: 11px; color: #888898; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">CONTACT EMAIL</div>
              <a href="mailto:${esc(contact_email)}" style="font-size: 15px; color: #C9A84C; font-weight: 700; text-decoration: none;">📧 ${esc(contact_email)}</a>
            </div>

            <div style="background: #16161C; border: 1px solid #2A2A35; border-radius: 14px; padding: 24px; margin-bottom: 28px;">
              <div style="font-size: 11px; color: #888898; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">THEIR MESSAGE</div>
              <div style="font-size: 14px; color: #F0EDE8; line-height: 1.7;">${esc(message || "No message provided")}</div>
            </div>

            <a href="mailto:${esc(contact_email)}?subject=Re: Partnership with STYLEX" style="display: block; background: linear-gradient(135deg, #C9A84C, #E8D08A); color: #0A0A0B; text-align: center; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
              Reply to ${esc(company_name)} →
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