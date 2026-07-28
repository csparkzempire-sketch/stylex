import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/* ============================================================
   STYLEX · Smart Recommendations  ("Matched for You")
   Loads the user's Beauty Passport + a shortlist of candidate
   pros from `profiles` (user_type = "professional"), sends them
   to /api/recommend-pros, and shows ranked matches each with a
   "why this fits you" reason.

   Pros live in the same `profiles` table as clients (see
   AddProPanel in AdminDashboard_1.jsx) — there is no separate
   "professionals" table.
   ============================================================ */

const RECOMMEND_ENDPOINT = "/api/recommend-pros";
const CANDIDATE_POOL_SIZE = 30; // fetched before narrowing/ranking
const MAX_CANDIDATES = 20;      // sent to the model

/* ===================== DATA LAYER ========================== */
async function loadPassport(userId) {
  const { data, error } = await supabase
    .from("beauty_passports").select("*").eq("user_id", userId).maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}

// The client's own location/country, used only as soft context for
// matching — never as a hard filter that can zero out results.
async function loadClientLocation(userId) {
  const { data, error } = await supabase
    .from("profiles").select("location, country").eq("id", userId).maybeSingle();
  if (error) { console.error(error); return { location: null, country: null }; }
  return { location: data?.location || null, country: data?.country || null };
}

const normCountry = (c) => (c || "").trim().toUpperCase();

async function loadCandidatePros(clientCountry) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, category, location, country, bio, shop_price, mobile_price, services, avatar_url, is_verified, is_available, years_experience, languages, certifications, intro_video_url")
    .eq("user_type", "professional")
    .order("is_verified", { ascending: false })
    .limit(CANDIDATE_POOL_SIZE);
  if (error) { console.error(error); return []; }

  let pros = data || [];

  // Soft location narrowing: only apply if BOTH sides normalise to a real
  // country code and it doesn't wipe out the pool. Country data here is a
  // mix of sources (some rows store a 2-letter code, some store nothing),
  // so a hard filter previously hid every pro when it compared a full
  // country name against a 2-letter code. Never repeat that — narrow only
  // when it's safe, otherwise fall back to the full pool.
  const target = normCountry(clientCountry);
  if (target) {
    const narrowed = pros.filter((p) => normCountry(p.country) === target);
    if (narrowed.length > 0) pros = narrowed;
  }

  const shortlisted = pros.slice(0, MAX_CANDIDATES);

  // One batched query for repeat-customer % — same pattern as the Explore
  // screen's loadPros, avoids an N+1 query per card.
  const proIds = shortlisted.map((p) => p.id);
  let repeatByPro = {};
  if (proIds.length > 0) {
    const { data: bookingRows } = await supabase
      .from("bookings").select("pro_id, client_id").eq("status", "confirmed").in("pro_id", proIds);
    if (bookingRows) {
      const clientsByPro = {};
      for (const b of bookingRows) {
        if (!b.pro_id || !b.client_id) continue;
        (clientsByPro[b.pro_id] ||= []).push(b.client_id);
      }
      for (const [proId, clientIds] of Object.entries(clientsByPro)) {
        const counts = {};
        for (const cid of clientIds) counts[cid] = (counts[cid] || 0) + 1;
        const uniqueClients = Object.keys(counts).length;
        const repeatClients = Object.values(counts).filter((c) => c > 1).length;
        repeatByPro[proId] = uniqueClients > 0 ? Math.round((repeatClients / uniqueClients) * 100) : 0;
      }
    }
  }

  return shortlisted.map((p) => ({
    id: p.id,
    name: p.full_name || p.username || "Pro",
    specialties: p.services || p.category || null,
    price_range: p.shop_price || p.mobile_price
      ? `₦${Number(p.shop_price || p.mobile_price).toLocaleString()}+`
      : null,
    location: p.location || null,
    bio: p.bio || null,
    verified: p.is_verified === true,
    avatar_url: p.avatar_url || null,
    years_experience: p.years_experience || null,
    languages: p.languages ? p.languages.split(",").map((s) => s.trim()).filter(Boolean) : [],
    certifications: p.certifications ? p.certifications.split(",").map((s) => s.trim()).filter(Boolean) : [],
    intro_video_url: p.intro_video_url || null,
    repeat_customer_pct: repeatByPro[p.id] ?? null,
  }));
}

async function getRecommendations(passport, clientLocation, pros) {
  const resp = await fetch(RECOMMEND_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      passport: { ...passport, client_location: clientLocation.location, client_country: clientLocation.country },
      pros,
    }),
  });
  if (!resp.ok) throw new Error("rank_failed");
  const out = await resp.json();
  return out.ranked || [];
}

/* ===================== THEME =============================== */
const C = {
  ink: "#0A0A0B", panel: "#141416", panel2: "#1B1B1E",
  gold: "#C9A24B", goldSoft: "#E6C877", text: "#F3F0E9",
  muted: "#8E8A80", line: "rgba(201,162,75,0.22)", lineSoft: "rgba(255,255,255,0.06)",
};
const serif = "'Bodoni Moda','Playfair Display',Georgia,serif";
const sans = "'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif";

/* ===================== PRO CARD ============================
   No shared pro-card component exists in the app yet (Explore/Home
   inline their own cards), so this stays self-contained — styled to
   match the Beauty Passport screen it sits next to. */
function ProCard({ pro, reason, rank }) {
  const initials = (pro.name || "P").slice(0, 2).toUpperCase();
  const [showVideo, setShowVideo] = useState(false);
  const hasStats = pro.years_experience || (pro.repeat_customer_pct != null);
  return (
    <div style={{ display: "flex", gap: 14, padding: 16, borderRadius: 14,
      border: `1px solid ${C.lineSoft}`, background: C.panel, marginBottom: 14 }}>
      <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 12, overflow: "hidden",
        background: "rgba(201,162,75,0.08)", border: `1px solid ${C.line}`,
        display: "grid", placeItems: "center", fontFamily: serif, color: C.goldSoft, fontSize: 16 }}>
        {pro.avatar_url ? (
          <img src={pro.avatar_url} alt={pro.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: sans }}>#{rank}</span>
          <span style={{ fontFamily: serif, fontSize: 17, color: C.text }}>{pro.name}</span>
          {pro.verified && <span title="Verified" style={{ color: C.gold, fontSize: 13 }}>✔</span>}
          {pro.intro_video_url && (
            <button onClick={() => setShowVideo((v) => !v)} style={{ background: "rgba(201,162,75,0.08)", border: `1px solid ${C.line}`, borderRadius: 20, padding: "1px 7px", fontSize: 10, color: C.gold, cursor: "pointer" }}>▶ Intro</button>
          )}
        </div>
        {pro.specialties && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{pro.specialties}</div>}
        <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12, color: C.muted }}>
          {pro.price_range && <span>{pro.price_range}</span>}
          {pro.location && <span>· {pro.location}</span>}
        </div>

        {showVideo && pro.intro_video_url && (
          <video src={pro.intro_video_url} controls autoPlay style={{ width: "100%", borderRadius: 8, marginTop: 8, maxHeight: 180, background: "#000" }} />
        )}

        {hasStats && (
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: C.muted }}>
            {pro.years_experience ? <span>🎖 {pro.years_experience}+ yrs</span> : null}
            {pro.repeat_customer_pct != null ? <span>🔁 {pro.repeat_customer_pct}% repeat</span> : null}
          </div>
        )}

        {pro.languages && pro.languages.length > 0 && (
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>🗣 {pro.languages.join(", ")}</div>
        )}

        {pro.certifications && pro.certifications.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {pro.certifications.map((c) => (
              <span key={c} style={{ fontSize: 10, color: C.goldSoft, background: "rgba(201,162,75,0.06)", border: `1px solid ${C.line}`, borderRadius: 4, padding: "2px 8px" }}>🏅 {c}</span>
            ))}
          </div>
        )}

        {reason && (
          <div style={{ marginTop: 10, padding: "8px 11px", borderRadius: 8, fontSize: 12.5, lineHeight: 1.5,
            color: C.text, background: "rgba(201,162,75,0.06)", border: `1px solid ${C.line}` }}>
            <span style={{ color: C.goldSoft, fontWeight: 600 }}>Why this fits you · </span>{reason}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== MAIN =============================== */
export default function SmartRecommendations({ userId }) {
  const [state, setState] = useState("loading"); // loading | ready | no_passport | empty | error
  const [items, setItems] = useState([]); // [{ ...pro, reason, score }]

  useEffect(() => {
    if (!userId) { setState("error"); return; }
    let alive = true;
    (async () => {
      try {
        const [passport, clientLocation] = await Promise.all([
          loadPassport(userId),
          loadClientLocation(userId),
        ]);
        if (!passport) { if (alive) setState("no_passport"); return; }

        const pros = await loadCandidatePros(clientLocation.country);
        if (!pros || pros.length === 0) { if (alive) setState("empty"); return; }

        let ranked = [];
        try { ranked = await getRecommendations(passport, clientLocation, pros); }
        catch { ranked = []; } // endpoint down: fall back to unranked pros, no reasons

        const byId = Object.fromEntries(pros.map((p) => [String(p.id), p]));
        const merged = ranked.length
          ? ranked.map((r) => ({ ...byId[r.pro_id], reason: r.reason, score: r.score })).filter((x) => x && x.id)
          : pros.map((p) => ({ ...p, reason: "", score: null }));

        if (alive) { setItems(merged); setState(merged.length ? "ready" : "empty"); }
      } catch (e) {
        console.error(e);
        if (alive) setState("error");
      }
    })();
    return () => { alive = false; };
  }, [userId]);

  return (
    <div style={{ minHeight: "100%", background: C.ink, padding: "34px 16px", fontFamily: sans }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.34em", color: C.gold, textTransform: "uppercase" }}>Stylex</div>
          <h1 style={{ margin: "8px 0 4px", fontFamily: serif, fontSize: 30, fontWeight: 500, color: C.text }}>Matched for You</h1>
          <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            Professionals picked from your Beauty Passport.
          </p>
        </div>

        {state === "loading" && <div style={{ color: C.muted, padding: "40px 0", textAlign: "center" }}>Finding your matches…</div>}

        {state === "no_passport" && (
          <div style={{ padding: 22, borderRadius: 14, border: `1px solid ${C.line}`, background: C.panel, textAlign: "center" }}>
            <div style={{ fontFamily: serif, fontSize: 18, color: C.text, marginBottom: 6 }}>Fill your Beauty Passport first</div>
            <div style={{ fontSize: 13, color: C.muted }}>We match pros to your face shape, hair, skin tone, styles and budget.</div>
          </div>
        )}

        {state === "empty" && (
          <div style={{ color: C.muted, padding: "40px 0", textAlign: "center" }}>No professionals to match yet.</div>
        )}

        {state === "error" && (
          <div style={{ color: "#E7A6A6", padding: "40px 0", textAlign: "center" }}>Couldn't load recommendations. Pull to refresh.</div>
        )}

        {state === "ready" && items.map((pro, i) => (
          <ProCard key={pro.id} pro={pro} reason={pro.reason} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
