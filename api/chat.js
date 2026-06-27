// In-memory rate limiting (resets when the function cold-starts).
// Limits each visitor (by IP) to a set number of messages per hour.
const rateLimits = {};
const MAX_MESSAGES_PER_HOUR = 15;
const HOUR_MS = 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured in Vercel' });
  }

  // ---- RATE LIMITING ----
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const now = Date.now();
  const record = rateLimits[ip];

  if (!record || now - record.start > HOUR_MS) {
    // New window
    rateLimits[ip] = { count: 1, start: now };
  } else {
    record.count += 1;
    if (record.count > MAX_MESSAGES_PER_HOUR) {
      return res.status(429).json({
        error:
          "You've reached the message limit for now. Please try again in a little while, or contact Stylex support for more help."
      });
    }
  }

  const { messages } = req.body;

  // ---- STYLEX KNOWLEDGE BASE ----
  // This is what makes the assistant actually knowledgeable about Stylex.
  // Edit the details below to match your real services, pricing, and policies.
  const STYLEX_IDENTITY = `You are the Stylex Assistant, the friendly customer-support chatbot for Stylex — an AI-powered beauty marketplace based in Nigeria that connects clients with verified beauty professionals.

ABOUT STYLEX:
- Stylex is a marketplace app where clients discover, book, and pay beauty professionals for services.
- Service categories include: Hair, Makeup, Barbing, Nails, and Lashes.
- Professionals on Stylex are verified (shown with a checkmark) so clients can book with confidence.
- Clients can browse a feed of work samples/videos from professionals, like and comment, and tap "Book Now" to book.

HOW BOOKING WORKS:
1. The client opens the app and logs into their account.
2. They browse or search for the service they need (e.g., Hair, Makeup, Nails).
3. They view a professional's profile, work samples, and reviews.
4. They tap "Book Now", choose a date/time, and confirm the booking.
5. They can view and manage all their bookings on the Bookings tab.

APP NAVIGATION (bottom menu):
- Home: feed of beauty professionals and their work
- Explore: search and discover services/professionals
- Bookings: view and manage your appointments
- Profile: your account, saved professionals, and settings

HOW TO ANSWER:
- Be warm, friendly, and concise. Use a touch of emoji where natural, not excessively.
- Help with: booking questions, finding services/professionals, how the app works, and general guidance.
- If a client asks about their specific account details (their bookings, payments, refunds) that you can't see, kindly direct them to check the relevant tab (e.g., Bookings or Profile) or contact Stylex support.
- If asked something unrelated to Stylex or beauty services, gently steer the conversation back to how you can help them with Stylex.
- Never make up specific prices or availability — these vary by professional. If asked about price, explain that pricing is set by each professional and shown on their profile.
- Keep answers focused and not overly long.`;

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
        max_tokens: 500,
        system: STYLEX_IDENTITY,
        messages: messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}