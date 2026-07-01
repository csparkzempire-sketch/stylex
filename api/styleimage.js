// api/styleimage.js — returns a real photo URL for a style name.
// Uses the free Unsplash API. Requires an UNSPLASH_ACCESS_KEY env var in Vercel.
// If the key is missing or nothing is found, returns { url: null } so the
// frontend shows its fallback placeholder instead of breaking.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body || {};
  if (!query) return res.status(200).json({ url: null });

  // No key configured yet — return null so the app shows its safe fallback.
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return res.status(200).json({ url: null });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await response.json();
    if (data && data.results && data.results.length > 0) {
      // small = fast-loading, good enough for a thumbnail
      return res.status(200).json({ url: data.results[0].urls.small });
    }
    return res.status(200).json({ url: null });
  } catch (error) {
    // Never fail hard — the frontend has a fallback.
    return res.status(200).json({ url: null });
  }
}