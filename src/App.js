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

function Avatar({ initials, size = 40, color = GOLD, style = {}, img = null }) {
  if (img) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${color}55`, flexShrink: 0, ...style }}>
        <img src={img} alt={initials} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }
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

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
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
function SubscriptionModal({ user, onClose, onUpdated }) {
  const [planType, setPlanType] = useState("verification");
  const [billing, setBilling] = useState("monthly");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const PRICING = {
    verification: { monthly: 2500, annually: 25000 },
    boost: { monthly: 5000, annually: 50000 },
  };

  const price = PRICING[planType][billing];

  const handleSubscribe = async () => {
    setSaving(true);
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

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
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

// ─── STYLE IMAGE ───
function StyleImage({ style, scanType }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const context = scanType === "hair" ? "hairstyle" : scanType === "nails" ? "nails" : scanType === "face" ? "makeup" : "beauty";
    fetch("/api/styleimage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: style + " " + context })
    })
      .then(r => r.json())
      .then(data => {
        if (!active) return;
        if (data && data.url) setImgUrl(data.url);
        else setFailed(true);
        setLoading(false);
      })
      .catch(() => { if (active) { setFailed(true); setLoading(false); } });
    return () => { active = false; };
  }, [style, scanType]);

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}`, background: DARK3 }}>
      <div style={{ width: "100%", height: 110, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${GOLD}22, ${DARK3})` }}>
        {loading ? (
          <span style={{ fontSize: 11, color: MUTED }}>Loading...</span>
        ) : imgUrl && !failed ? (
          <img src={imgUrl} alt={style} onError={() => setFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <span style={{ fontSize: 32 }}>{scanType === "hair" ? "💇" : scanType === "nails" ? "💅" : scanType === "face" ? "💄" : "✨"}</span>
        )}
      </div>
      <div style={{ padding: "8px 10px", fontSize: 12, color: GOLD, fontWeight: 600, textAlign: "center" }}>{style}</div>
    </div>
  );
}

// ─── AI SCANNER (REAL CAMERA + CLAUDE VISION) ───
function AIScannerModal({ onClose, realPros = [], onBookPro }) {
  const [step, setStep] = useState("choose");
  const [scanType, setScanType] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [portfolioWork, setPortfolioWork] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const scanTypes = [
    { id: "face", icon: "😊", label: "Face Shape", desc: "Find makeup & skincare styles" },
    { id: "hair", icon: "💇", label: "Hair Type", desc: "Discover perfect hairstyles" },
    { id: "nails", icon: "💅", label: "Nail Shape", desc: "Get nail art recommendations" },
    { id: "skin", icon: "✨", label: "Skin Tone", desc: "Find your perfect look" },
  ];

  const scanToCategories = {
    face: ["Makeup Artist", "Skincare"],
    hair: ["Hairstylist", "Barber"],
    nails: ["Nail Technician", "Nail Tech"],
    skin: ["Skincare", "Makeup Artist"],
  };

  const allPros = [...realPros, ...professionals];
  const matchedPros = allPros.filter(p => {
    const cats = scanToCategories[scanType] || [];
    return cats.some(c => (p.category || "").toLowerCase().includes(c.toLowerCase().split(" ")[0]));
  }).slice(0, 3);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

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

      const cats = scanToCategories[scanType] || [];
      if (cats.length > 0) {
        const { data: work } = await supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        if (work) {
          const catKeys = cats.map(c => c.toLowerCase().split(" ")[0]);
          const filtered = work.filter(w => {
            const wc = (w.category || "").toLowerCase();
            return catKeys.some(k => wc.includes(k));
          }).slice(0, 6);
          setPortfolioWork(filtered);
        }
      }
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
    setPortfolioWork([]);
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

          {portfolioWork.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>💎 REAL WORK BY STYLEX PROS</div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
                {portfolioWork.map(work => {
                  const pro = [...realPros, ...professionals].find(p => (p.id === "db-" + work.pro_id) || p.name === work.pro_name);
                  return (
                    <div key={work.id} style={{ flexShrink: 0, width: 150, borderRadius: 12, overflow: "hidden", border: `1px solid ${GOLD}33`, background: DARK3 }}>
                      <img src={work.image_url} alt={work.style_name} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "8px 10px" }}>
                        <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 2 }}>{work.style_name}</div>
                        <div style={{ fontSize: 10, color: MUTED, marginBottom: 8 }}>by {work.pro_name}</div>
                        <button onClick={() => { if (pro) { handleClose(); if (onBookPro) onBookPro(pro); } }} disabled={!pro} style={{ width: "100%", background: pro ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : DARK2, border: "none", borderRadius: 8, color: pro ? "#0A0A0B" : MUTED, padding: "6px 0", fontSize: 11, fontWeight: 700, cursor: pro ? "pointer" : "default" }}>{pro ? "Book this pro" : "View style"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: MUTED, textAlign: "center", lineHeight: 1.5, margin: "10px 0 0" }}>
                Actual work from real STYLEX professionals
              </p>
            </div>
          )}

          {result.styles && result.styles.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>RECOMMENDED STYLES</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {result.styles.slice(0, 4).map(style => (
                  <StyleImage key={style} style={style} scanType={scanType} />
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

          {matchedPros.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>✨ PROS WHO CAN DO THIS FOR YOU</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {matchedPros.map(pro => (
                  <div key={pro.id} style={{ display: "flex", alignItems: "center", gap: 12, background: DARK3, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
                    <Avatar initials={pro.avatar} size={42} color={pro.color} img={pro.avatarUrl} />
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

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button onClick={() => user ? setShowUpload(true) : onLogin()} style={{ flex: 1, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 12, color: "#000", padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          ➕ Sell a Product
        </button>
      </div>

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

// ─── CREATE POST MODAL ───
function CreatePostModal({ user, onClose, onPosted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaKind, setMediaKind] = useState("photo");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("choose");
  const [recording, setRecording] = useState(false);
  const [recordType, setRecordType] = useState("video");

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const camVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const CATEGORIES = ["Hair", "Makeup", "Barbing", "Nails", "Lashes", "Facial"];
  const MAX_PHOTO = 5 * 1024 * 1024;
  const MAX_VIDEO = 20 * 1024 * 1024;

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("category").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data && data.category) setCategory(data.category); });
  }, [user]);

  useEffect(() => {
    return () => stopStream();
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleFileChange = (e, kind) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (kind === "photo") {
      if (!f.type.startsWith("image/")) { setError("That's not a photo file."); return; }
      if (f.size > MAX_PHOTO) { setError("Photo is too large. Please use one under 5MB."); return; }
    } else {
      if (!f.type.startsWith("video/")) { setError("That's not a video file."); return; }
      if (f.size > MAX_VIDEO) { setError("Video is too large. Please keep it under 20MB (about 30 seconds)."); return; }
    }
    setError("");
    setFile(f);
    setMediaKind(kind);
    setPreview(URL.createObjectURL(f));
    setMode("preview");
  };

  const startCamera = async (type) => {
    setError("");
    setRecordType(type);
    setMode("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: type === "video"
      });
      streamRef.current = stream;
      setTimeout(() => {
        if (camVideoRef.current) {
          camVideoRef.current.srcObject = stream;
          camVideoRef.current.muted = true;
          camVideoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      setError("Could not access the camera. Allow camera permission and try again, or use 'Choose from device'.");
      setMode("choose");
    }
  };

  const snapPhoto = () => {
    const video = camVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 480, h = video.videoHeight || 640;
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const f = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
      setFile(f);
      setMediaKind("photo");
      setPreview(URL.createObjectURL(f));
      stopStream();
      setMode("preview");
    }, "image/jpeg", 0.85);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    let recorder;
    try {
      recorder = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
    } catch (e) {
      try { recorder = new MediaRecorder(streamRef.current); }
      catch (e2) { setError("Recording isn't supported on this browser. Try 'Choose from device'."); return; }
    }
    recorderRef.current = recorder;
    recorder.ondataavailable = (ev) => { if (ev.data.size > 0) chunksRef.current.push(ev.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      if (blob.size > MAX_VIDEO) {
        setError("That recording is too long. Please keep it under ~30 seconds.");
        stopStream(); setMode("choose"); return;
      }
      const f = new File([blob], `video_${Date.now()}.webm`, { type: "video/webm" });
      setFile(f);
      setMediaKind("video");
      setPreview(URL.createObjectURL(f));
      stopStream();
      setMode("preview");
    };
    recorder.start();
    setRecording(true);
    setTimeout(() => { if (recorderRef.current && recorderRef.current.state === "recording") stopRecording(); }, 30000);
  };
  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetMedia = () => {
    stopStream();
    setFile(null); setPreview(null); setError(""); setMode("choose");
  };

  const handlePost = async () => {
    setError("");
    if (!file) { setError("Please add a photo or video first."); return; }
    setUploading(true);
    try {
      const ext = mediaKind === "video" ? "webm" : (file.name.split(".").pop() || "jpg");
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("posts").upload(filePath, file);
      if (upErr) { setError("Upload failed: " + upErr.message); setUploading(false); return; }

      const { data: urlData } = supabase.storage.from("posts").getPublicUrl(filePath);
      const mediaUrl = urlData.publicUrl;

      const { error: insErr } = await supabase.from("posts").insert({
        pro_id: user.id,
        pro_name: user.name,
        media_type: mediaKind,
        media_url: mediaUrl,
        caption: caption.trim(),
        category: category,
        likes: 0,
        comments: 0
      });
      if (insErr) { setError("Uploaded but couldn't save post: " + insErr.message); setUploading(false); return; }

      setUploading(false);
      setDone(true);
      if (onPosted) onPosted();
      setTimeout(() => { setDone(false); onClose(); }, 1600);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  };

  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600 };
  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, background: DARK3, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 14, marginBottom: 16, boxSizing: "border-box" };

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Posted!</h3>
          <p style={{ color: MUTED, fontSize: 13 }}>Your post is now live in the feed.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => { stopStream(); onClose(); }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Create Post</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Share a photo or video</span>
        </div>
        <button onClick={() => { stopStream(); onClose(); }} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {error}</div>}

      <input ref={photoInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, "photo")} style={{ display: "none" }} />
      <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => handleFileChange(e, "video")} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {mode === "choose" && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <button onClick={() => photoInputRef.current && photoInputRef.current.click()} style={{ padding: "22px 10px", borderRadius: 14, background: DARK3, border: `1px solid ${BORDER}`, cursor: "pointer", color: TEXT }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🖼️</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Choose Photo</div>
              <div style={{ fontSize: 10, color: MUTED }}>from device</div>
            </button>
            <button onClick={() => videoInputRef.current && videoInputRef.current.click()} style={{ padding: "22px 10px", borderRadius: 14, background: DARK3, border: `1px solid ${BORDER}`, cursor: "pointer", color: TEXT }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🎞️</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Choose Video</div>
              <div style={{ fontSize: 10, color: MUTED }}>under 20MB</div>
            </button>
            <button onClick={() => startCamera("photo")} style={{ padding: "22px 10px", borderRadius: 14, background: DARK3, border: `1px solid ${GOLD}44`, cursor: "pointer", color: TEXT }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>📸</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Take Photo</div>
              <div style={{ fontSize: 10, color: MUTED }}>in-app camera</div>
            </button>
            <button onClick={() => startCamera("video")} style={{ padding: "22px 10px", borderRadius: 14, background: DARK3, border: `1px solid ${GOLD}44`, cursor: "pointer", color: TEXT }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🔴</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Record Video</div>
              <div style={{ fontSize: 10, color: MUTED }}>up to 30 sec</div>
            </button>
          </div>
        </div>
      )}

      {mode === "recording" && (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div style={{ borderRadius: 14, overflow: "hidden", border: `2px solid ${GOLD}44`, marginBottom: 12, background: "#000" }}>
            <video ref={camVideoRef} playsInline muted style={{ width: "100%", display: "block", transform: "scaleX(-1)", maxHeight: 340 }} />
          </div>
          {recordType === "photo" ? (
            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn onClick={resetMedia} outline style={{ flex: 1 }}>Cancel</GoldBtn>
              <GoldBtn onClick={snapPhoto} style={{ flex: 2 }}>📸 Capture</GoldBtn>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn onClick={resetMedia} outline style={{ flex: 1 }}>Cancel</GoldBtn>
              {!recording ? (
                <GoldBtn onClick={startRecording} style={{ flex: 2 }}>🔴 Start Recording</GoldBtn>
              ) : (
                <button onClick={stopRecording} style={{ flex: 2, background: RED, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "10px 22px" }}>⏹ Stop</button>
              )}
            </div>
          )}
          {recording && <div style={{ fontSize: 11, color: RED, marginTop: 8, fontWeight: 700 }}>● Recording... (auto-stops at 30s)</div>}
        </div>
      )}

      {mode === "preview" && preview && (
        <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", border: `1px solid ${BORDER}`, position: "relative" }}>
          {mediaKind === "video" ? (
            <video src={preview} controls playsInline style={{ width: "100%", maxHeight: 300, display: "block", background: "#000" }} />
          ) : (
            <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }} />
          )}
          <button onClick={resetMedia} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 8, color: TEXT, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>Change</button>
        </div>
      )}

      {mode === "preview" && (
        <>
          <label style={labelStyle}>Caption</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Say something about this look..." style={inputStyle} />

          <label style={labelStyle}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Select category...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <GoldBtn onClick={handlePost} disabled={uploading} style={{ width: "100%", padding: "13px" }}>
            {uploading ? "Posting..." : "Post to Feed 🚀"}
          </GoldBtn>
        </>
      )}
    </Modal>
  );
}

// ─── COMMENTS MODAL ───
function CommentsModal({ post, user, onClose, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    supabase.from("comments").select("*").eq("post_id", post.id).order("created_at", { ascending: true })
      .then(({ data }) => { setComments(data || []); setLoading(false); });
  };
  useEffect(() => { load(); }, [post.id]);

  const send = async () => {
    if (!user) { alert("Please sign in to comment."); return; }
    if (!text.trim()) return;
    setSending(true);
    const { error } = await supabase.from("comments").insert({
      post_id: post.id,
      user_id: user.id,
      user_name: user.name,
      text: text.trim()
    });
    if (!error) {
      const newCount = (comments.length + 1);
      await supabase.from("posts").update({ comments: newCount }).eq("id", post.id);
      if (onCountChange) onCountChange(newCount);
      setText("");
      load();
    }
    setSending(false);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: 0 }}>Comments</h3>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 14 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20, color: MUTED, fontSize: 13 }}>Loading...</div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>💬</div>
            <p style={{ color: MUTED, fontSize: 13 }}>No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <Avatar initials={(c.user_name || "U").slice(0, 2).toUpperCase()} size={34} color={GOLD} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{c.user_name}</div>
                <div style={{ fontSize: 13, color: `${TEXT}cc`, lineHeight: 1.5 }}>{c.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Add a comment..."
          style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "11px 12px", color: TEXT, fontSize: 14, outline: "none" }}
        />
        <GoldBtn onClick={send} disabled={sending} style={{ padding: "10px 18px" }}>{sending ? "..." : "Post"}</GoldBtn>
      </div>
    </Modal>
  );
}

// ─── HOME SCREEN ───
function HomeScreen({ user, onProfile, realPros = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [bookModal, setBookModal] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [commentPost, setCommentPost] = useState(null);

  const loadPosts = () => {
    setLoadingPosts(true);
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { setPosts(data || []); setLoadingPosts(false); });
  };
  useEffect(() => { loadPosts(); }, []);

  const findPro = (post) => {
    const all = [...realPros, ...professionals];
    return all.find(p => p.id === "db-" + post.pro_id || p.name === post.pro_name);
  };

  const realFiltered = activeCategory === "All"
    ? posts
    : posts.filter(p => (p.category || "").toLowerCase().includes(activeCategory.toLowerCase()));

  const demoFiltered = activeCategory === "All" ? feedVideos : feedVideos.filter(f => f.pro.category.toLowerCase().includes(activeCategory.toLowerCase()));
  const showDemo = posts.length === 0;

  const isPro = user && user.type === "professional";

  const toggleLike = async (post) => {
    const isLiked = liked[post.id];
    setLiked(p => ({ ...p, [post.id]: !isLiked }));
    const newCount = (post.likes || 0) + (isLiked ? -1 : 1);
    await supabase.from("posts").update({ likes: newCount }).eq("id", post.id);
    setPosts(ps => ps.map(p => p.id === post.id ? { ...p, likes: newCount } : p));
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${DARK}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</span>
          <span style={{ fontSize: 10, color: MUTED, marginLeft: 8, letterSpacing: 2 }}>BEAUTY MARKETPLACE</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isPro && <button onClick={() => setShowCreate(true)} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 8, color: "#0A0A0B", padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Post</button>}
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
        {loadingPosts && <div style={{ textAlign: "center", padding: 30, color: MUTED, fontSize: 13 }}>Loading feed...</div>}

        {realFiltered.map((post) => {
          const pro = findPro(post);
          return (
            <div key={post.id} style={{ borderRadius: 20, overflow: "hidden", marginBottom: 20, border: `1px solid ${BORDER}` }}>
              <div style={{ position: "relative", cursor: pro ? "pointer" : "default", background: "#000" }} onClick={() => pro && onProfile(pro)}>
                {post.media_type === "video" ? (
                  <video src={post.media_url} controls playsInline style={{ width: "100%", maxHeight: 420, display: "block", background: "#000" }} />
                ) : (
                  <img src={post.media_url} alt={post.caption || "post"} style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }} />
                )}
                {post.caption && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", padding: "30px 14px 12px", pointerEvents: "none" }}>
                    <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 15, color: TEXT }}>{post.caption}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar initials={(post.pro_name || "PR").slice(0, 2).toUpperCase()} size={28} color={GOLD} />
                      <span style={{ fontSize: 12, color: `${TEXT}cc` }}>{post.pro_name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ background: CARD, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 18 }}>
                  <button onClick={() => toggleLike(post)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: MUTED, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ fontSize: 16 }}>{liked[post.id] ? "❤️" : "🤍"}</span>{formatNum(post.likes || 0)}
                  </button>
                  <button onClick={() => setCommentPost(post)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: MUTED, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ fontSize: 16 }}>💬</span>{formatNum(post.comments || 0)}
                  </button>
                  <button onClick={() => setSaved(p => ({ ...p, [post.id]: !p[post.id] }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: MUTED, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ fontSize: 16 }}>{saved[post.id] ? "🔖" : "📎"}</span>
                  </button>
                </div>
                {pro && <GoldBtn onClick={() => setBookModal(pro)} style={{ padding: "7px 16px", fontSize: 12 }}>Book Now</GoldBtn>}
              </div>
            </div>
          );
        })}

        {showDemo && demoFiltered.map((item) => (
          <div key={"demo-" + item.id} style={{ borderRadius: 20, overflow: "hidden", marginBottom: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ background: item.gradient, height: 260, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => onProfile(item.pro)}>
              <div style={{ fontSize: 64, opacity: 0.4 }}>{item.emoji}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 54, height: 54, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: `2px solid ${GOLD}88`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: GOLD, fontSize: 18, marginLeft: 4 }}>▶</span>
              </div>
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

        {!loadingPosts && realFiltered.length === 0 && !showDemo && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: MUTED, fontSize: 13 }}>No posts in this category yet</p>
          </div>
        )}
      </div>
      {bookModal && <BookingModal pro={bookModal} user={user} onClose={() => setBookModal(null)} />}
      {showCreate && <CreatePostModal user={user} onClose={() => setShowCreate(false)} onPosted={loadPosts} />}
      {commentPost && <CommentsModal post={commentPost} user={user} onClose={() => setCommentPost(null)} onCountChange={(n) => setPosts(ps => ps.map(p => p.id === commentPost.id ? { ...p, comments: n } : p))} />}
    </div>
  );
}

// ─── EXPLORE SCREEN ───
function ExploreScreen({ onProfile, user, realPros = [] }) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [bookModal, setBookModal] = useState(null);

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
                <Avatar initials={pro.avatar} size={52} color={pro.color} img={pro.avatarUrl} />
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

// ─── BOOKINGS SCREEN (kept for reference) ───
// eslint-disable-next-line no-unused-vars
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

// ─── PORTFOLIO UPLOAD MODAL ───
function PortfolioUploadModal({ user, onClose }) {
  const CATEGORIES = ["Hairstylist", "Barber", "Makeup Artist", "Nail Technician", "Lash Tech", "Skincare"];

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [styleName, setStyleName] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("category").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data && data.category) setCategory(data.category); });
  }, [user]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (f.size > 5 * 1024 * 1024) { setError("Image is too large. Please use one under 5MB."); return; }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    setError("");
    if (!file) { setError("Please choose a photo first."); return; }
    if (!styleName.trim()) { setError("Please name the style (e.g. Knotless Braids)."); return; }
    if (!category) { setError("Please choose a category."); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("portfolio").upload(filePath, file);
      if (upErr) { setError("Upload failed: " + upErr.message); setUploading(false); return; }

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      const { error: insErr } = await supabase.from("portfolio").insert({
        pro_id: user.id,
        pro_name: user.name,
        category: category,
        style_name: styleName.trim(),
        image_url: imageUrl
      });
      if (insErr) { setError("Saved photo but couldn't record it: " + insErr.message); setUploading(false); return; }

      setUploading(false);
      setDone(true);
      setTimeout(() => { setDone(false); onClose(); }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  };

  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600 };
  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, background: DARK3, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 14, marginBottom: 16, boxSizing: "border-box" };

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Work Uploaded!</h3>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>Clients can now discover this style — and book you for it.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Upload Your Work 📸</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Show clients what you can do</span>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {error}</div>}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      <div onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ borderRadius: 14, border: `2px dashed ${preview ? GOLD : BORDER}`, background: DARK3, cursor: "pointer", marginBottom: 16, overflow: "hidden", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {preview ? (
          <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Tap to choose a photo</div>
            <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>From your camera or gallery</div>
          </div>
        )}
      </div>
      {preview && (
        <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ background: "none", border: "none", color: GOLD, fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>Change photo</button>
      )}

      <label style={labelStyle}>Style name</label>
      <input value={styleName} onChange={(e) => setStyleName(e.target.value)} placeholder="e.g. Knotless Braids, Taper Fade" style={inputStyle} />

      <label style={labelStyle}>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        <option value="">Select category...</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <GoldBtn onClick={handleUpload} disabled={uploading} style={{ width: "100%", padding: "13px" }}>
        {uploading ? "Uploading..." : "Upload Work 📸"}
      </GoldBtn>
    </Modal>
  );
}

// ─── EDIT PROFILE MODAL ───
// Lets any user (client or pro) edit their profile picture, name, username,
// bio, city and phone. The avatar photo goes to the "avatars" storage bucket;
// the details save to the profiles table (username & avatar_url columns).
function EditProfileModal({ user, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");   // current saved photo
  const [file, setFile] = useState(null);           // newly chosen photo
  const [preview, setPreview] = useState(null);      // local preview of new photo
  const fileInputRef = useRef(null);

  // Load current profile values
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("profiles").select("full_name, username, bio, location, phone, avatar_url").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setUsername(data.username || "");
          setBio(data.bio || "");
          setLocation(data.location || "");
          setPhone(data.phone || "");
          setAvatarUrl(data.avatar_url || "");
        }
        setLoading(false);
      });
  }, [user]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (f.size > 5 * 1024 * 1024) { setError("Image is too large. Please use one under 5MB."); return; }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setError("");
    if (!fullName.trim()) { setError("Please enter your name."); return; }
    setSaving(true);
    try {
      let newAvatarUrl = avatarUrl;

      // 1) if a new photo was chosen, upload it to the avatars bucket
      if (file) {
        const ext = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(filePath, file);
        if (upErr) { setError("Photo upload failed: " + upErr.message); setSaving(false); return; }
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
        newAvatarUrl = urlData.publicUrl;
      }

      // 2) save the details to the profiles table
      const updates = {
        full_name: fullName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phone: phone.trim(),
        avatar_url: newAvatarUrl
      };
      const { error: updErr } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (updErr) { setError("Couldn't save: " + updErr.message); setSaving(false); return; }

      setSaving(false);
      setDone(true);
      if (onSaved) onSaved({ name: updates.full_name, username: updates.username, avatarUrl: newAvatarUrl, bio: updates.bio, location: updates.location });
      setTimeout(() => { setDone(false); onClose(); }, 1400);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600 };
  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, background: DARK3, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 14, marginBottom: 16, boxSizing: "border-box" };

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
          <h3 style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Profile Updated!</h3>
          <p style={{ color: MUTED, fontSize: 13 }}>Your changes are now live.</p>
        </div>
      </Modal>
    );
  }

  if (loading) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "30px 0", color: MUTED }}>Loading your profile...</div>
      </Modal>
    );
  }

  const shownPhoto = preview || avatarUrl || null;

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Edit Profile</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Update your photo & details</span>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {error}</div>}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
        <div onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ cursor: "pointer", position: "relative" }}>
          {shownPhoto ? (
            <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: `2px solid ${GOLD}` }}>
              <img src={shownPhoto} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: `${GOLD}22`, border: `2px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, color: GOLD }}>
              {(fullName || user.name || "U").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: `2px solid ${DARK2}` }}>📷</div>
        </div>
        <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ background: "none", border: "none", color: GOLD, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>Change photo</button>
      </div>

      <label style={labelStyle}>Name</label>
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" style={inputStyle} />

      <label style={labelStyle}>Username</label>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED, fontSize: 14 }}>@</span>
        <input value={username} onChange={(e) => setUsername(e.target.value.replace(/\s+/g, "").toLowerCase())} placeholder="username" style={{ ...inputStyle, marginBottom: 0, paddingLeft: 26 }} />
      </div>

      <label style={labelStyle}>Bio</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people a bit about you..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />

      <label style={labelStyle}>City</label>
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lagos, Abuja..." style={inputStyle} />

      <label style={labelStyle}>Phone</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0801 234 5678" style={inputStyle} />

      <GoldBtn onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "13px" }}>
        {saving ? "Saving..." : "Save Changes"}
      </GoldBtn>
    </Modal>
  );
}

// ─── COUNTRY LIST ───
const COUNTRIES = [
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "ET", flag: "🇪🇹", name: "Ethiopia" },
  { code: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "SN", flag: "🇸🇳", name: "Senegal" },
  { code: "CI", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "CM", flag: "🇨🇲", name: "Cameroon" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
];

// ─── NOTIFICATIONS SETTINGS PAGE ───
function NotificationsSettingsPage({ user, onBack }) {
  const NOTIF_KEYS = [
    { key: "bookings", label: "Booking confirmations", sub: "When a booking is confirmed or cancelled" },
    { key: "messages", label: "New messages", sub: "Messages from professionals" },
    { key: "promos", label: "Promotions & offers", sub: "Deals and special offers from STYLEX" },
    { key: "followers", label: "New followers", sub: "When someone follows you" },
    { key: "activity", label: "Post likes & comments", sub: "Activity on your posts" },
    { key: "updates", label: "App updates", sub: "New features and announcements" },
  ];
  const [prefs, setPrefs] = useState({ bookings: true, messages: true, promos: true, followers: true, activity: true, updates: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("profiles").select("notification_settings").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data && data.notification_settings) setPrefs({ ...prefs, ...data.notification_settings });
        setLoading(false);
      });
  }, [user]);

  const toggle = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    await supabase.from("profiles").update({ notification_settings: updated }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back to Settings</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, margin: 0 }}>🔔 Notifications</h3>
        {saving && <span style={{ fontSize: 11, color: MUTED }}>Saving...</span>}
        {saved && <span style={{ fontSize: 11, color: GREEN }}>✓ Saved</span>}
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 30, color: MUTED }}>Loading...</div> : (
        NOTIF_KEYS.map(item => (
          <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${BORDER}` }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{item.label}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{item.sub}</div>
            </div>
            <button onClick={() => toggle(item.key)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: prefs[item.key] ? GOLD : BORDER, position: "relative", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: prefs[item.key] ? 23 : 3, transition: "left 0.2s" }} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ─── PRIVACY SETTINGS PAGE ───
function PrivacySettingsPage({ user, onBack, onDeleteAccount }) {
  const [privacyPage, setPrivacyPage] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("is_public").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setIsPublic(data.is_public !== false); });
  }, [user]);

  const toggleVisibility = async () => {
    const newVal = !isPublic;
    setIsPublic(newVal);
    setVisibilitySaving(true);
    await supabase.from("profiles").update({ is_public: newVal }).eq("id", user.id);
    setVisibilitySaving(false);
  };

  const loadBlocked = async () => {
    setLoadingBlocked(true);
    const { data } = await supabase.from("blocked_users").select("*").eq("blocker_id", user.id);
    setBlockedUsers(data || []);
    setLoadingBlocked(false);
  };

  const unblock = async (blockedId) => {
    await supabase.from("blocked_users").delete().eq("blocker_id", user.id).eq("blocked_id", blockedId);
    setBlockedUsers(bs => bs.filter(b => b.blocked_id !== blockedId));
  };

  const handleChangePassword = async () => {
    setPwError(""); setPwSuccess(false);
    if (!newPassword) { setPwError("Enter a new password."); return; }
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords don't match."); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) { setPwError(error.message); return; }
    setPwSuccess(true);
    setNewPassword(""); setConfirmPassword(""); setOldPassword("");
    setTimeout(() => { setPwSuccess(false); setPrivacyPage(null); }, 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") { setDeleteError('Type DELETE in capital letters to confirm.'); return; }
    setDeleting(true);
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.signOut();
    if (onDeleteAccount) onDeleteAccount();
  };

  const menuItems = [
    { icon: "🔑", label: "Change Password", sub: "Update your account password", page: "password" },
    { icon: "👁️", label: "Profile Visibility", sub: isPublic ? "Currently: Public" : "Currently: Private", page: "visibility" },
    { icon: "🚫", label: "Blocked Users", sub: "Manage users you've blocked", page: "blocked", action: () => { loadBlocked(); setPrivacyPage("blocked"); } },
    { icon: "🗑️", label: "Delete Account", sub: "Permanently delete your STYLEX account", page: "delete", danger: true },
  ];

  if (privacyPage === "password") return (
    <div>
      <button onClick={() => setPrivacyPage(null)} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back</button>
      <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 20 }}>🔑 Change Password</h3>
      {pwError && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {pwError}</div>}
      {pwSuccess && <div style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: GREEN, marginBottom: 14 }}>✅ Password updated successfully!</div>}
      {[
        { label: "NEW PASSWORD", value: newPassword, set: setNewPassword, placeholder: "Min 8 characters" },
        { label: "CONFIRM NEW PASSWORD", value: confirmPassword, set: setConfirmPassword, placeholder: "Re-enter new password" },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>{f.label}</label>
          <input type="password" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
      ))}
      <GoldBtn onClick={handleChangePassword} disabled={pwSaving} style={{ width: "100%", padding: "13px", marginTop: 6 }}>
        {pwSaving ? "Updating..." : "Update Password"}
      </GoldBtn>
    </div>
  );

  if (privacyPage === "visibility") return (
    <div>
      <button onClick={() => setPrivacyPage(null)} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back</button>
      <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 8 }}>👁️ Profile Visibility</h3>
      <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Control whether your profile can be found and viewed by others on STYLEX.</p>
      {[
        { val: true, icon: "🌍", label: "Public", sub: "Anyone can view your profile and find you in Explore" },
        { val: false, icon: "🔒", label: "Private", sub: "Only people you approve can see your profile" },
      ].map(opt => (
        <button key={String(opt.val)} onClick={() => { setIsPublic(opt.val); toggleVisibility(); }} style={{ width: "100%", background: isPublic === opt.val ? `${GOLD}15` : CARD, border: `1.5px solid ${isPublic === opt.val ? GOLD : BORDER}`, borderRadius: 14, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>{opt.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: isPublic === opt.val ? GOLD : TEXT }}>{opt.label}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{opt.sub}</div>
          </div>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${isPublic === opt.val ? GOLD : BORDER}`, background: isPublic === opt.val ? GOLD : "none", flexShrink: 0 }} />
        </button>
      ))}
      {visibilitySaving && <div style={{ textAlign: "center", fontSize: 12, color: MUTED }}>Saving...</div>}
    </div>
  );

  if (privacyPage === "blocked") return (
    <div>
      <button onClick={() => setPrivacyPage(null)} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back</button>
      <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 16 }}>🚫 Blocked Users</h3>
      {loadingBlocked ? <div style={{ textAlign: "center", padding: 30, color: MUTED }}>Loading...</div>
        : blockedUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
            <p style={{ color: MUTED, fontSize: 13 }}>You haven't blocked anyone</p>
          </div>
        ) : blockedUsers.map(b => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, background: CARD, borderRadius: 14, padding: "12px 14px", border: `1px solid ${BORDER}`, marginBottom: 10 }}>
            <Avatar initials={(b.blocked_name || "U").slice(0, 2).toUpperCase()} size={40} color={MUTED} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{b.blocked_name || "Unknown User"}</div>
            </div>
            <button onClick={() => unblock(b.blocked_id)} style={{ background: `${RED}15`, border: `1px solid ${RED}33`, borderRadius: 8, color: RED, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Unblock</button>
          </div>
        ))
      }
    </div>
  );

  if (privacyPage === "delete") return (
    <div>
      <button onClick={() => setPrivacyPage(null)} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back</button>
      <h3 style={{ color: RED, fontWeight: 800, fontSize: 17, marginBottom: 8 }}>🗑️ Delete Account</h3>
      <div style={{ background: `${RED}11`, border: `1px solid ${RED}33`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: RED, marginBottom: 8 }}>⚠️ This cannot be undone</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Deleting your account will permanently remove your profile, bookings, posts and all data from STYLEX.</div>
      </div>
      {deleteError && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: RED, marginBottom: 14 }}>⚠️ {deleteError}</div>}
      <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 8 }}>TYPE "DELETE" TO CONFIRM</label>
      <input value={deleteConfirm} onChange={e => { setDeleteConfirm(e.target.value); setDeleteError(""); }} placeholder='Type DELETE here' style={{ width: "100%", background: DARK3, border: `1.5px solid ${RED}55`, borderRadius: 12, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
      <button onClick={handleDeleteAccount} disabled={deleting || deleteConfirm !== "DELETE"} style={{ width: "100%", background: deleteConfirm === "DELETE" ? RED : DARK3, border: "none", borderRadius: 12, color: deleteConfirm === "DELETE" ? "#fff" : MUTED, padding: "14px", fontSize: 14, fontWeight: 700, cursor: deleteConfirm === "DELETE" ? "pointer" : "not-allowed" }}>
        {deleting ? "Deleting..." : "Permanently Delete My Account"}
      </button>
    </div>
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back to Settings</button>
      <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 16 }}>🔒 Privacy & Security</h3>
      {menuItems.map(item => (
        <button key={item.label} onClick={item.action || (() => setPrivacyPage(item.page))} style={{ background: item.danger ? `${RED}11` : CARD, border: `1px solid ${item.danger ? RED + "33" : BORDER}`, borderRadius: 14, padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%", marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: item.danger ? RED : TEXT }}>{item.label}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{item.sub}</div>
          </div>
          <span style={{ color: MUTED, fontSize: 18 }}>›</span>
        </button>
      ))}
    </div>
  );
}

// ─── LANGUAGE & REGION SETTINGS PAGE ───
function LanguageSettingsPage({ user, onBack }) {
  const [country, setCountry] = useState("NG");
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("NGN — Nigerian Naira (₦)");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("profiles").select("country, language, currency").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (data.country) setCountry(data.country);
          if (data.language) setLanguage(data.language);
          if (data.currency) setCurrency(data.currency);
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ country, language, currency }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectStyle = { width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", marginBottom: 16 };
  const labelStyle = { fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 8 };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back to Settings</button>
      <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 16 }}>🌍 Language & Region</h3>
      {loading ? <div style={{ textAlign: "center", padding: 30, color: MUTED }}>Loading...</div> : (
        <>
          <label style={labelStyle}>YOUR COUNTRY</label>
          <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
          </select>
          <label style={labelStyle}>LANGUAGE</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={selectStyle}>
            {["English", "French", "Arabic", "Swahili", "Yoruba", "Igbo", "Hausa", "Portuguese", "Spanish"].map(l => <option key={l}>{l}</option>)}
          </select>
          <label style={labelStyle}>CURRENCY</label>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={selectStyle}>
            {["NGN — Nigerian Naira (₦)", "GHS — Ghanaian Cedi", "KES — Kenyan Shilling", "ZAR — South African Rand", "USD — US Dollar ($)", "GBP — British Pound (£)", "EUR — Euro (€)", "CAD — Canadian Dollar", "AED — UAE Dirham"].map(c => <option key={c}>{c}</option>)}
          </select>
          {saved && <div style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: GREEN, marginBottom: 14 }}>✅ Preferences saved!</div>}
          <GoldBtn onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "13px" }}>
            {saving ? "Saving..." : "Save Preferences"}
          </GoldBtn>
        </>
      )}
    </div>
  );
}

// ─── HELP & SUPPORT PAGE ───
function HelpSupportPage({ onBack }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const FAQS = [
    { q: "How do I book a professional?", a: "Go to Explore, find a professional you like, tap their profile and click 'Book Now'. Choose your date, time and service." },
    { q: "How do payments work?", a: "Payments are processed securely via Flutterwave. A 20% platform fee applies to all bookings. You can pay by card, bank transfer or USSD." },
    { q: "How do I become a verified professional?", a: "Go to your profile → Settings → Verification & Boost. A gold verified badge costs ₦2,500/month and increases client trust." },
    { q: "Can I cancel a booking?", a: "Yes. Go to your Bookings tab, find the booking and tap Cancel. Cancellation policies vary by professional." },
    { q: "How do I report a user?", a: "On any profile, tap the options menu and select 'Report'. Our team reviews all reports within 24 hours." },
    { q: "Is STYLEX available in my country?", a: "STYLEX is a global beauty marketplace available in 20+ countries. Use the country filter in Explore to find professionals near you." },
  ];

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back to Settings</button>
      <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 16 }}>❓ Help & Support</h3>

      {/* Contact options */}
      {[
        { icon: "💬", label: "Contact Support", sub: "Chat with the STYLEX team", action: () => window.open("mailto:support@stylex.app") },
        { icon: "📧", label: "Email Us", sub: "support@stylex.app", action: () => window.open("mailto:support@stylex.app") },
        { icon: "🐛", label: "Report a Bug", sub: "Something not working? Let us know", action: () => window.open("mailto:bugs@stylex.app?subject=Bug Report") },
        { icon: "⭐", label: "Rate STYLEX", sub: "Enjoying the app? Leave a review", action: () => {} },
      ].map(item => (
        <button key={item.label} onClick={item.action} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%", marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{item.label}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{item.sub}</div>
          </div>
          <span style={{ color: MUTED, fontSize: 18 }}>›</span>
        </button>
      ))}

      {/* FAQs */}
      <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, margin: "20px 0 12px" }}>📖 Frequently Asked Questions</div>
      {FAQS.map((faq, i) => (
        <div key={i} style={{ background: CARD, border: `1px solid ${activeFaq === i ? GOLD + "55" : BORDER}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
          <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ background: "none", border: "none", width: "100%", padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, flex: 1, paddingRight: 10 }}>{faq.q}</span>
            <span style={{ color: GOLD, fontSize: 16, flexShrink: 0 }}>{activeFaq === i ? "▲" : "▼"}</span>
          </button>
          {activeFaq === i && (
            <div style={{ padding: "0 16px 14px", fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{faq.a}</div>
          )}
        </div>
      ))}

      {/* Legal links */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 12, color: MUTED, fontWeight: 600 }}>📜 Terms of Service</button>
        <button style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 12, color: MUTED, fontWeight: 600 }}>🔐 Privacy Policy</button>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Version 1.0.0 · Global Beauty Marketplace</div>
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN (CLIENT) ───
function ProfileScreen({ user, onLogout, onUserUpdate, refreshKey = 0 }) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [settingsPage, setSettingsPage] = useState(null); // "notifications"|"privacy"|"payment"|"language"|"help"
  const [showEdit, setShowEdit] = useState(false);
  const [myAvatar, setMyAvatar] = useState("");
  const [myUsername, setMyUsername] = useState("");
  const [myName, setMyName] = useState(user?.name || "");
  const [isVerified, setIsVerified] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [following, setFollowing] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingTab, setLoadingTab] = useState(false);

  // Load profile info
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles")
      .select("full_name, username, avatar_url, is_verified, is_boosted")
      .eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setMyName(data.full_name || user.name || "");
          setMyUsername(data.username || "");
          setMyAvatar(data.avatar_url || "");
          setIsVerified(data.is_verified === true);
          setIsBoosted(data.is_boosted === true);
        }
      });
  }, [user, refreshKey]);

  // Load tab data
  useEffect(() => {
    if (!user) return;
    setLoadingTab(true);
    if (activeTab === "bookings") {
      supabase.from("bookings").select("*").eq("client_id", user.id).order("created_at", { ascending: false })
        .then(({ data }) => { setBookings(data || []); setLoadingTab(false); });
    } else if (activeTab === "following") {
      supabase.from("follows").select("following_id, following_name, following_avatar").eq("follower_id", user.id)
        .then(({ data }) => { setFollowing(data || []); setLoadingTab(false); });
    } else {
      // saved, settings — no async load needed
      setLoadingTab(false);
    }
  }, [user, activeTab, refreshKey]);

  const tabs = [
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "saved", icon: "🔖", label: "Saved" },
    { id: "following", icon: "👥", label: "Following" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const initials = (myName || user?.name || "U").slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: DARK, paddingBottom: 160 }}>
      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(180deg, ${DARK2} 0%, ${DARK} 100%)`, padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
          <Avatar initials={initials} size={80} color={GOLD} img={myAvatar} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: TEXT }}>{myName || user?.name}</span>
              <VerifiedBadge verified={isVerified} size={16} />
              {isBoosted && <span style={{ fontSize: 11, color: GREEN }}>🚀</span>}
            </div>
            {myUsername && (
              <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 6 }}>@{myUsername}</div>
            )}
            <div style={{ fontSize: 12, color: MUTED }}>{user?.email}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 11, background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}33`, borderRadius: 20, padding: "3px 10px", fontWeight: 700 }}>CLIENT</span>
            </div>
          </div>
        </div>

        {/* Edit Profile button */}
        <button onClick={() => setShowEdit(true)} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          ✏️ Edit Profile
        </button>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, background: "none", border: "none", borderBottom: activeTab === t.id ? `2px solid ${GOLD}` : "2px solid transparent", padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginBottom: -1 }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 9, color: activeTab === t.id ? GOLD : MUTED, fontWeight: 600, letterSpacing: 0.5 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ padding: "20px" }}>
        {loadingTab && activeTab !== "settings" && activeTab !== "saved" && <div style={{ textAlign: "center", padding: 30, color: MUTED, fontSize: 13 }}>Loading...</div>}

        {/* Bookings Tab */}
        {!loadingTab && activeTab === "bookings" && (
          bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <p style={{ color: MUTED, fontSize: 13 }}>No bookings yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookings.map((b, i) => (
                <div key={i} style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{b.service}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `${GREEN}22`, color: GREEN, border: `1px solid ${GREEN}44` }}>{(b.status || "confirmed").toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>📅 {b.date} · 🕐 {b.time}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>₦{b.price?.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 4, fontFamily: "monospace" }}>{b.reference}</div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Saved Tab */}
        {!loadingTab && activeTab === "saved" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔖</div>
            <p style={{ color: MUTED, fontSize: 13 }}>Saved posts coming soon</p>
          </div>
        )}

        {/* Following Tab */}
        {!loadingTab && activeTab === "following" && (
          following.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
              <p style={{ color: MUTED, fontSize: 13 }}>You haven't followed anyone yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {following.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: CARD, borderRadius: 14, padding: "12px 14px", border: `1px solid ${BORDER}` }}>
                  <Avatar initials={(f.following_name || "P").slice(0, 2).toUpperCase()} size={42} color={GOLD} img={f.following_avatar || null} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{f.following_name}</span>
                </div>
              ))}
            </div>
          )
        )}

        {/* Settings Tab — always renders instantly */}
        {activeTab === "settings" && !settingsPage && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { id: "edit", icon: "✏️", label: "Edit Profile", sub: "Change photo, name, username, bio", action: () => setShowEdit(true) },
              { id: "notifications", icon: "🔔", label: "Notifications", sub: "Booking alerts, messages, promotions" },
              { id: "privacy", icon: "🔒", label: "Privacy & Security", sub: "Password, account privacy, blocked users" },
              { id: "payment", icon: "💳", label: "Payment Methods", sub: "Cards, bank accounts, STYLEX wallet" },
              { id: "language", icon: "🌍", label: "Language & Region", sub: "Country, currency, language" },
              { id: "help", icon: "❓", label: "Help & Support", sub: "FAQs, contact us, report a problem" },
            ].map(item => (
              <button key={item.id} onClick={item.action || (() => setSettingsPage(item.id))} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{item.sub}</div>
                </div>
                <span style={{ color: MUTED, fontSize: 18 }}>›</span>
              </button>
            ))}
            <button onClick={onLogout} style={{ background: `${RED}11`, border: `1px solid ${RED}33`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}>
              <span style={{ fontSize: 22 }}>🚪</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: RED }}>Log Out</div>
                <div style={{ fontSize: 12, color: MUTED }}>Sign out of your account</div>
              </div>
            </button>
          </div>
        )}

        {/* ── NOTIFICATIONS PAGE ── */}
        {activeTab === "settings" && settingsPage === "notifications" && (
          <NotificationsSettingsPage user={user} onBack={() => setSettingsPage(null)} />
        )}

        {/* ── PRIVACY & SECURITY PAGE ── */}
        {activeTab === "settings" && settingsPage === "privacy" && (
          <PrivacySettingsPage user={user} onBack={() => setSettingsPage(null)} onDeleteAccount={onLogout} />
        )}

        {/* ── PAYMENT METHODS PAGE ── */}
        {activeTab === "settings" && settingsPage === "payment" && (
          <div>
            <button onClick={() => setSettingsPage(null)} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0 }}>← Back to Settings</button>
            <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 16 }}>💳 Payment Methods</h3>
            <div style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: GOLD, marginBottom: 4 }}>STYLEX Wallet</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>₦0.00</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Available balance</div>
            </div>
            {[
              { icon: "➕", label: "Add Debit/Credit Card", sub: "Visa, Mastercard, Verve" },
              { icon: "🏦", label: "Add Bank Account", sub: "Link your bank for transfers" },
              { icon: "📱", label: "Add Mobile Money", sub: "MTN, Airtel, Glo Money" },
            ].map(item => (
              <button key={item.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%", marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{item.sub}</div>
                </div>
                <span style={{ color: MUTED, fontSize: 18 }}>›</span>
              </button>
            ))}
            <div style={{ background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 14, marginTop: 6 }}>
              <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 4 }}>💡 Coming Soon</div>
              <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>Real payment processing via Flutterwave is being activated. Your card details will be fully encrypted and secure.</div>
            </div>
          </div>
        )}

        {/* ── LANGUAGE & REGION PAGE ── */}
        {activeTab === "settings" && settingsPage === "language" && (
          <LanguageSettingsPage user={user} onBack={() => setSettingsPage(null)} />
        )}

        {/* ── HELP & SUPPORT PAGE ── */}
        {activeTab === "settings" && settingsPage === "help" && (
          <HelpSupportPage onBack={() => setSettingsPage(null)} />
        )}
      </div>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={(fields) => {
            setMyAvatar(fields.avatarUrl || "");
            setMyUsername(fields.username || "");
            setMyName(fields.name || "");
            if (onUserUpdate) onUserUpdate({ name: fields.name });
          }}
        />
      )}
    </div>
  );
}

// ─── PRO PROFILE SCREEN ───
function ProProfileScreen({ pro, user, onBack, onBook }) {
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [myAvatar, setMyAvatar] = useState(pro.avatarUrl || "");
  const [myUsername, setMyUsername] = useState(pro.username || "");
  const [myName, setMyName] = useState(pro.name || "");
  const [isVerified, setIsVerified] = useState(pro.verified || false);
  const [isBoosted, setIsBoosted] = useState(pro.boosted || false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [products, setProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [reviews, setReviews] = useState([]);
  const [showPortUpload, setShowPortUpload] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [loadingTab, setLoadingTab] = useState(false);

  const isOwner = user && (pro.id === "db-" + user.id || pro.id === user.id);
  const proDbId = typeof pro.id === "string" && pro.id.startsWith("db-") ? pro.id.replace("db-", "") : pro.id;

  useEffect(() => {
    if (!proDbId) return;
    // follower count
    supabase.from("follows").select("id", { count: "exact" }).eq("following_id", proDbId)
      .then(({ count }) => setFollowerCount(count || 0));
    // is following?
    if (user) {
      supabase.from("follows").select("id").eq("follower_id", user.id).eq("following_id", proDbId).maybeSingle()
        .then(({ data }) => setIsFollowing(!!data));
    }
    // pro's latest badge & avatar info
    supabase.from("profiles").select("is_verified, is_boosted, avatar_url, username, full_name").eq("id", proDbId).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setIsVerified(data.is_verified === true);
          setIsBoosted(data.is_boosted === true);
          if (data.avatar_url) setMyAvatar(data.avatar_url);
          if (data.username) setMyUsername(data.username);
          if (data.full_name) setMyName(data.full_name);
        }
      });
  }, [proDbId, user]);

  useEffect(() => {
    if (!proDbId) return;
    setLoadingTab(true);
    if (activeTab === "posts") {
      supabase.from("posts").select("*").eq("pro_id", proDbId).order("created_at", { ascending: false })
        .then(({ data }) => { setPosts(data || []); setLoadingTab(false); });
    } else if (activeTab === "portfolio") {
      supabase.from("portfolio").select("*").eq("pro_id", proDbId).order("created_at", { ascending: false })
        .then(({ data }) => { setPortfolio(data || []); setLoadingTab(false); });
    } else if (activeTab === "products") {
      supabase.from("products").select("*").eq("seller_id", proDbId).eq("status", "active")
        .then(({ data }) => { setProducts(data || []); setLoadingTab(false); });
    } else if (activeTab === "reviews") {
      supabase.from("bookings").select("*").eq("status", "confirmed").limit(10)
        .then(({ data }) => { setReviews(data || []); setLoadingTab(false); });
    } else {
      setLoadingTab(false);
    }
  }, [proDbId, activeTab]);

  const handleFollow = async () => {
    if (!user) return;
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", proDbId);
      setIsFollowing(false);
      setFollowerCount(c => Math.max(0, c - 1));
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: proDbId, following_name: pro.name, following_avatar: myAvatar || null });
      setIsFollowing(true);
      setFollowerCount(c => c + 1);
    }
  };

  const tabs = [
    { id: "posts", icon: "▦", label: "Posts" },
    { id: "portfolio", icon: "🖼", label: "Portfolio" },
    { id: "services", icon: "💼", label: "Services" },
    { id: "products", icon: "🛍", label: "Products" },
    { id: "reviews", icon: "⭐", label: "Reviews" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const initials = (myName || pro.name || "P").slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: DARK, paddingBottom: 160 }}>
      {/* Back button */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: `${DARK}ee`, backdropFilter: "blur(10px)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={onBack} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{myName || pro.name}</span>
        {isVerified && <VerifiedBadge verified size={15} />}
      </div>

      {/* Header */}
      <div style={{ background: `linear-gradient(180deg, ${DARK2} 0%, ${DARK} 100%)`, padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
          <Avatar initials={initials} size={80} color={pro.color || GOLD} img={myAvatar} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontWeight: 800, fontSize: 17, color: TEXT }}>{myName || pro.name}</span>
              <VerifiedBadge verified={isVerified} size={15} />
              {isBoosted && <span style={{ fontSize: 11, color: GREEN }}>🚀</span>}
            </div>
            {myUsername && <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 4 }}>@{myUsername}</div>}
            <Badge text={pro.category} color={pro.color || GOLD} />
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>📍 {pro.location}</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14, background: DARK3, borderRadius: 14, overflow: "hidden", border: `1px solid ${BORDER}` }}>
          {[
            { label: "Followers", value: formatNum(followerCount) },
            { label: "Rating", value: pro.rating ? `${pro.rating}★` : "—" },
            { label: "Reviews", value: pro.reviews || 0 },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "12px 8px", borderRight: i < 2 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: GOLD }}>{s.value}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        {pro.bio && <p style={{ fontSize: 13, color: `${TEXT}bb`, lineHeight: 1.6, margin: "0 0 14px" }}>{pro.bio}</p>}

        {/* Action buttons */}
        {isOwner ? (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button onClick={() => setShowEdit(true)} style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✏️ Edit Profile</button>
            <button onClick={() => setShowDash(true)} style={{ flex: 1, background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 10, color: GOLD, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>⚙️ Dashboard</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button onClick={handleFollow} style={{ flex: 1, background: isFollowing ? DARK3 : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: isFollowing ? `1px solid ${BORDER}` : "none", borderRadius: 10, color: isFollowing ? TEXT : "#0A0A0B", padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {isFollowing ? "Following ✓" : "Follow"}
            </button>
            <GoldBtn onClick={() => onBook(pro)} style={{ flex: 1, padding: "10px" }}>Book Now</GoldBtn>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", borderBottom: `1px solid ${BORDER}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flexShrink: 0, background: "none", border: "none", borderBottom: activeTab === t.id ? `2px solid ${GOLD}` : "2px solid transparent", padding: "10px 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginBottom: -1 }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 9, color: activeTab === t.id ? GOLD : MUTED, fontWeight: 600 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: "16px 16px" }}>
        {loadingTab && <div style={{ textAlign: "center", padding: 30, color: MUTED, fontSize: 13 }}>Loading...</div>}

        {/* Posts grid */}
        {!loadingTab && activeTab === "posts" && (
          <>
            {isOwner && (
              <button onClick={() => setShowCreatePost(true)} style={{ width: "100%", background: `${GOLD}15`, border: `1px dashed ${GOLD}55`, borderRadius: 12, color: GOLD, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>+ Create New Post</button>
            )}
            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                <p style={{ color: MUTED, fontSize: 13 }}>No posts yet</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
                {posts.map(post => (
                  <div key={post.id} onClick={() => post.media_type === "video" && setVideoModal(post)} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden", position: "relative", cursor: "pointer", background: DARK3 }}>
                    {post.media_type === "video" ? (
                      <>
                        <video src={post.media_url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} muted playsInline />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 20, color: "#fff", opacity: 0.9 }}>▶</span>
                        </div>
                      </>
                    ) : (
                      <img src={post.media_url} alt={post.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Portfolio grid */}
        {!loadingTab && activeTab === "portfolio" && (
          <>
            {isOwner && (
              <button onClick={() => setShowPortUpload(true)} style={{ width: "100%", background: `${GOLD}15`, border: `1px dashed ${GOLD}55`, borderRadius: 12, color: GOLD, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>+ Add Portfolio Work</button>
            )}
            {portfolio.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🖼️</div>
                <p style={{ color: MUTED, fontSize: 13 }}>No portfolio photos yet</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
                {portfolio.map(item => (
                  <div key={item.id} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden", background: DARK3 }}>
                    <img src={item.image_url} alt={item.style_name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Services & Pricing */}
        {!loadingTab && activeTab === "services" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pro.tags && pro.tags.map((tag, i) => (
              <div key={tag} style={{ background: CARD, borderRadius: 14, padding: "14px 16px", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{tag}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{45 + i * 15} minutes</div>
                </div>
                <div>
                  {pro.shopPrice && <div style={{ fontSize: 13, color: GOLD, fontWeight: 700 }}>🏪 ₦{(pro.shopPrice + i * 2000).toLocaleString()}</div>}
                  {pro.mobilePrice && <div style={{ fontSize: 12, color: MUTED }}>🚗 ₦{(pro.mobilePrice + i * 2000).toLocaleString()}</div>}
                </div>
              </div>
            ))}
            {(!pro.tags || pro.tags.length === 0) && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <p style={{ color: MUTED, fontSize: 13 }}>No services listed yet</p>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {!loadingTab && activeTab === "products" && (
          products.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🛍️</div>
              <p style={{ color: MUTED, fontSize: 13 }}>No products listed</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {products.map(p => (
                <div key={p.id} style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ height: 90, background: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{p.emoji || "🛍️"}</div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: TEXT, marginBottom: 6 }}>{p.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: GOLD }}>₦{p.price?.toLocaleString()}</span>
                      <button style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, color: GOLD, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Buy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Reviews */}
        {!loadingTab && activeTab === "reviews" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
            <p style={{ color: MUTED, fontSize: 13 }}>Reviews coming soon</p>
          </div>
        )}

        {/* Settings (owner only) */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {isOwner && (
              <>
                <button onClick={() => setShowEdit(true)} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>✏️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Edit Profile</div>
                    <div style={{ fontSize: 12, color: MUTED }}>Photo, name, username, bio</div>
                  </div>
                  <span style={{ color: MUTED, fontSize: 16 }}>›</span>
                </button>
                <button onClick={() => setShowDash(true)} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>📊</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Pro Dashboard</div>
                    <div style={{ fontSize: 12, color: MUTED }}>Services, pricing, availability</div>
                  </div>
                  <span style={{ color: MUTED, fontSize: 16 }}>›</span>
                </button>
                <button onClick={() => setShowSub(true)} style={{ background: CARD, border: `1px solid ${GOLD}22`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: GOLD }}>Verification & Boost</div>
                    <div style={{ fontSize: 12, color: MUTED }}>Get verified · Reach more clients</div>
                  </div>
                  <span style={{ color: MUTED, fontSize: 16 }}>›</span>
                </button>
              </>
            )}
            <button style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Notifications</div>
                <div style={{ fontSize: 12, color: MUTED }}>Manage your alerts</div>
              </div>
              <span style={{ color: MUTED, fontSize: 16 }}>›</span>
            </button>
            <button style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
              <span style={{ fontSize: 22 }}>❓</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Help & Support</div>
                <div style={{ fontSize: 12, color: MUTED }}>FAQs, contact us</div>
              </div>
              <span style={{ color: MUTED, fontSize: 16 }}>›</span>
            </button>
            {isOwner && (
              <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} style={{ background: `${RED}11`, border: `1px solid ${RED}33`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>🚪</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: RED }}>Log Out</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Sign out of your account</div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Video full-screen modal */}
      {videoModal && (
        <div onClick={() => setVideoModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video src={videoModal.media_url} controls autoPlay playsInline style={{ maxWidth: "100%", maxHeight: "90vh" }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setVideoModal(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", padding: "8px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
      )}

      {showPortUpload && <PortfolioUploadModal user={user} onClose={() => setShowPortUpload(false)} />}
      {showCreatePost && <CreatePostModal user={user} onClose={() => setShowCreatePost(false)} onPosted={() => { setShowCreatePost(false); setActiveTab("posts"); }} />}
      {showDash && <ProDashboard user={user} onClose={() => setShowDash(false)} onOpenSubscription={() => { setShowDash(false); setShowSub(true); }} />}
      {showSub && <SubscriptionModal user={user} onClose={() => setShowSub(false)} />}
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={(fields) => {
            setMyAvatar(fields.avatarUrl || "");
            setMyUsername(fields.username || "");
            setMyName(fields.name || "");
          }}
        />
      )}
    </div>
  );
}

// ─── STYLEX ASSISTANT (AI CHATBOT) ───
function StylexAssistant({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your STYLEX beauty assistant ✨ Ask me anything about hair, makeup, skincare, or finding the right professional." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.text })) })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply || "Sorry, I couldn't get a response. Please try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: 86, right: 20, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${GOLD}55`, zIndex: 200 }}>
        {open ? "✕" : "✨"}
      </button>

      {open && (
        <div style={{ position: "fixed", bottom: 150, right: 20, width: 320, maxHeight: 440, background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 8px 40px rgba(0,0,0,0.6)`, zIndex: 200 }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: TEXT }}>STYLEX Assistant</div>
              <div style={{ fontSize: 10, color: GREEN }}>● Online</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", background: m.role === "user" ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : DARK3, color: m.role === "user" ? "#0A0A0B" : TEXT, borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px", padding: "10px 13px", fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: DARK3, borderRadius: "14px 14px 14px 2px", padding: "10px 14px", color: MUTED, fontSize: 13 }}>Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask me anything..." style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", color: TEXT, fontSize: 13, outline: "none" }} />
            <button onClick={send} disabled={loading} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 10, width: 38, height: 38, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN APP ───
function StylexApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [viewingPro, setViewingPro] = useState(null);
  const [realPros, setRealPros] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerBookPro, setScannerBookPro] = useState(null);
  const [bookingPro, setBookingPro] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [profileRefresh, setProfileRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("ALL");

  // Load real professionals from Supabase
  const loadPros = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, category, location, bio, shop_price, mobile_price, offers_shop, offers_mobile, is_available, is_verified, is_boosted, phone, services, avatar_url, username, country")
      .eq("user_type", "professional");
    if (data) {
      setRealPros(data.filter(p => p.full_name && p.category).map(p => ({
        id: "db-" + p.id,
        name: p.full_name,
        handle: p.username ? "@" + p.username : "@" + p.full_name.replace(/\s+/g, "").toLowerCase(),
        category: p.category || "",
        location: p.location || "",
        country: p.country || "",
        avatar: (p.full_name || "PR").slice(0, 2).toUpperCase(),
        avatarUrl: p.avatar_url || null,
        username: p.username || "",
        rating: 4.8,
        reviews: 0,
        followers: "0",
        shopPrice: p.shop_price || 0,
        mobilePrice: p.mobile_price || 0,
        offersShop: p.offers_shop !== false,
        offersMobile: p.offers_mobile !== false,
        bio: p.bio || "",
        tags: p.services ? p.services.split(",").map(s => s.trim()).filter(Boolean) : [p.category],
        verified: p.is_verified === true,
        boosted: p.is_boosted === true,
        available: p.is_available !== false,
        color: GOLD,
      })));
    }
  };

  // Auth session
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: profile?.full_name || session.user.email.split("@")[0],
          type: profile?.user_type || "client"
        });
      }
      await loadPros();
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") { setUser(null); setActiveTab("home"); }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    setShowAuth(false);
    setActiveTab("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTab("home");
    setViewingPro(null);
  };

  const handleUserUpdate = (fields) => {
    setUser(u => u ? { ...u, ...fields } : u);
    setProfileRefresh(n => n + 1);
  };

  // Country-filtered pros for Explore
  const filteredByCountry = selectedCountry === "ALL"
    ? realPros
    : realPros.filter(p => (p.country || "").toUpperCase() === selectedCountry);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 4, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
        <div style={{ fontSize: 13, color: MUTED }}>Loading...</div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthScreen onAuthenticated={handleAuth} />;
  }

  // Viewing a pro profile
  if (viewingPro) {
    return (
      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <ProProfileScreen
          pro={viewingPro}
          user={user}
          onBack={() => setViewingPro(null)}
          onBook={(pro) => { setViewingPro(null); setBookingPro(pro); }}
        />
        <StylexAssistant user={user} />
        {bookingPro && <BookingModal pro={bookingPro} user={user} onClose={() => setBookingPro(null)} />}
      </div>
    );
  }

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "explore", icon: "🔍", label: "Explore" },
    { id: "scanner", icon: "✨", label: "Scan" },
    { id: "marketplace", icon: "🛍️", label: "Shop" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>

      {/* ── Screens ── */}
      {activeTab === "home" && (
        <HomeScreen
          user={user}
          onProfile={(pro) => setViewingPro(pro)}
          realPros={realPros}
        />
      )}

      {activeTab === "explore" && (
        <div style={{ minHeight: "100vh", background: DARK, paddingBottom: 100 }}>
          {/* Country selector pinned at top */}
          <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${DARK}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🌍</span>
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "9px 12px", color: TEXT, fontSize: 14, outline: "none" }}
              >
                <option value="ALL">🌍 All Countries</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <ExploreScreen
            onProfile={(pro) => setViewingPro(pro)}
            user={user}
            realPros={filteredByCountry}
          />
        </div>
      )}

      {activeTab === "scanner" && (
        <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>✨</div>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginBottom: 8 }}>AI Style Scanner</h2>
            <p style={{ color: MUTED, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>Let our AI analyze your face, hair or nails and recommend the best styles and professionals for you</p>
            <GoldBtn onClick={() => setShowScanner(true)} style={{ padding: "14px 32px", fontSize: 15 }}>Start Scan ✨</GoldBtn>
          </div>
        </div>
      )}

      {activeTab === "marketplace" && (
        <MarketplaceScreen user={user} onLogin={() => setShowAuth(true)} />
      )}

      {activeTab === "profile" && (
        user ? (
          user.type === "professional" ? (
            <ProProfileScreen
              pro={{
                id: "db-" + user.id,
                name: user.name,
                category: "",
                location: "",
                avatar: user.name.slice(0, 2).toUpperCase(),
                avatarUrl: null,
                color: GOLD,
                tags: [],
                bio: "",
                verified: false,
                available: true,
              }}
              user={user}
              onBack={() => {}}
              onBook={() => {}}
            />
          ) : (
            <ProfileScreen
              user={user}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
              refreshKey={profileRefresh}
            />
          )
        ) : (
          <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>👤</div>
              <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Join STYLEX</h2>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: 24 }}>Sign in to access your profile, bookings and more</p>
              <GoldBtn onClick={() => setShowAuth(true)} style={{ padding: "13px 32px" }}>Sign In / Sign Up</GoldBtn>
            </div>
          </div>
        )
      )}

      {/* ── Bottom Navigation (TikTok-style) ── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `${DARK}f5`, backdropFilter: "blur(16px)", borderTop: `1px solid ${BORDER}`, display: "flex", zIndex: 300, padding: "6px 0 8px" }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "scanner") { setShowScanner(true); return; }
              setActiveTab(item.id);
            }}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0" }}
          >
            {item.id === "scanner" ? (
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginTop: -16, boxShadow: `0 4px 16px ${GOLD}55` }}>✨</div>
            ) : (
              <span style={{ fontSize: 22, opacity: activeTab === item.id ? 1 : 0.45 }}>{item.icon}</span>
            )}
            <span style={{ fontSize: 9, color: activeTab === item.id ? GOLD : MUTED, fontWeight: activeTab === item.id ? 700 : 500, letterSpacing: 0.3 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── Floating AI Assistant ── */}
      <StylexAssistant user={user} />

      {/* ── Modals ── */}
      {showScanner && (
        <AIScannerModal
          onClose={() => { setShowScanner(false); setScannerBookPro(null); }}
          realPros={realPros}
          onBookPro={(pro) => { setScannerBookPro(pro); setShowScanner(false); }}
        />
      )}
      {scannerBookPro && (
        <BookingModal pro={scannerBookPro} user={user} onClose={() => setScannerBookPro(null)} />
      )}
      {bookingPro && (
        <BookingModal pro={bookingPro} user={user} onClose={() => setBookingPro(null)} />
      )}
    </div>
  );
}

export default StylexApp;