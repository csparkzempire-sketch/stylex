import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

/* ============================================================
   STYLEX · Beauty Passport  (v2 — with AI selfie autofill)
   Tap "Autofill from selfie" -> Claude vision reads face shape,
   hair type, skin tone, etc. and pre-fills the form. User reviews,
   then saves.
   ============================================================ */

const SCAN_ENDPOINT = "/api/passport-scan";

/* ===================== PERSISTENCE ========================== */
async function loadPassport(userId) {
  const { data, error } = await supabase
    .from("beauty_passports").select("*").eq("user_id", userId).maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}
async function savePassport(userId, data) {
  const payload = { ...data, user_id: userId, updated_at: new Date().toISOString() };
  const { data: saved, error } = await supabase
    .from("beauty_passports").upsert(payload, { onConflict: "user_id" }).select().maybeSingle();
  if (error) { console.error(error); throw error; }
  return saved;
}

/* ===================== IMAGE HELPER ========================
   Downscale before upload so we stay under Vercel's body limit
   and keep the scan fast + cheap. */
function fileToScaledDataURL(file, maxDim = 1024, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > height && width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
      else if (height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Bad image")); };
    img.src = url;
  });
}

/* ===================== OPTIONS ============================== */
const FACE_SHAPES = ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Triangle"];
const HAIR_TYPES = [
  "Type 1 · Straight", "Type 2 · Wavy",
  "Type 3A · Loose Curls", "Type 3B · Springy Curls", "Type 3C · Tight Curls",
  "Type 4A · Soft Coils", "Type 4B · Z-Pattern Coils", "Type 4C · Tight Coils",
];
const HAIR_DENSITY = ["Low", "Medium", "High"];
const HAIRLINES = ["Straight", "Rounded", "Widow's Peak", "M-Shaped", "Receding"];
const SKIN_TONES = [
  { label: "Fair", hex: "#F1D6BE" }, { label: "Light", hex: "#E5B893" },
  { label: "Medium", hex: "#C88E5E" }, { label: "Olive", hex: "#A9784B" },
  { label: "Tan", hex: "#8B5A34" }, { label: "Caramel", hex: "#6E4227" },
  { label: "Deep", hex: "#4E2C18" }, { label: "Ebony", hex: "#31190D" },
];
const SKIN_TYPES = ["Normal", "Oily", "Dry", "Combination", "Sensitive"];
const NAIL_SHAPES = ["Square", "Squoval", "Round", "Oval", "Almond", "Coffin", "Stiletto"];
const BEARD_STYLES = ["None", "Clean Shaven", "Stubble", "Short Beard", "Full Beard", "Goatee", "Van Dyke"];
const CURRENCIES = ["NGN", "USD", "GHS", "KES", "GBP", "EUR"];

/* ===================== THEME =============================== */
const C = {
  ink: "#0A0A0B", panel: "#141416", panel2: "#1B1B1E",
  gold: "#C9A24B", goldSoft: "#E6C877", text: "#F3F0E9",
  muted: "#8E8A80", line: "rgba(201,162,75,0.22)", lineSoft: "rgba(255,255,255,0.06)",
};
const serif = "'Bodoni Moda','Playfair Display',Georgia,serif";
const sans = "'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif";

/* ===================== SMALL PIECES ======================== */
function Field({ label, hint, glow, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <label style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: glow ? C.goldSoft : C.gold, fontFamily: sans }}>
          {label}{glow && <span style={{ marginLeft: 6, fontSize: 10 }}>✦ AI</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: C.muted, fontFamily: sans }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", padding: "11px 12px", background: C.panel2, color: value ? C.text : C.muted,
        border: `1px solid ${C.lineSoft}`, borderRadius: 8, fontSize: 14, fontFamily: sans,
        appearance: "none", cursor: "pointer", outline: "none" }}>
      <option value="">{placeholder || "Select…"}</option>
      {options.map((o) => <option key={o} value={o} style={{ color: "#111", background: "#fff" }}>{o}</option>)}
    </select>
  );
}

function ChipInput({ values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");
  const add = () => { const v = draft.trim(); if (v && !values.includes(v)) onChange([...values, v]); setDraft(""); };
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          style={{ flex: 1, padding: "11px 12px", background: C.panel2, color: C.text,
            border: `1px solid ${C.lineSoft}`, borderRadius: 8, fontSize: 14, fontFamily: sans, outline: "none" }} />
        <button onClick={add} style={{ padding: "0 16px", background: "transparent", color: C.gold,
          border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 13, fontFamily: sans, cursor: "pointer" }}>Add</button>
      </div>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
          {values.map((v) => (
            <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px",
              background: "rgba(201,162,75,0.08)", border: `1px solid ${C.line}`, borderRadius: 999,
              fontSize: 13, color: C.text, fontFamily: sans }}>
              {v}<span onClick={() => onChange(values.filter((x) => x !== v))}
                style={{ cursor: "pointer", color: C.muted, fontSize: 15, lineHeight: 1 }}>×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ index, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "34px 0 20px" }}>
      <span style={{ fontFamily: serif, fontSize: 13, color: C.gold, fontStyle: "italic" }}>{index}</span>
      <h3 style={{ margin: 0, fontFamily: serif, fontSize: 20, fontWeight: 500, color: C.text, letterSpacing: "0.01em" }}>{children}</h3>
      <div style={{ flex: 1, height: 1, background: C.lineSoft }} />
    </div>
  );
}

/* ===================== MAIN =============================== */
const EMPTY = {
  face_shape: "", hair_type: "", hair_density: "", hairline: "",
  skin_tone: "", skin_type: "", nail_shape: "", beard_style: "",
  preferred_styles: [], favourite_colours: [], budget_min: "", budget_max: "", currency: "NGN",
  style_goals: "", allergies: [], notes: "", inspiration_photos: [], consent_given: false,
};

// Which fields the scanner is allowed to fill (nails aren't visible in a selfie).
const SCAN_FIELDS = ["face_shape", "hair_type", "hair_density", "hairline", "skin_tone", "skin_type", "beard_style"];

export default function BeautyPassport({ userId }) {
  const [p, setP] = useState(EMPTY);
  const [status, setStatus] = useState("idle");     // idle | loading | saving | saved
  const [scan, setScan] = useState("idle");          // idle | scanning | done | error
  const [scanMsg, setScanMsg] = useState(null);      // note or error text
  const [scanFilled, setScanFilled] = useState([]);  // fields the AI just filled (for the ✦ glow)
  const fileRef = useRef(null);

  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      setStatus("loading");
      const data = await loadPassport(userId);
      if (alive) { if (data) setP({ ...EMPTY, ...data }); setStatus("idle"); }
    })();
    return () => { alive = false; };
  }, [userId]);

  const onPickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setScan("scanning"); setScanMsg(null); setScanFilled([]);
    try {
      const dataUrl = await fileToScaledDataURL(file);
      const resp = await fetch(SCAN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, mediaType: "image/jpeg" }),
      });
      const out = await resp.json();
      if (!resp.ok) throw new Error(out.error || "Scan failed.");

      const filled = [];
      setP((prev) => {
        const next = { ...prev };
        for (const key of SCAN_FIELDS) {
          if (out[key]) { next[key] = out[key]; filled.push(key); } // only overwrite when AI is sure
        }
        return next;
      });
      setScanFilled(filled);
      setScan("done");
      setScanMsg(out.note || (filled.length ? "Filled from your photo — review below." : "Couldn't read much — try a clearer, well-lit photo."));
    } catch (err) {
      setScan("error");
      setScanMsg(err.message || "Scan failed. Try again.");
    }
  };

  const save = async () => {
    if (!p.consent_given || !userId) return;
    setStatus("saving");
    try {
      await savePassport(userId, {
        ...p,
        budget_min: p.budget_min === "" ? null : Number(p.budget_min),
        budget_max: p.budget_max === "" ? null : Number(p.budget_max),
      });
      setStatus("saved"); setTimeout(() => setStatus("idle"), 2200);
    } catch { setStatus("idle"); }
  };

  const serial = "SX-" + String(userId || "").slice(0, 6).toUpperCase().padEnd(6, "0");
  const glowed = (k) => scanFilled.includes(k);

  return (
    <div style={{ minHeight: "100%", background: C.ink, padding: "36px 16px", fontFamily: sans }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden",
          background: `linear-gradient(160deg, ${C.panel} 0%, #0E0E10 100%)` }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "26px 28px 22px", borderBottom: `1px solid ${C.lineSoft}`,
            background: "radial-gradient(120% 140% at 100% 0%, rgba(201,162,75,0.10), transparent 60%)" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.34em", color: C.gold, textTransform: "uppercase" }}>Stylex</div>
              <h1 style={{ margin: "8px 0 0", fontFamily: serif, fontSize: 34, fontWeight: 500, color: C.text }}>Beauty Passport</h1>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.muted, maxWidth: 360, lineHeight: 1.5 }}>
                Your beauty identity, remembered across every booking. Everything below powers your recommendations.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ width: 54, height: 54, marginLeft: "auto", borderRadius: 12, border: `1px solid ${C.line}`,
                display: "grid", placeItems: "center", fontFamily: serif, fontSize: 24, color: C.goldSoft,
                background: "rgba(201,162,75,0.06)" }}>✦</div>
              <div style={{ marginTop: 10, fontSize: 10, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>No.</div>
              <div style={{ fontFamily: serif, fontSize: 14, color: C.text, letterSpacing: "0.08em" }}>{serial}</div>
            </div>
          </div>

          <div style={{ padding: "8px 28px 30px" }}>

            {/* AI autofill */}
            <div style={{ marginTop: 22 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
              <button onClick={() => fileRef.current && fileRef.current.click()} disabled={scan === "scanning"}
                style={{ width: "100%", padding: "14px", borderRadius: 10,
                  border: `1px solid ${C.line}`, background: "rgba(201,162,75,0.06)",
                  color: C.goldSoft, fontSize: 13, letterSpacing: "0.06em", fontFamily: sans,
                  cursor: scan === "scanning" ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                <span style={{ fontSize: 15 }}>✦</span>
                {scan === "scanning" ? "Reading your photo…" : "Autofill from selfie"}
              </button>
              {scanMsg && (
                <div style={{ marginTop: 10, padding: "10px 13px", borderRadius: 9, fontSize: 12.5, lineHeight: 1.5,
                  fontFamily: sans, border: `1px solid ${scan === "error" ? "rgba(200,80,80,0.4)" : C.line}`,
                  color: scan === "error" ? "#E7A6A6" : C.text,
                  background: scan === "error" ? "rgba(200,80,80,0.06)" : "rgba(201,162,75,0.05)" }}>
                  {scan === "done" && <strong style={{ color: C.goldSoft }}>Review before saving. </strong>}
                  {scanMsg}
                </div>
              )}
            </div>

            <SectionTitle index="I">Attributes</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 22px" }}>
              <Field label="Face Shape" glow={glowed("face_shape")}><Select value={p.face_shape} onChange={(v) => set("face_shape", v)} options={FACE_SHAPES} /></Field>
              <Field label="Hair Type" glow={glowed("hair_type")}><Select value={p.hair_type} onChange={(v) => set("hair_type", v)} options={HAIR_TYPES} /></Field>
              <Field label="Hair Density" glow={glowed("hair_density")}><Select value={p.hair_density} onChange={(v) => set("hair_density", v)} options={HAIR_DENSITY} /></Field>
              <Field label="Hairline" glow={glowed("hairline")}><Select value={p.hairline} onChange={(v) => set("hairline", v)} options={HAIRLINES} /></Field>
              <Field label="Skin Type" glow={glowed("skin_type")}><Select value={p.skin_type} onChange={(v) => set("skin_type", v)} options={SKIN_TYPES} /></Field>
              <Field label="Nail Shape"><Select value={p.nail_shape} onChange={(v) => set("nail_shape", v)} options={NAIL_SHAPES} /></Field>
              <Field label="Beard Style" glow={glowed("beard_style")} hint="optional"><Select value={p.beard_style} onChange={(v) => set("beard_style", v)} options={BEARD_STYLES} /></Field>
            </div>

            <Field label="Skin Tone" glow={glowed("skin_tone")}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {SKIN_TONES.map((t) => {
                  const active = p.skin_tone === t.label;
                  return (
                    <button key={t.label} onClick={() => set("skin_tone", t.label)} title={t.label}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                      <span style={{ width: 34, height: 34, borderRadius: "50%", background: t.hex,
                        border: active ? `2px solid ${C.goldSoft}` : "2px solid transparent",
                        boxShadow: active ? `0 0 0 3px ${C.ink}, 0 0 0 4px ${C.line}` : "none" }} />
                      <span style={{ fontSize: 10, color: active ? C.goldSoft : C.muted }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <SectionTitle index="II">Preferences</SectionTitle>
            <Field label="Preferred Styles" hint="press Enter to add">
              <ChipInput values={p.preferred_styles} onChange={(v) => set("preferred_styles", v)} placeholder="e.g. Knotless braids, Line-up fade…" />
            </Field>
            <Field label="Favourite Colours" hint="press Enter to add">
              <ChipInput values={p.favourite_colours} onChange={(v) => set("favourite_colours", v)} placeholder="e.g. Burgundy, Nude, Cobalt…" />
            </Field>
            <Field label="Budget Range" hint="per appointment">
              <div style={{ display: "flex", gap: 8 }}>
                <input value={p.budget_min} onChange={(e) => set("budget_min", e.target.value.replace(/\D/g, ""))} placeholder="Min" inputMode="numeric"
                  style={{ flex: 1, padding: "11px 12px", background: C.panel2, color: C.text, border: `1px solid ${C.lineSoft}`, borderRadius: 8, fontSize: 14, fontFamily: sans, outline: "none" }} />
                <input value={p.budget_max} onChange={(e) => set("budget_max", e.target.value.replace(/\D/g, ""))} placeholder="Max" inputMode="numeric"
                  style={{ flex: 1, padding: "11px 12px", background: C.panel2, color: C.text, border: `1px solid ${C.lineSoft}`, borderRadius: 8, fontSize: 14, fontFamily: sans, outline: "none" }} />
                <div style={{ width: 92 }}><Select value={p.currency} onChange={(v) => set("currency", v)} options={CURRENCIES} placeholder="₦" /></div>
              </div>
            </Field>

            <SectionTitle index="III">Goals & Care</SectionTitle>
            <Field label="Style Goals">
              <textarea value={p.style_goals} onChange={(e) => set("style_goals", e.target.value)} rows={3}
                placeholder="What are you working toward? e.g. Grow out a fade, healthier natural hair, a signature bridal look…"
                style={{ width: "100%", padding: "12px", background: C.panel2, color: C.text, border: `1px solid ${C.lineSoft}`, borderRadius: 8, fontSize: 14, fontFamily: sans, outline: "none", resize: "vertical", lineHeight: 1.5 }} />
            </Field>
            <Field label="Allergies & Sensitivities" hint="so pros know before they book you">
              <ChipInput values={p.allergies} onChange={(v) => set("allergies", v)} placeholder="e.g. Acrylic, Latex gloves, Ammonia dye…" />
            </Field>
            <Field label="Notes for Professionals">
              <textarea value={p.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
                placeholder="Anything a pro should know about you."
                style={{ width: "100%", padding: "12px", background: C.panel2, color: C.text, border: `1px solid ${C.lineSoft}`, borderRadius: 8, fontSize: 14, fontFamily: sans, outline: "none", resize: "vertical", lineHeight: 1.5 }} />
            </Field>

            <SectionTitle index="IV">Inspiration</SectionTitle>
            <Field label="Saved Looks" hint="paste image links for now">
              <ChipInput values={p.inspiration_photos} onChange={(v) => set("inspiration_photos", v)} placeholder="Paste an image URL…" />
            </Field>

            {/* Consent + save */}
            <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${C.lineSoft}` }}>
              <div onClick={() => set("consent_given", !p.consent_given)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 20 }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 5, marginTop: 1,
                  border: `1px solid ${p.consent_given ? C.gold : C.muted}`,
                  background: p.consent_given ? C.gold : "transparent",
                  display: "grid", placeItems: "center", color: C.ink, fontSize: 13, fontWeight: 700 }}>
                  {p.consent_given ? "✓" : ""}</span>
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  I agree to Stylex storing these details to personalise my recommendations and bookings. I can edit or delete them anytime.
                </span>
              </div>

              <button onClick={save} disabled={!p.consent_given || status === "saving"}
                style={{ width: "100%", padding: "15px", borderRadius: 10, border: "none",
                  fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: sans, fontWeight: 600,
                  cursor: p.consent_given ? "pointer" : "not-allowed",
                  color: p.consent_given ? C.ink : C.muted,
                  background: p.consent_given ? `linear-gradient(180deg, ${C.goldSoft}, ${C.gold})` : C.panel2 }}>
                {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save Passport"}
              </button>
              {!p.consent_given && (
                <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: C.muted }}>Tick the box above to save.</p>
              )}
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Stylex · The Beauty Operating System
        </p>
      </div>
    </div>
  );
}
