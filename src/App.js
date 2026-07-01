import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ───
const supabase = createClient(
  "https://utvrujgqzheifblizarw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc"
);

// ─── COLORS ───
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8D08A";
const DARK = "#0A0A0B";
const DARK2  = "#111114";
const DARK3 = "#1A1A1F";
const CARD = "#16161C";
const BORDER = "#2A2A35";
const TEXT = "#F0EDE8";
const MUTED = "#888898";
const GREEN = "#4CAF50";
const RED = "#FF5555";

// ─── COMMISSION ───
const PRODUCT_COMMISSION_RATE = 0.05; // 5% on every product sold

// ─── DEMO DATA ───
const professionals = [
  { id: 1, name: "Adaeze Okonkwo", handle: "@adaezeglow", category: "Hairstylist", location: "Lagos", avatar: "AO", rating: 4.9, reviews: 128, followers: "12.4K", shopPrice: 18000, mobilePrice: 25000, offersShop: true, offersMobile: true, bio: "Natural hair specialist. Crown jewels only.", tags: ["Braids", "Weave", "Locs"], verified: true, available: true, color: "#C9A84C" },
  { id: 2, name: "Chukwudi Eze", handle: "@chukwudicuts", category: "Barber", location: "Abuja", avatar: "CE", rating: 4.8, reviews: 203, followers: "8.9K", shopPrice: 5000, mobilePrice: 8000, offersShop: true, offersMobile: true, bio: "Precision fades. Sharp lines. Clean finish.", tags: ["Fades", "Beards", "Designs"], verified: true, available: true, color: "#5C8CB5" },
  { id: 3, name: "Fatima Al-Hassan", handle: "@fatimamua", category: "Makeup Artist", location: "Abuja", avatar: "FA", rating: 5.0, reviews: 87, followers: "22.1K", shopPrice: 25000, mobilePrice: 35000, offersShop: true, offersMobile: true, bio: "Celebrity MUA. Bridal & editorial specialist.", tags: ["Bridal", "Editorial", "Glam"], verified: true, available: false, color: "#B56C8A" },
  { id: 4, name: "Blessing Nwosu", handle: "@blessingnails", category: "Nail Technician", location: "Port Harcourt", avatar: "BN", rating: 4.7, reviews: 156, followers: "6.3K", shopPrice: 8000, mobilePrice: 13000, offersShop: true, offersMobile: true, bio: "Nail art elevated. Gel, acrylic, chrome.", tags: ["Gel", "Acrylic", "3D Art"], verified: false, available: true, color: "#7C5CB5" },
  { id: 5, name: "Amara Diallo", handle: "@amaralash", category: "Lash Tech", location: "Lagos", avatar: "AD", rating: 4.9, reviews: 94, followers: "15.7K", shopPrice: 12000, mobilePrice: 18000, offersShop: true, offersMobile: true, bio: "Lash queen. Volume, classic, hybrid.", tags: ["Volume", "Classic", "Hybrid"], verified: true, available: true, color: "#5CB58A" },
  { id: 6, name: "Kemi Adeyemi", handle: "@kemiskin", category: "Skincare", location: "Lagos", avatar: "KA", rating: 4.6, reviews: 71, followers: "9.2K", shopPrice: 15000, mobilePrice: 22000, offersShop: true, offersMobile: true, bio: "Skin therapist. Glow treatments & facials.", tags: ["Facials", "Glow", "Acne"], verified: true, available: true, color: "#B58C5C" },
];

const feedVideos = [
  { id: 1, pro: professionals[0], title: "Knotless Braids Transformation ✨", likes: 4821, comments: 312, saves: 891, duration: "0:47", gradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1654 100%)", emoji: "👑" },
  { id: 2, pro: professionals[2], title: "Bridal Glam Tutorial 💄", likes: 9102, comments: 541, saves: 1420, duration: "1:12", gradient: "linear-gradient(135deg, #1a0818 0%, #3d1535 100%)", emoji: "💄" },
  { id: 3, pro: professionals[1], title: "Skin Fade + Line Up 🔥", likes: 3156, comments: 201, saves: 432, duration: "0:38", gradient: "linear-gradient(135deg, #080e1a 0%, #112240 100%)", emoji: "✂️" },
  { id: 4, pro: professionals[4], title: "Mega Volume Lash Set 👁️", likes: 6881, comments: 422, saves: 1354, duration: "1:28", gradient: "linear-gradient(135deg, #081a0e 0%, #0f3d1f 100%)", emoji: "👁️" },
  { id: 5, pro: professionals[3], title: "Chrome Ombre Nail Art 💅", likes: 5644, comments: 389, saves: 1102, duration: "2:03", gradient: "linear-gradient(135deg, #0f0a1a 0%, #25154d 100%)", emoji: "💅" },
  { id: 6, pro: professionals[5], title: "Glass Skin Routine ✨", likes: 7203, comments: 548, saves: 2100, duration: "1:45", gradient: "linear-gradient(135deg, #1a0e08 0%, #3d2010 100%)", emoji: "✨" },
];

const categories = ["All", "Hair", "Makeup", "Barbing", "Nails", "Lashes", "Facial"];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

// ─── HELPERS ───
function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
}

function Avatar({ initials, size = 40, color = GOLD, style = {} }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color, letterSpacing: 1, flexShrink: 0, ...style }}>{initials}</div>
  );
}

function Badge({ text, color = GOLD }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color, border: `1px solid ${color}44`, borderRadius: 4, padding: "2px 7px", background: `${color}11` }}>{text}</span>;
}

function GoldBtn({ children, onClick, style = {}, outline = false, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? DARK3 : outline ? "transparent" : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: disabled ? MUTED : outline ? GOLD : "#0A0A0B", border: outline ? `1.5px solid ${GOLD}` : disabled ? `1px solid ${BORDER}` : "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", letterSpacing: 0.5, transition: "all 0.2s", ...style }}>{children}</button>
  );
}

function Modal({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, maxWidth: 480, width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 0 60px ${GOLD}15` }}>{children}</div>
    </div>
  );
}

// ─── VERIFIED BADGE (shared component) ───
// Shows a gold verified checkmark next to a pro's name once they've
// subscribed to verification (is_verified = true in their profile).
// Two styles: "tick" (small inline ✓ circle) and "pill" (✓ VERIFIED label).
function VerifiedBadge({ verified, variant = "tick", size = 15 }) {
  if (!verified) return null;
  if (variant === "pill") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: `${GOLD}22`, border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: GOLD, fontWeight: 800, letterSpacing: 0.5 }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: "#0A0A0B", fontSize: 9, fontWeight: 900 }}>✓</span>
        VERIFIED
      </span>
    );
  }
  // default: filled gold circle tick
  return (
    <span title="Verified professional" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: "#0A0A0B", fontSize: size * 0.6, fontWeight: 900, flexShrink: 0 }}>✓</span>
  );
}

// ─── INPUT FIELD ───
function InputField({ label, type = "text", value, onChange, placeholder, error, icon }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={{ marginBottom: 4 }}>
      {label && <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
        <input
          type={type === "password" ? (showPass ? "text" : "password") : type}
          value={value} onChange={onChange} placeholder={placeholder}
          style={{ width: "100%", background: DARK3, border: `1.5px solid ${error ? RED : BORDER}`, borderRadius: 12, padding: `12px ${type === "password" ? "44px" : "14px"} 12px ${icon ? "42px" : "14px"}`, color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }}
        />
        {type === "password" && (
          <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED }}>{showPass ? "🙈" : "👁️"}</button>
        )}
      </div>
      {error && <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>⚠️ {error}</div>}
    </div>
  );
}

// ─── SIGN IN ───
function SignInForm({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    setGeneralError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid")) setGeneralError("Wrong email or password. Please try again.");
        else setGeneralError(error.message);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      onSuccess({
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || email.split("@")[0],
        type: profile?.user_type || "client"
      });
    } catch (err) {
      setGeneralError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, margin: "0 0 6px" }}>Welcome Back 👋</h2>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Sign in to your STYLEX account</p>
      </div>
      {generalError && (
        <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: RED }}>⚠️ {generalError}</div>
      )}
      <InputField label="EMAIL ADDRESS" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); setGeneralError(""); }} placeholder="Enter your email" error={errors.email} icon="📧" />
      <InputField label="PASSWORD" type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }} placeholder="Enter your password" error={errors.password} />
      <div style={{ textAlign: "right", marginTop: -8 }}>
        <span style={{ fontSize: 12, color: GOLD, cursor: "pointer", fontWeight: 600 }}>Forgot Password?</span>
      </div>
      <GoldBtn onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "13px" }}>
        {loading ? "Signing in..." : "Sign In →"}
      </GoldBtn>
      <div style={{ textAlign: "center", fontSize: 12, color: MUTED }}>
        Don't have an account?{" "}
        <span onClick={onSwitch} style={{ color: GOLD, fontWeight: 700, cursor: "pointer" }}>Create Account</span>
      </div>
    </div>
  );
}

// ─── SIGN UP ───
function SignUpForm({ onSwitch, onSuccess }) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", category: "", location: "", agreeTerms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const update = (field, value) => { setForm(f => ({ ...f, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); };

  const validateStep2 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone) e.phone = "Required";
    else if (form.phone.length < 11) e.phone = "Enter valid Nigerian phone";
    return e;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Need one uppercase letter";
    else if (!/[0-9]/.test(form.password)) e.password = "Need one number";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.agreeTerms) e.agreeTerms = "Must agree to terms";
    return e;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!userType) { setErrors({ userType: "Please select account type" }); return; }
      setStep(2);
    } else if (step === 2) {
      const e = validateStep2();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
      setStep(3);
    } else if (step === 3) {
      const e = validateStep3();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
      setLoading(true);
      setSignupError("");

      try {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: `${form.firstName} ${form.lastName}`, user_type: userType } }
        });

        if (error) { setSignupError(error.message); setLoading(false); return; }

        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: form.email,
            full_name: `${form.firstName} ${form.lastName}`,
            user_type: userType,
            phone: form.phone,
            location: form.location,
            category: form.category
          });
        }

        setLoading(false);
        setStep(4);
      } catch (err) {
        setSignupError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Step {Math.min(step, 3)} of 3</span>
          <span style={{ fontSize: 11, color: GOLD }}>{["", "Account Type", "Personal Info", "Security"][Math.min(step, 3)]}</span>
        </div>
        <div style={{ height: 4, background: DARK3, borderRadius: 2 }}>
          <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, width: `${(Math.min(step, 3) / 3) * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {step === 1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: "0 0 4px" }}>Join STYLEX ✨</h2>
            <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Who are you joining as?</p>
          </div>
          {[
            { id: "client", icon: "👤", title: "I'm a Client", desc: "Book beauty professionals", features: ["Browse professionals", "Book appointments", "AI style scanner"] },
            { id: "professional", icon: "✂️", title: "I'm a Professional", desc: "Offer beauty services", features: ["Create profile", "Upload portfolio", "Receive payments"] },
          ].map(type => (
            <button key={type.id} onClick={() => { setUserType(type.id); setErrors({}); }} style={{ background: userType === type.id ? `${GOLD}15` : DARK3, border: `2px solid ${userType === type.id ? GOLD : BORDER}`, borderRadius: 16, padding: "16px", cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 10, transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{type.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: TEXT }}>{type.title}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{type.desc}</div>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${userType === type.id ? GOLD : BORDER}`, background: userType === type.id ? GOLD : "none" }} />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {type.features.map(f => <span key={f} style={{ fontSize: 10, color: userType === type.id ? GOLD : MUTED, background: `${userType === type.id ? GOLD : MUTED}11`, borderRadius: 20, padding: "2px 8px" }}>✓ {f}</span>)}
              </div>
            </button>
          ))}
          {errors.userType && <div style={{ fontSize: 12, color: RED, textAlign: "center" }}>⚠️ {errors.userType}</div>}
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>Personal Information</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <InputField label="FIRST NAME" value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="First name" error={errors.firstName} />
            <InputField label="LAST NAME" value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Last name" error={errors.lastName} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <InputField label="EMAIL" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" error={errors.email} icon="📧" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <InputField label="PHONE" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="08012345678" error={errors.phone} icon="📱" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>CITY</label>
            <input
              value={form.location}
              onChange={e => update("location", e.target.value)}
              placeholder="Type your city e.g. Lagos, London, New York..."
              style={{ width: "100%", background: DARK3, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {userType === "professional" && (
            <div>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>SPECIALTY</label>
              <select value={form.category} onChange={e => update("category", e.target.value)} style={{ width: "100%", background: DARK3, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", color: form.category ? TEXT : MUTED, fontSize: 14, outline: "none" }}>
                <option value="">Select specialty</option>
                {["Hairstylist", "Makeup Artist", "Barber", "Nail Tech", "Lash Tech", "Tattoo Artist", "Skincare"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>Secure Your Account 🔐</h2>
          </div>
          {signupError && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: RED, marginBottom: 10 }}>⚠️ {signupError}</div>}
          <div style={{ marginBottom: 10 }}>
            <InputField label="CREATE PASSWORD" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" error={errors.password} />
            {form.password.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].map((met, i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: met ? GREEN : DARK3 }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 14 }}>
            <InputField label="CONFIRM PASSWORD" type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} placeholder="Re-enter password" error={errors.confirmPassword} />
          </div>
          <button onClick={() => update("agreeTerms", !form.agreeTerms)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10, padding: 0, textAlign: "left", width: "100%" }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, background: form.agreeTerms ? GOLD : "none", border: `2px solid ${form.agreeTerms ? GOLD : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#0A0A0B" }}>{form.agreeTerms ? "✓" : ""}</div>
            <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>I agree to STYLEX's <span style={{ color: GOLD }}>Terms of Service</span> and <span style={{ color: GOLD }}>Privacy Policy</span></span>
          </button>
          {errors.agreeTerms && <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>⚠️ {errors.agreeTerms}</div>}
        </div>
      )}

      {step === 4 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: GOLD, fontWeight: 800, fontSize: 22, margin: "0 0 10px" }}>Account Created!</h2>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            Welcome to STYLEX, <strong style={{ color: TEXT }}>{form.firstName}</strong>!<br />
            Check <strong style={{ color: GOLD }}>{form.email}</strong> to verify your account.
          </p>
          <GoldBtn onClick={() => onSuccess({ email: form.email, name: form.firstName, type: userType })} style={{ width: "100%", padding: "13px" }}>Go to My Account →</GoldBtn>
        </div>
      )}

      {step < 4 && (
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "none", border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "13px", color: MUTED, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Back</button>}
          <GoldBtn onClick={handleNext} disabled={loading} style={{ flex: 2, padding: "13px" }}>
            {loading ? "Please wait..." : step === 3 ? "Create Account 🚀" : "Continue →"}
          </GoldBtn>
        </div>
      )}

      {step === 1 && (
        <div style={{ textAlign: "center", fontSize: 12, color: MUTED }}>
          Already have an account? <span onClick={onSwitch} style={{ color: GOLD, fontWeight: 700, cursor: "pointer" }}>Sign In</span>
        </div>
      )}
    </div>
  );
}

// ─── AUTH SCREEN ───
function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("signin");
  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{ background: CARD, borderRadius: 24, padding: "32px 28px", width: "100%", maxWidth: 420, border: `1px solid ${BORDER}`, boxShadow: `0 0 80px ${GOLD}08` }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 4, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: 3 }}>BEAUTY MARKETPLACE</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, margin: "10px auto 0" }} />
        </div>
        {mode === "signin"
          ? <SignInForm onSwitch={() => setMode("signup")} onSuccess={onAuthenticated} />
          : <SignUpForm onSwitch={() => setMode("signin")} onSuccess={onAuthenticated} />}
      </div>
    </div>
  );
}

// ─── SUBSCRIPTION MODAL (Verification + Boost) ───
// Feature 2: pros subscribe for a verification badge and/or boost.
// NOTE: actual recurring billing requires Flutterwave/Paystack to be connected.
// This saves the chosen plan to Supabase so the badge/boost display works;
// the payment button is wired to a placeholder ready for Flutterwave.
function SubscriptionModal({ user, onClose, onUpdated }) {
  const [planType, setPlanType] = useState("verification"); // verification | boost
  const [billing, setBilling] = useState("monthly"); // monthly | annually
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const PRICING = {
    verification: { monthly: 2500, annually: 25000 },
    boost: { monthly: 5000, annually: 50000 },
  };

  const price = PRICING[planType][billing];

  const handleSubscribe = async () => {
    setSaving(true);
    // Calculate expiry date
    const now = new Date();
    const expires = new Date(now);
    if (billing === "monthly") expires.setMonth(expires.getMonth() + 1);
    else expires.setFullYear(expires.getFullYear() + 1);

    const updates = {};
    if (planType === "verification") {
      updates.is_verified = true;
      updates.verification_plan = billing;
      updates.verification_expires = expires.toISOString();
    } else {
      updates.is_boosted = true;
      updates.boost_plan = billing;
      updates.boost_expires = expires.toISOString();
    }

    // TODO: When Flutterwave is connected, trigger payment here BEFORE saving.
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    setSaving(false);
    if (!error) {
      setDone(true);
      if (onUpdated) onUpdated();
      setTimeout(() => { setDone(false); onClose(); }, 2200);
    }
  };

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>{planType === "verification" ? "✅" : "🚀"}</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
            {planType === "verification" ? "You're Verified!" : "Boost Activated!"}
          </h3>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            {planType === "verification"
              ? "Your verification badge is now active on your profile."
              : "Your profile and videos will now reach more people."}
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Grow Your Business 🚀</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Get verified & reach more clients</span>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {/* Plan type selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button onClick={() => setPlanType("verification")} style={{ flex: 1, padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "left", background: planType === "verification" ? `${GOLD}15` : DARK3, border: `1.5px solid ${planType === "verification" ? GOLD : BORDER}` }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: TEXT }}>Verification</div>
          <div style={{ fontSize: 11, color: MUTED }}>Trusted badge</div>
        </button>
        <button onClick={() => setPlanType("boost")} style={{ flex: 1, padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "left", background: planType === "boost" ? `${GOLD}15` : DARK3, border: `1.5px solid ${planType === "boost" ? GOLD : BORDER}` }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🚀</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: TEXT }}>Boost</div>
          <div style={{ fontSize: 11, color: MUTED }}>More views & bookings</div>
        </button>
      </div>

      {/* What you get */}
      <div style={{ background: DARK3, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>WHAT YOU GET</div>
        {(planType === "verification"
          ? ["Gold verified badge on your profile", "Higher trust with clients", "Priority in search results"]
          : ["Your videos shown to more people", "Featured placement in Explore", "More profile views & bookings"]
        ).map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ color: GOLD, fontSize: 13 }}>✓</span>
            <span style={{ fontSize: 13, color: TEXT }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Billing toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button onClick={() => setBilling("monthly")} style={{ flex: 1, padding: "14px", borderRadius: 12, cursor: "pointer", background: billing === "monthly" ? `${GOLD}15` : DARK3, border: `1.5px solid ${billing === "monthly" ? GOLD : BORDER}` }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Monthly</div>
          <div style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginTop: 4 }}>₦{PRICING[planType].monthly.toLocaleString()}<span style={{ fontSize: 11, color: MUTED }}>/mo</span></div>
        </button>
        <button onClick={() => setBilling("annually")} style={{ flex: 1, padding: "14px", borderRadius: 12, cursor: "pointer", position: "relative", background: billing === "annually" ? `${GOLD}15` : DARK3, border: `1.5px solid ${billing === "annually" ? GOLD : BORDER}` }}>
          <div style={{ position: "absolute", top: -8, right: 8, background: GREEN, color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6 }}>SAVE 17%</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Annually</div>
          <div style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginTop: 4 }}>₦{PRICING[planType].annually.toLocaleString()}<span style={{ fontSize: 11, color: MUTED }}>/yr</span></div>
        </button>
      </div>

      <GoldBtn onClick={handleSubscribe} disabled={saving} style={{ width: "100%", padding: "14px" }}>
        {saving ? "Processing..." : `Subscribe • ₦${price.toLocaleString()}`}
      </GoldBtn>
      <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
        Payment via Flutterwave (coming soon). Your plan activates immediately for now.
      </p>
    </Modal>
  );
}

// ─── PRO DASHBOARD ───
// Where a logged-in professional sets up their business profile & pricing.
function ProDashboard({ user, onClose, onOpenSubscription }) {
  const CATEGORIES = ["Hairstylist", "Barber", "Makeup Artist", "Nail Technician", "Lash Tech", "Skincare"];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState("");
  const [shopPrice, setShopPrice] = useState("");
  const [mobilePrice, setMobilePrice] = useState("");
  const [offersShop, setOffersShop] = useState(true);
  const [offersMobile, setOffersMobile] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);

  // Load existing profile data when the dashboard opens
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setCategory(data.category || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setPhone(data.phone || "");
        setServices(data.services || "");
        setShopPrice(data.shop_price ? String(data.shop_price) : "");
        setMobilePrice(data.mobile_price ? String(data.mobile_price) : "");
        setOffersShop(data.offers_shop !== false);
        setOffersMobile(data.offers_mobile !== false);
        setIsAvailable(data.is_available !== false);
        setIsVerified(data.is_verified === true);
        setIsBoosted(data.is_boosted === true);
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await supabase
      .from("profiles")
      .update({
        category,
        bio,
        location,
        phone,
        services,
        shop_price: parseInt(shopPrice) || 0,
        mobile_price: parseInt(mobilePrice) || 0,
        offers_shop: offersShop,
        offers_mobile: offersMobile,
        is_available: isAvailable,
      })
      .eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600 };
  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, background: DARK3, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 14, marginBottom: 16, boxSizing: "border-box" };

  if (loading) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0", color: MUTED }}>Loading your dashboard...</div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Pro Dashboard</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Set up your business profile</span>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {/* Verification + Boost status / upsell */}
      <div style={{ background: `linear-gradient(135deg, ${GOLD}22, ${DARK3})`, borderRadius: 12, padding: 16, marginBottom: 18, border: `1px solid ${GOLD}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 4 }}>
              {isVerified ? "✅ Verified Pro" : "Get Verified"}
              {isBoosted && <span style={{ marginLeft: 8, fontSize: 11, color: GREEN }}>🚀 Boosted</span>}
            </div>
            <div style={{ fontSize: 11, color: MUTED }}>Badge & boost to reach more clients</div>
          </div>
          <button onClick={onOpenSubscription} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 8, color: "#000", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {isVerified || isBoosted ? "Manage" : "Upgrade"}
          </button>
        </div>
      </div>

      <label style={labelStyle}>Your specialty</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        <option value="">Select your specialty...</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label style={labelStyle}>Location (city)</label>
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lagos" style={inputStyle} />

      <label style={labelStyle}>Phone number</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0801 234 5678" style={inputStyle} />

      <label style={labelStyle}>Short bio</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell clients about yourself..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />

      <label style={labelStyle}>Services you offer (comma separated)</label>
      <input value={services} onChange={(e) => setServices(e.target.value)} placeholder="e.g. Braids, Weave, Locs" style={inputStyle} />

      <div style={{ background: DARK3, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${BORDER}` }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 14 }}>Pricing</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: TEXT }}>🏪 I offer shop visits</span>
          <button onClick={() => setOffersShop(!offersShop)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: offersShop ? GOLD : BORDER, position: "relative", transition: "0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: offersShop ? 23 : 3, transition: "0.2s" }} />
          </button>
        </div>
        {offersShop && (
          <input value={shopPrice} onChange={(e) => setShopPrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Shop price (₦)" style={inputStyle} />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: TEXT }}>🚗 I offer mobile service</span>
          <button onClick={() => setOffersMobile(!offersMobile)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: offersMobile ? GOLD : BORDER, position: "relative", transition: "0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: offersMobile ? 23 : 3, transition: "0.2s" }} />
          </button>
        </div>
        {offersMobile && (
          <input value={mobilePrice} onChange={(e) => setMobilePrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Mobile price (₦)" style={{ ...inputStyle, marginBottom: 0 }} />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px" }}>
        <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>Available for bookings</span>
        <button onClick={() => setIsAvailable(!isAvailable)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: isAvailable ? GOLD : BORDER, position: "relative", transition: "0.2s" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: isAvailable ? 23 : 3, transition: "0.2s" }} />
        </button>
      </div>

      <GoldBtn onClick={handleSave} style={{ width: "100%", opacity: saving ? 0.6 : 1 }}>
        {saving ? "Saving..." : saved ? "Saved ✅" : "Save Profile"}
      </GoldBtn>
    </Modal>
  );
}

// ─── BOOKING MODAL ───
function BookingModal({ pro, onClose, user }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(0);
  const [payMethod, setPayMethod] = useState("flutterwave");
  const [serviceType, setServiceType] = useState(pro.offersShop ? "shop" : "mobile");
  const [bookingRef, setBookingRef] = useState("");

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  const COMMISSION_RATE = 0.20;
  const basePrice = serviceType === "mobile" ? pro.mobilePrice : pro.shopPrice;
  const servicePrice = basePrice + selectedService * 2000;
  const commission = Math.round(servicePrice * COMMISSION_RATE);
  const totalPrice = servicePrice + commission;

  const handleConfirmBooking = async () => {
    const ref = "SX-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    setBookingRef(ref);

    if (user) {
      await supabase.from("bookings").insert({
        client_id: user.id,
        service: pro.tags[selectedService],
        service_type: serviceType,
        date: days[selectedDate]?.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" }),
        time: selectedTime,
        price: totalPrice,
        status: "confirmed",
        reference: ref
      });
    }
    setStep(4);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, margin: "0 0 3px" }}>Book Appointment</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials={pro.avatar} size={22} color={pro.color} />
            <span style={{ fontSize: 12, color: MUTED }}>{pro.name}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {["Date", "Service", "Payment", "Confirm"].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 2, marginBottom: 4, background: i + 1 <= step ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` : BORDER }} />
            <span style={{ fontSize: 9, color: i + 1 <= step ? GOLD : MUTED, fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", marginBottom: 18, paddingBottom: 4 }}>
            {days.map((d, i) => (
              <button key={i} onClick={() => setSelectedDate(i)} style={{ flexShrink: 0, width: 52, padding: "10px 0", borderRadius: 12, cursor: "pointer", background: selectedDate === i ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : DARK3, border: selectedDate === i ? "none" : `1px solid ${BORDER}`, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: selectedDate === i ? "#0A0A0B" : MUTED, fontWeight: 600 }}>{d.toLocaleDateString("en", { weekday: "short" })}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: selectedDate === i ? "#0A0A0B" : TEXT }}>{d.getDate()}</div>
              </button>
            ))}
          </div>
          {selectedDate !== null && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
              {timeSlots.map(time => (
                <button key={time} onClick={() => setSelectedTime(time)} style={{ padding: "9px 0", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 600, background: selectedTime === time ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : DARK3, color: selectedTime === time ? "#0A0A0B" : TEXT, border: selectedTime === time ? "none" : `1px solid ${BORDER}` }}>{time}</button>
              ))}
            </div>
          )}
          <GoldBtn onClick={() => selectedDate !== null && selectedTime && setStep(2)} style={{ width: "100%", opacity: selectedDate !== null && selectedTime ? 1 : 0.4 }}>Continue →</GoldBtn>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {pro.tags.map((tag, i) => (
              <button key={tag} onClick={() => setSelectedService(i)} style={{ background: selectedService === i ? `${GOLD}15` : DARK3, border: selectedService === i ? `1.5px solid ${GOLD}` : `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{tag}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{45 + i * 15} minutes</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: GOLD }}>₦{((serviceType === "mobile" ? pro.mobilePrice : pro.shopPrice) + i * 2000).toLocaleString()}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={() => setStep(1)} outline style={{ flex: 1 }}>← Back</GoldBtn>
            <GoldBtn onClick={() => setStep(3)} style={{ flex: 2 }}>Continue →</GoldBtn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>Choose service type</div>
            <div style={{ display: "flex", gap: 10 }}>
              {pro.offersShop && (
                <button onClick={() => setServiceType("shop")} style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", background: serviceType === "shop" ? GOLD : DARK3, color: serviceType === "shop" ? "#000" : TEXT, border: `1px solid ${serviceType === "shop" ? GOLD : BORDER}`, fontWeight: 600, fontSize: 13 }}>
                  🏪 Shop Visit<br /><span style={{ fontSize: 11, fontWeight: 400 }}>₦{pro.shopPrice.toLocaleString()}</span>
                </button>
              )}
              {pro.offersMobile && (
                <button onClick={() => setServiceType("mobile")} style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", background: serviceType === "mobile" ? GOLD : DARK3, color: serviceType === "mobile" ? "#000" : TEXT, border: `1px solid ${serviceType === "mobile" ? GOLD : BORDER}`, fontWeight: 600, fontSize: 13 }}>
                  🚗 Mobile<br /><span style={{ fontSize: 11, fontWeight: 400 }}>₦{pro.mobilePrice.toLocaleString()}</span>
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {[{ id: "flutterwave", label: "Flutterwave", sub: "Card, Bank Transfer, USSD" }, { id: "paystack", label: "Paystack", sub: "Debit/Credit Card" }, { id: "wallet", label: "STYLEX Wallet", sub: "Balance: ₦0.00" }].map(method => (
              <button key={method.id} onClick={() => setPayMethod(method.id)} style={{ background: payMethod === method.id ? `${GOLD}15` : DARK3, border: payMethod === method.id ? `1.5px solid ${GOLD}` : `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{method.label}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{method.sub}</div>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${payMethod === method.id ? GOLD : BORDER}`, background: payMethod === method.id ? GOLD : "none" }} />
              </button>
            ))}
          </div>

          <div style={{ background: DARK3, borderRadius: 12, padding: 16, marginBottom: 18, border: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: MUTED }}>Service</span>
              <span style={{ fontSize: 13, color: TEXT }}>{pro.tags[selectedService]}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: MUTED }}>Service type</span>
              <span style={{ fontSize: 13, color: TEXT, textTransform: "capitalize" }}>{serviceType === "mobile" ? "Mobile (they come to you)" : "Shop visit"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: MUTED }}>Service fee</span>
              <span style={{ fontSize: 13, color: TEXT }}>₦{servicePrice.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: MUTED }}>Platform fee (20%)</span>
              <span style={{ fontSize: 13, color: TEXT }}>₦{commission.toLocaleString()}</span>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: GOLD }}>₦{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={() => setStep(2)} outline style={{ flex: 1 }}>← Back</GoldBtn>
            <GoldBtn onClick={handleConfirmBooking} style={{ flex: 2 }}>Confirm Booking ✅</GoldBtn>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Booking Confirmed!</h3>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>Your appointment with <strong style={{ color: TEXT }}>{pro.name}</strong> is confirmed.</p>
          <div style={{ background: DARK3, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6, letterSpacing: 1.5 }}>BOOKING REFERENCE</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: GOLD, letterSpacing: 3 }}>{bookingRef}</div>
          </div>
          <GoldBtn onClick={onClose} style={{ width: "100%" }}>Done 🎉</GoldBtn>
        </div>
      )}
    </Modal>
  );
}

// ─── AI SCANNER (REAL CAMERA + CLAUDE VISION) ───
// Feature 1: opens the real camera, captures a photo, sends it to /api/scan
// (a serverless function that calls Claude's vision API) for real analysis.
function AIScannerModal({ onClose, realPros = [], onBookPro }) {
  const [step, setStep] = useState("choose"); // choose | camera | analyzing | results | error
  const [scanType, setScanType] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const scanTypes = [
    { id: "face", icon: "😊", label: "Face Shape", desc: "Find makeup & skincare styles" },
    { id: "hair", icon: "💇", label: "Hair Type", desc: "Discover perfect hairstyles" },
    { id: "nails", icon: "💅", label: "Nail Shape", desc: "Get nail art recommendations" },
    { id: "skin", icon: "✨", label: "Skin Tone", desc: "Find your perfect look" },
  ];

  // Which pro categories match each scan type — used to recommend a pro
  const scanToCategories = {
    face: ["Makeup Artist", "Skincare"],
    hair: ["Hairstylist", "Barber"],
    nails: ["Nail Technician", "Nail Tech"],
    skin: ["Skincare", "Makeup Artist"],
  };

  // Combine real pros (first) + demo pros, then match to the scan type
  const allPros = [...realPros, ...professionals];
  const matchedPros = allPros.filter(p => {
    const cats = scanToCategories[scanType] || [];
    return cats.some(c => (p.category || "").toLowerCase().includes(c.toLowerCase().split(" ")[0]));
  }).slice(0, 3);

  // Stop the camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  // Clean up camera when modal closes
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async (type) => {
    setScanType(type);
    setStep("camera");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      streamRef.current = stream;
      // Wait a tick for the video element to mount
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      setErrorMsg("Could not access the camera. On a computer, click the camera icon in your browser's address bar and choose Allow, then try again. For the best experience, use the scanner on your phone.");
      setStep("error");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 480;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
    analyzeImage(dataUrl);
  };

  const analyzeImage = async (dataUrl) => {
    setStep("analyzing");
    setErrorMsg("");
    try {
      // strip the "data:image/jpeg;base64," prefix
      const base64 = dataUrl.split(",")[1];
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanType, image: base64 })
      });
      const data = await response.json();
      if (data.error) {
        setErrorMsg(data.error);
        setStep("error");
        return;
      }
      setResult(data);
      setStep("results");
    } catch (err) {
      setErrorMsg("Something went wrong analyzing your photo. Please try again.");
      setStep("error");
    }
  };

  const reset = () => {
    stopCamera();
    setScanType(null);
    setCapturedImage(null);
    setResult(null);
    setErrorMsg("");
    setStep("choose");
  };

  const handleClose = () => { stopCamera(); onClose(); };

  return (
    <Modal onClose={handleClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>AI Style Scanner ✨</h3>
          <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Real AI analysis from your camera</p>
        </div>
        <button onClick={handleClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {step === "choose" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {scanTypes.map(s => (
            <button key={s.id} onClick={() => startCamera(s.id)} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 14px", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: TEXT, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.desc}</div>
            </button>
          ))}
        </div>
      )}

      {step === "camera" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `2px solid ${GOLD}44`, marginBottom: 16, background: "#000" }}>
            <video ref={videoRef} playsInline muted style={{ width: "100%", display: "block", transform: "scaleX(-1)" }} />
          </div>
          <p style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>
            Position your {scanType === "face" ? "face" : scanType === "hair" ? "hair" : scanType === "nails" ? "hand/nails" : "face"} in the frame
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={reset} outline style={{ flex: 1 }}>Cancel</GoldBtn>
            <GoldBtn onClick={capturePhoto} style={{ flex: 2 }}>📸 Capture & Analyze</GoldBtn>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          {capturedImage && (
            <img src={capturedImage} alt="captured" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 16, border: `2px solid ${GOLD}44`, marginBottom: 16, transform: "scaleX(-1)" }} />
          )}
          <div style={{ fontSize: 32, marginBottom: 10 }}>🤖</div>
          <div style={{ color: GOLD, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Analyzing your photo...</div>
          <div style={{ color: MUTED, fontSize: 12 }}>Our AI is studying your {scanType}</div>
        </div>
      )}

      {step === "results" && result && (
        <div>
          <div style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "center" }}>
            {capturedImage && (
              <img src={capturedImage} alt="you" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%", border: `2px solid ${GOLD}`, marginBottom: 10, transform: "scaleX(-1)" }} />
            )}
            <div style={{ fontWeight: 800, fontSize: 16, color: GOLD, marginBottom: 6 }}>{result.type}</div>
            <div style={{ fontSize: 13, color: `${TEXT}99`, lineHeight: 1.6 }}>{result.description}</div>
          </div>
          {result.styles && result.styles.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>RECOMMENDED STYLES</div>
              {/* Real photos of each recommended style (from Unsplash) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {result.styles.slice(0, 4).map(style => (
                  <div key={style} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}`, background: DARK3 }}>
                    <img
                      src={`https://source.unsplash.com/240x180/?${encodeURIComponent(style + " " + (scanType === "hair" ? "hairstyle" : scanType === "nails" ? "nails" : scanType === "face" ? "makeup" : "beauty"))}`}
                      alt={style}
                      style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div style={{ padding: "8px 10px", fontSize: 12, color: GOLD, fontWeight: 600, textAlign: "center" }}>{style}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: MUTED, textAlign: "center", lineHeight: 1.5, margin: 0 }}>
                Real examples of each recommended style
              </p>
            </div>
          )}
          {result.tips && (
            <div style={{ background: DARK3, borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>💡 TIP</div>
              <div style={{ fontSize: 13, color: `${TEXT}cc`, lineHeight: 1.6 }}>{result.tips}</div>
            </div>
          )}

          {/* Recommend a professional who can do this look */}
          {matchedPros.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>✨ PROS WHO CAN DO THIS FOR YOU</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {matchedPros.map(pro => (
                  <div key={pro.id} style={{ display: "flex", alignItems: "center", gap: 12, background: DARK3, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
                    <Avatar initials={pro.avatar} size={42} color={pro.color} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: TEXT }}>{pro.name}</span>
                        <VerifiedBadge verified={pro.verified} size={13} />
                      </div>
                      <div style={{ fontSize: 11, color: MUTED }}>{pro.category} · {pro.location}</div>
                      <div style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>from ₦{(pro.shopPrice || pro.mobilePrice || 0).toLocaleString()}</div>
                    </div>
                    <button onClick={() => { handleClose(); if (onBookPro) onBookPro(pro); }} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 8, color: "#0A0A0B", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Book</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={reset} outline style={{ flex: 1 }}>Scan Again</GoldBtn>
            <GoldBtn onClick={handleClose} style={{ flex: 1 }}>Done ✨</GoldBtn>
          </div>
        </div>
      )}

      {step === "error" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
          <div style={{ color: RED, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Scan Failed</div>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>{errorMsg}</p>
          <GoldBtn onClick={reset} style={{ width: "100%" }}>Try Again</GoldBtn>
        </div>
      )}
    </Modal>
  );
}

// ─── PRODUCT UPLOAD MODAL ───
// Feature 3a: both pros and clients can list products. 5% commission applies.
function ProductUploadModal({ user, onClose, onUploaded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [emoji, setEmoji] = useState("🛍️");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const PRODUCT_CATEGORIES = ["Hair Products", "Makeup", "Skincare", "Nails", "Tools & Accessories", "Other"];
  const EMOJIS = ["🛍️", "💄", "💅", "🧴", "💇", "✨", "🪮", "🧼", "💎", "🎀"];

  const handleUpload = async () => {
    setError("");
    if (!name.trim() || !price || !productCategory) {
      setError("Please fill in name, price and category.");
      return;
    }
    setSaving(true);
    const priceNum = parseInt(price) || 0;
    const commission = Math.round(priceNum * PRODUCT_COMMISSION_RATE);
    const { error: insErr } = await supabase.from("products").insert({
      seller_id: user.id,
      seller_name: user.name,
      seller_type: user.type,
      name: name.trim(),
      price: priceNum,
      commission: commission,
      description: description.trim(),
      category: productCategory,
      emoji: emoji,
      status: "active"
    });
    setSaving(false);
    if (insErr) { setError(insErr.message); return; }
    setDone(true);
    if (onUploaded) onUploaded();
    setTimeout(() => { setDone(false); onClose(); }, 1800);
  };

  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600 };
  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, background: DARK3, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 14, marginBottom: 16, boxSizing: "border-box" };

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Product Listed!</h3>
          <p style={{ color: MUTED, fontSize: 13 }}>Your product is now live in the marketplace.</p>
        </div>
      </Modal>
    );
  }

  const priceNum = parseInt(price) || 0;
  const commission = Math.round(priceNum * PRODUCT_COMMISSION_RATE);
  const youReceive = priceNum - commission;

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>List a Product</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Sell to the STYLEX community</span>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {error}</div>}

      <label style={labelStyle}>Product image</label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => setEmoji(e)} style={{ width: 42, height: 42, borderRadius: 10, fontSize: 20, cursor: "pointer", background: emoji === e ? `${GOLD}22` : DARK3, border: `1.5px solid ${emoji === e ? GOLD : BORDER}` }}>{e}</button>
        ))}
      </div>

      <label style={labelStyle}>Product name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Argan Hair Oil 100ml" style={inputStyle} />

      <label style={labelStyle}>Category</label>
      <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} style={inputStyle}>
        <option value="">Select category...</option>
        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label style={labelStyle}>Price (₦)</label>
      <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="e.g. 5000" style={inputStyle} />

      <label style={labelStyle}>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />

      {priceNum > 0 && (
        <div style={{ background: DARK3, borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: MUTED }}>Listing price</span>
            <span style={{ fontSize: 12, color: TEXT }}>₦{priceNum.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: MUTED }}>STYLEX fee (5%)</span>
            <span style={{ fontSize: 12, color: TEXT }}>₦{commission.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>
            <span style={{ fontSize: 13, color: TEXT, fontWeight: 700 }}>You receive</span>
            <span style={{ fontSize: 13, color: GOLD, fontWeight: 700 }}>₦{youReceive.toLocaleString()}</span>
          </div>
        </div>
      )}

      <GoldBtn onClick={handleUpload} disabled={saving} style={{ width: "100%", padding: "13px" }}>
        {saving ? "Listing..." : "List Product 🛍️"}
      </GoldBtn>
    </Modal>
  );
}

// ─── COLLABORATION / ADVERTISE MODAL ───
// Feature 3c: companies reach the owner for collab/promo/ads.
// Messages save to Supabase `collab_requests` -> visible in admin dashboard.
function CollabModal({ user, onClose }) {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [type, setType] = useState("collaboration");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const TYPES = [
    { id: "collaboration", label: "🤝 Collaboration" },
    { id: "promotion", label: "📣 Promotion" },
    { id: "advertisement", label: "📢 Advertisement" },
  ];

  const handleSend = async () => {
    setError("");
    if (!company.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    const { error: insErr } = await supabase.from("collab_requests").insert({
      company_name: company.trim(),
      contact_email: email.trim(),
      request_type: type,
      message: message.trim(),
      sender_id: user?.id || null,
      status: "new"
    });
    setSaving(false);
    if (insErr) { setError(insErr.message); return; }
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 2200);
  };

  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600 };
  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, background: DARK3, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 14, marginBottom: 16, boxSizing: "border-box" };

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>📨</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Message Sent!</h3>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>The STYLEX team will get back to you soon.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Partner With STYLEX 🤝</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Collaborations, promotions & ads</span>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {error}</div>}

      <label style={labelStyle}>What are you interested in?</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 600, background: type === t.id ? `${GOLD}15` : DARK3, color: type === t.id ? GOLD : MUTED, border: `1.5px solid ${type === t.id ? GOLD : BORDER}` }}>{t.label}</button>
        ))}
      </div>

      <label style={labelStyle}>Company / Brand name</label>
      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" style={inputStyle} />

      <label style={labelStyle}>Contact email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle} />

      <label style={labelStyle}>Message</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your proposal..." rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />

      <GoldBtn onClick={handleSend} disabled={saving} style={{ width: "100%", padding: "13px" }}>
        {saving ? "Sending..." : "Send Message 📨"}
      </GoldBtn>
    </Modal>
  );
}

// ─── MARKETPLACE SCREEN ───
// Feature 3: browse products, upload products, and reach out for partnerships.
function MarketplaceScreen({ user, onLogin }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showCollab, setShowCollab] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");

  const loadProducts = () => {
    setLoading(true);
    supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  };

  useEffect(() => { loadProducts(); }, []);

  const cats = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = selectedCat === "All" ? products : products.filter(p => p.category === selectedCat);

  return (
    <div style={{ minHeight: "100vh", background: DARK, padding: "20px 20px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, margin: 0 }}>Marketplace 🛍️</h2>
        <button onClick={() => setShowCollab(true)} title="Partner with us" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 10, color: GOLD, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🤝 Partner</button>
      </div>

      {/* Upload + Partner banner */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button onClick={() => user ? setShowUpload(true) : onLogin()} style={{ flex: 1, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 12, color: "#000", padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          ➕ Sell a Product
        </button>
      </div>

      {/* Category filter */}
      {cats.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", scrollbarWidth: "none" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)} style={{ background: selectedCat === cat ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : `${GOLD}11`, color: selectedCat === cat ? "#0A0A0B" : MUTED, border: selectedCat === cat ? "none" : `1px solid ${BORDER}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{cat}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: MUTED }}>Loading products...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No products yet</h3>
          <p style={{ color: MUTED, fontSize: 13 }}>Be the first to list a product!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
              <div style={{ height: 120, background: `linear-gradient(135deg, ${GOLD}22, ${DARK3})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>{p.emoji || "🛍️"}</div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEXT, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>by {p.seller_name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: GOLD }}>₦{p.price?.toLocaleString()}</span>
                  <button style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, color: GOLD, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Buy</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && user && <ProductUploadModal user={user} onClose={() => setShowUpload(false)} onUploaded={loadProducts} />}
      {showCollab && <CollabModal user={user} onClose={() => setShowCollab(false)} />}
    </div>
  );
}

// ─── HOME SCREEN ───
function HomeScreen({ user, onProfile }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [bookModal, setBookModal] = useState(null);

  const filtered = activeCategory === "All" ? feedVideos : feedVideos.filter(f => f.pro.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: DARK }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${DARK}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</span>
          <span style={{ fontSize: 10, color: MUTED, marginLeft: 8, letterSpacing: 2 }}>BEAUTY MARKETPLACE</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user && <Avatar initials={user.name.slice(0, 2).toUpperCase()} size={32} color={GOLD} />}
          <button style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, color: GOLD, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>🔔</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "14px 20px", overflowX: "auto", scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : `${GOLD}11`, color: activeCategory === cat ? "#0A0A0B" : MUTED, border: activeCategory === cat ? "none" : `1px solid ${BORDER}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{cat}</button>
        ))}
      </div>

      <div style={{ padding: "0 20px 100px" }}>
        {filtered.map((item) => (
          <div key={item.id} style={{ borderRadius: 20, overflow: "hidden", marginBottom: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ background: item.gradient, height: 260, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => onProfile(item.pro)}>
              <div style={{ fontSize: 64, opacity: 0.4 }}>{item.emoji}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 54, height: 54, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: `2px solid ${GOLD}88`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: GOLD, fontSize: 18, marginLeft: 4 }}>▶</span>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: TEXT }}>{item.duration}</div>
              <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 15, color: TEXT }}>{item.title}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar initials={item.pro.avatar} size={28} color={item.pro.color} />
                  <span style={{ fontSize: 12, color: `${TEXT}cc` }}>{item.pro.name}</span>
                  <VerifiedBadge verified={item.pro.verified} size={13} />
                </div>
              </div>
            </div>
            <div style={{ background: CARD, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 18 }}>
                {[
                  { icon: liked[item.id] ? "❤️" : "🤍", count: item.likes + (liked[item.id] ? 1 : 0), key: "like" },
                  { icon: "💬", count: item.comments, key: "comment" },
                  { icon: saved[item.id] ? "🔖" : "📎", count: item.saves + (saved[item.id] ? 1 : 0), key: "save" },
                ].map(action => (
                  <button key={action.key} onClick={() => { if (action.key === "like") setLiked(p => ({ ...p, [item.id]: !p[item.id] })); if (action.key === "save") setSaved(p => ({ ...p, [item.id]: !p[item.id] })); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: MUTED, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ fontSize: 16 }}>{action.icon}</span>{formatNum(action.count)}
                  </button>
                ))}
              </div>
              <GoldBtn onClick={() => setBookModal(item.pro)} style={{ padding: "7px 16px", fontSize: 12 }}>Book Now</GoldBtn>
            </div>
          </div>
        ))}
      </div>
      {bookModal && <BookingModal pro={bookModal} user={user} onClose={() => setBookModal(null)} />}
    </div>
  );
}

// ─── EXPLORE SCREEN ───
function ExploreScreen({ onProfile, user, realPros = [] }) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [bookModal, setBookModal] = useState(null);

  // Real pros (from Supabase) shown first, then demo pros
  const allPros = [...realPros, ...professionals];
  const filtered = allPros.filter(p => {
    const matchCat = selectedCat === "All" || p.category.toLowerCase().includes(selectedCat.toLowerCase());
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: DARK, padding: "20px 20px 100px" }}>
      <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginBottom: 16 }}>Discover Professionals</h2>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, category or city..." style={{ width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 16px 12px 40px", color: TEXT, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}>
        {["All", ...new Set(allPros.map(p => p.category))].map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)} style={{ background: selectedCat === cat ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : `${GOLD}11`, color: selectedCat === cat ? "#0A0A0B" : MUTED, border: selectedCat === cat ? "none" : `1px solid ${BORDER}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map(pro => (
          <div key={pro.id} style={{ background: CARD, borderRadius: 18, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${pro.color}, ${pro.color}44)` }} />
            <div style={{ padding: "18px 18px 14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                <Avatar initials={pro.avatar} size={52} color={pro.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>{pro.name}</span>
                    <VerifiedBadge verified={pro.verified} size={15} />
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{pro.handle}</div>
                  <Badge text={pro.category} color={pro.color} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>₦{(pro.shopPrice || pro.mobilePrice || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>from</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: `${TEXT}99`, margin: "0 0 10px", lineHeight: 1.6 }}>{pro.bio}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {pro.tags.map(tag => <span key={tag} style={{ fontSize: 10, color: pro.color, background: `${pro.color}15`, border: `1px solid ${pro.color}33`, borderRadius: 4, padding: "2px 8px" }}>{tag}</span>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${BORDER}`, paddingTop: 10, marginBottom: 12 }}>
                <div>
                  <span style={{ color: GOLD, fontSize: 12 }}>{"★".repeat(Math.round(pro.rating))}</span>
                  <span style={{ color: MUTED, fontSize: 11, marginLeft: 4 }}>{pro.rating} · {pro.reviews} reviews</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: pro.available ? GREEN : "#888" }} />
                  <span style={{ fontSize: 11, color: pro.available ? GREEN : MUTED }}>{pro.available ? "Available" : "Busy"}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <GoldBtn onClick={() => onProfile(pro)} outline style={{ flex: 1, padding: "9px 0", fontSize: 12 }}>View Profile</GoldBtn>
                <GoldBtn onClick={() => setBookModal(pro)} style={{ flex: 1, padding: "9px 0", fontSize: 12 }}>Book Now</GoldBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
      {bookModal && <BookingModal pro={bookModal} user={user} onClose={() => setBookModal(null)} />}
    </div>
  );
}

// ─── BOOKINGS SCREEN ───
function BookingsScreen({ user, onLogin }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      supabase.from("bookings").select("*").eq("client_id", user.id).order("created_at", { ascending: false })
        .then(({ data }) => { setBookings(data || []); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Sign in to view bookings</h2>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>Create an account to start booking beauty professionals</p>
          <GoldBtn onClick={onLogin} style={{ padding: "12px 24px" }}>Sign In / Sign Up</GoldBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: DARK, padding: "20px 20px 100px" }}>
      <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginBottom: 20 }}>My Bookings</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: MUTED }}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No bookings yet</h3>
          <p style={{ color: MUTED, fontSize: 13 }}>Your confirmed bookings will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {bookings.map((b, i) => (
            <div key={i} style={{ background: CARD, borderRadius: 16, padding: 18, border: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{b.service}</div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, background: `${GREEN}22`, color: GREEN, border: `1px solid ${GREEN}44` }}>{b.status?.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>📅 {b.date} · 🕐 {b.time}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>₦{b.price?.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 6, fontFamily: "monospace" }}>{b.reference}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE SCREEN ───
function ProfileScreen({ user, onAuth, onLogout, onOpenDashboard, onOpenMarketplace, onOpenSubscription, realPros = [], onBookPro }) {
  const [showScanner, setShowScanner] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [showCollab, setShowCollab] = useState(false);
  const [myVerified, setMyVerified] = useState(false);
  const [myBoosted, setMyBoosted] = useState(false);

  // Load this user's own verified/boost status so we can show their badge
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("is_verified, is_boosted").eq("id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setMyVerified(data.is_verified === true);
          setMyBoosted(data.is_boosted === true);
        }
      });
  }, [user]);

  if (!user) return <AuthScreen onAuthenticated={onAuth} />;

  const isPro = user.type === "professional";

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'Helvetica Neue', Arial, sans-serif", paddingBottom: 100 }}>
      <div style={{ background: isPro ? `linear-gradient(135deg, ${GOLD}22, ${DARK3})` : `linear-gradient(135deg, #1a1a2e, ${DARK3})`, borderBottom: `1px solid ${BORDER}`, padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
          <Avatar initials={user.name.slice(0, 2).toUpperCase()} size={72} color={GOLD} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: TEXT }}>{user.name}</div>
              <VerifiedBadge verified={myVerified} size={16} />
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{user.email}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 6, padding: "3px 10px", fontSize: 10, color: GOLD, fontWeight: 700 }}>
                {isPro ? "✂️ PROFESSIONAL" : "👤 CLIENT"}
              </span>
              {myBoosted && <span style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}55`, borderRadius: 6, padding: "3px 10px", fontSize: 10, color: GREEN, fontWeight: 700 }}>🚀 BOOSTED</span>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, background: CARD, borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}`, marginBottom: 14 }}>
          {[{ label: "Bookings", val: "0" }, { label: isPro ? "Earnings" : "Following", val: isPro ? "₦0" : "0" }, { label: "Reviews", val: "0" }].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRight: i < 2 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: GOLD }}>{s.val}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>

        {isPro ? (
          <div>
            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn onClick={() => setShowUpload(true)} style={{ flex: 1, padding: "10px 0", fontSize: 12 }}>📹 Upload Content</GoldBtn>
              <GoldBtn outline style={{ flex: 1, padding: "10px 0", fontSize: 12 }}>✏️ Edit Services</GoldBtn>
            </div>
            <button onClick={onOpenDashboard} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", color: "#0A0A0B", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              ⚙️ Manage My Business
            </button>
            <button onClick={onOpenSubscription} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: DARK3, border: `1px solid ${GOLD}44`, color: GOLD, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              ✅ Get Verified & Boost 🚀
            </button>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(135deg, #1a0a2e, #2d1654)`, borderRadius: 14, padding: "16px 18px", border: `1px solid #7C5CB544`, cursor: "pointer" }} onClick={() => setShowScanner(true)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 36 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: TEXT, marginBottom: 3 }}>AI Style Scanner ✨</div>
                <div style={{ fontSize: 12, color: `${TEXT}88` }}>Scan your face, hair or nails for personalized recommendations</div>
              </div>
              <div style={{ background: `linear-gradient(135deg, #7C5CB5, #B56C8A)`, borderRadius: 10, padding: "8px 14px", fontSize: 11, fontWeight: 700, color: TEXT, flexShrink: 0 }}>Scan Now</div>
            </div>
          </div>
        )}
      </div>

      {isPro && (
        <div style={{ margin: "16px 20px 0", background: `linear-gradient(135deg, ${GOLD}22, ${DARK3})`, borderRadius: 14, padding: "14px 18px", border: `1px solid ${GOLD}33`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>THIS MONTH'S EARNINGS</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: GOLD }}>₦0</div>
          </div>
          <button style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 8, color: GOLD, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Withdraw</button>
        </div>
      )}

      {/* Marketplace quick actions for everyone */}
      <div style={{ margin: "16px 20px 0", display: "flex", gap: 10 }}>
        <button onClick={() => setShowProductUpload(true)} style={{ flex: 1, background: CARD, borderRadius: 14, padding: "14px", border: `1px solid ${BORDER}`, cursor: "pointer", color: TEXT, fontWeight: 600, fontSize: 13 }}>🛍️ Sell a Product</button>
        <button onClick={() => setShowCollab(true)} style={{ flex: 1, background: CARD, borderRadius: 14, padding: "14px", border: `1px solid ${BORDER}`, cursor: "pointer", color: TEXT, fontWeight: 600, fontSize: 13 }}>🤝 Partner With Us</button>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {[
          { icon: "📅", label: "My Bookings", sub: "View & manage appointments" },
          { icon: "🛍️", label: "Marketplace", sub: "Browse & sell products", action: "marketplace" },
          { icon: "❤️", label: isPro ? "My Services" : "Saved Professionals", sub: isPro ? "Manage your service offerings" : "Your beauty favorites" },
          { icon: "💬", label: "Messages", sub: "Chat with " + (isPro ? "clients" : "professionals") },
          { icon: "💳", label: "Payment Methods", sub: isPro ? "Bank accounts & payouts" : "Cards & wallet" },
          { icon: "🔔", label: "Notifications", sub: "Booking reminders & offers" },
          { icon: "🔒", label: "Security", sub: "Password & 2FA" },
          { icon: "🚪", label: "Sign Out", sub: "Log out of STYLEX", danger: true },
        ].map((item, i) => (
          <div key={i} onClick={async () => {
            if (item.label === "Sign Out") { await supabase.auth.signOut(); onLogout(); }
            else if (item.action === "marketplace") { onOpenMarketplace(); }
          }} style={{ background: CARD, borderRadius: 14, padding: "16px 18px", marginBottom: 10, border: `1px solid ${item.danger ? "#ff444433" : BORDER}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: item.danger ? "#ff6666" : TEXT }}>{item.label}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{item.sub}</div>
            </div>
            <span style={{ color: MUTED, fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>

      {showScanner && <AIScannerModal onClose={() => setShowScanner(false)} realPros={realPros} onBookPro={onBookPro} />}
      {showProductUpload && <ProductUploadModal user={user} onClose={() => setShowProductUpload(false)} />}
      {showCollab && <CollabModal user={user} onClose={() => setShowCollab(false)} />}
      {showUpload && (
        <Modal onClose={() => setShowUpload(false)}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📹</div>
            <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Upload Content</h3>
            <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>Share your work with thousands of clients</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[{ icon: "🎬", label: "Video" }, { icon: "📸", label: "Photo" }, { icon: "🎵", label: "Reel" }, { icon: "⭕", label: "Story" }].map(type => (
                <button key={type.label} onClick={() => setShowUpload(false)} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", cursor: "pointer" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{type.icon}</div>
                  <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{type.label}</div>
                </button>
              ))}
            </div>
            <GoldBtn onClick={() => setShowUpload(false)} outline style={{ width: "100%" }}>Cancel</GoldBtn>
          </div>
        </Modal>
      )}
      {isPro && (
        <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 200 }}>
          <button onClick={() => setShowUpload(true)} style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 4px 20px ${GOLD}66` }}>+</button>
          <div style={{ fontSize: 9, color: GOLD, textAlign: "center", marginTop: 4, fontWeight: 700 }}>UPLOAD</div>
        </div>
      )}
    </div>
  );
}

// ─── PRO PROFILE ───
function ProProfileScreen({ pro, onBack, user }) {
  const [tab, setTab] = useState("portfolio");
  const [following, setFollowing] = useState(false);
  const [showBook, setShowBook] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'Helvetica Neue', Arial, sans-serif", paddingBottom: 100 }}>
      <div style={{ padding: "16px 20px" }}>
        <button onClick={onBack} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, color: GOLD, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
      </div>
      <div style={{ margin: "0 20px 20px", borderRadius: 20, background: `linear-gradient(135deg, ${pro.color}22, ${DARK3})`, border: `1px solid ${pro.color}44`, padding: 24 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <Avatar initials={pro.avatar} size={72} color={pro.color} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: 0 }}>{pro.name}</h2>
              {pro.verified && <VerifiedBadge verified={pro.verified} variant="pill" />}
            </div>
            <div style={{ color: MUTED, fontSize: 13, marginBottom: 8 }}>{pro.handle} · {pro.location}</div>
            <Badge text={pro.category} color={pro.color} />
            <p style={{ color: `${TEXT}99`, fontSize: 13, margin: "10px 0 12px", lineHeight: 1.6 }}>{pro.bio}</p>
            <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
              {[{ label: "Followers", val: pro.followers }, { label: "Reviews", val: pro.reviews }, { label: "Rating", val: `${pro.rating}★` }].map(s => (
                <div key={s.label}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: GOLD }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn onClick={() => setFollowing(f => !f)} outline={!following} style={{ fontSize: 12, padding: "8px 18px" }}>{following ? "✓ Following" : "+ Follow"}</GoldBtn>
              <GoldBtn onClick={() => setShowBook(true)} style={{ fontSize: 12, padding: "8px 18px" }}>Book Now</GoldBtn>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
        {["portfolio", "reviews"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "12px 0", fontWeight: 600, fontSize: 13, color: tab === t ? GOLD : MUTED, borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {tab === "portfolio" && (
        <div style={{ padding: "0 20px 100px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {["✨", "👑", "💫", "🌟", "💎", "🎨"].map((emoji, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 12, background: `linear-gradient(135deg, ${pro.color}22, ${DARK3})`, border: `1px solid ${pro.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer" }}>{emoji}</div>
          ))}
        </div>
      )}

      {tab === "reviews" && (
        <div style={{ padding: "0 20px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[{ user: "Chioma A.", rating: 5, text: "Absolutely flawless! Best in the business.", date: "2 days ago" }, { user: "Ngozi M.", rating: 5, text: "Professional and talented. Will rebook!", date: "1 week ago" }].map((rev, i) => (
            <div key={i} style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: TEXT }}>{rev.user}</span>
                <span style={{ fontSize: 11, color: MUTED }}>{rev.date}</span>
              </div>
              <div style={{ color: GOLD, fontSize: 13, marginBottom: 6 }}>{"★".repeat(rev.rating)}</div>
              <p style={{ fontSize: 13, color: `${TEXT}88`, margin: 0 }}>{rev.text}</p>
            </div>
          ))}
        </div>
      )}
      {showBook && <BookingModal pro={pro} user={user} onClose={() => setShowBook(false)} />}
    </div>
  );
}

// ─── STYLEX ASSISTANT (CHATBOT) ───
function StylexAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the Stylex Assistant. Ask me about bookings, services, or how Stylex works!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await response.json();
      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: "Error: " + data.error }]);
      } else {
        const reply = data.content[0].text;
        setMessages([...newMessages, { role: 'assistant', content: reply }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 20, zIndex: 1000 }}>
      {isOpen && (
        <div style={{ width: 320, height: 420, background: '#0a0a0a', border: '2px solid #d4af37', borderRadius: 12, display: 'flex', flexDirection: 'column', marginBottom: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ background: '#d4af37', color: '#000', padding: 12, borderRadius: '10px 10px 0 0', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
            <span>Stylex Assistant</span>
            <span onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>✕</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 8, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <span style={{ background: msg.role === 'user' ? '#d4af37' : '#222', color: msg.role === 'user' ? '#000' : '#fff', padding: '6px 10px', borderRadius: 8, display: 'inline-block', maxWidth: '80%', fontSize: 14 }}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div style={{ color: '#888', fontSize: 13 }}>Typing...</div>}
          </div>
          <div style={{ display: 'flex', padding: 8, borderTop: '1px solid #333' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
              style={{ flex: 1, padding: 8, borderRadius: 6, border: 'none', marginRight: 8 }}
            />
            <button onClick={sendMessage} style={{ background: '#d4af37', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: 56, height: 56, borderRadius: '50%', background: '#d4af37', border: 'none', fontSize: 24, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
      >
        💬
      </button>
    </div>
  );
}

// ─── MAIN APP ───
export default function StylexApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [viewingPro, setViewingPro] = useState(null);
  const [realPros, setRealPros] = useState([]);
  const [showProDashboard, setShowProDashboard] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [scannerBookPro, setScannerBookPro] = useState(null);
  const [loading, setLoading] = useState(true);

  // EFFECT 1 — fetch real professionals from Supabase (FIXED: now its own top-level effect)
  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "professional")
      .then(({ data }) => {
        if (data) {
          const mapped = data
            .filter(p => p.category) // only pros who've set up their profile
            .map(p => ({
              id: "db-" + p.id,
              name: p.full_name || "Professional",
              handle: "@" + (p.full_name || "pro").toLowerCase().replace(/\s+/g, ""),
              category: p.category || "Beauty Pro",
              location: p.location || "Nigeria",
              avatar: (p.full_name || "PR").slice(0, 2).toUpperCase(),
              rating: 5.0,
              reviews: 0,
              followers: "0",
              shopPrice: p.shop_price || 0,
              mobilePrice: p.mobile_price || 0,
              offersShop: p.offers_shop !== false,
              offersMobile: p.offers_mobile !== false,
              bio: p.bio || "",
              tags: p.services ? p.services.split(",").map(s => s.trim()) : ["Service"],
              verified: p.is_verified === true,
              available: p.is_available !== false,
              color: "#C9A84C"
            }));
          setRealPros(mapped);
        }
      });
  }, []);

  // EFFECT 2 — auth/session (FIXED: separated from the fetch above)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from("profiles").select("*").eq("id", session.user.id).single()
          .then(({ data: profile }) => {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: profile?.full_name || session.user.email.split("@")[0],
              type: profile?.user_type || "client"
            });
          });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    setActiveTab("profile");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("home");
  };

  const navItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "explore", label: "Explore", icon: "🔍" },
    { id: "marketplace", label: "Shop", icon: "🛍️" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 4, color: GOLD, fontFamily: "Georgia, serif", marginBottom: 16 }}>STYLEX</div>
          <div style={{ color: MUTED, fontSize: 13 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (viewingPro) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", background: DARK, minHeight: "100vh", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <ProProfileScreen pro={viewingPro} user={user} onBack={() => setViewingPro(null)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: DARK, minHeight: "100vh", position: "relative", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {activeTab === "home" && <HomeScreen user={user} onProfile={(pro) => setViewingPro(pro)} />}
      {activeTab === "explore" && <ExploreScreen user={user} realPros={realPros} onProfile={(pro) => setViewingPro(pro)} />}
      {activeTab === "marketplace" && <MarketplaceScreen user={user} onLogin={() => setActiveTab("profile")} />}
      {activeTab === "bookings" && <BookingsScreen user={user} onLogin={() => setActiveTab("profile")} />}
      {activeTab === "profile" && <ProfileScreen user={user} onAuth={handleAuth} onLogout={handleLogout} onOpenDashboard={() => setShowProDashboard(true)} onOpenMarketplace={() => setActiveTab("marketplace")} onOpenSubscription={() => setShowSubscription(true)} realPros={realPros} onBookPro={(pro) => setScannerBookPro(pro)} />}

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `${DARK2}f5`, backdropFilter: "blur(20px)", borderTop: `1px solid ${BORDER}`, display: "flex", padding: "8px 0 16px", zIndex: 200 }}>
        {navItems.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0" }}>
              <span style={{ fontSize: 20, opacity: active ? 1 : 0.4 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? GOLD : MUTED }}>{item.label}</span>
              {active && <div style={{ width: 18, height: 2, borderRadius: 1, background: GOLD }} />}
            </button>
          );
        })}
      </div>

      <StylexAssistant />
      {showProDashboard && <ProDashboard user={user} onClose={() => setShowProDashboard(false)} onOpenSubscription={() => { setShowProDashboard(false); setShowSubscription(true); }} />}
      {showSubscription && <SubscriptionModal user={user} onClose={() => setShowSubscription(false)} onUpdated={() => {}} />}
      {scannerBookPro && <BookingModal pro={scannerBookPro} user={user} onClose={() => setScannerBookPro(null)} />}
    </div>
  );
}