import { useState, useEffect } from "react";
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
  const COMMISSION_RATE = 0.20; // Your 20% commission
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
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>Choose service type</div>
            <div style={{ display: "flex", gap: 10 }}>
              {pro.offersShop && (
                <button onClick={() => setServiceType("shop")} style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", background: serviceType === "shop" ? GOLD : DARK3, color: serviceType === "shop" ? "#000" : TEXT, border: `1px solid ${serviceType === "shop" ? GOLD : BORDER}`, fontWeight: 600, fontSize: 13 }}>
                  🏪 Shop Visit<br/><span style={{ fontSize: 11, fontWeight: 400 }}>₦{pro.shopPrice.toLocaleString()}</span>
                </button>
              )}
              {pro.offersMobile && (
                <button onClick={() => setServiceType("mobile")} style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", background: serviceType === "mobile" ? GOLD : DARK3, color: serviceType === "mobile" ? "#000" : TEXT, border: `1px solid ${serviceType === "mobile" ? GOLD : BORDER}`, fontWeight: 600, fontSize: 13 }}>
                  🚗 Mobile<br/><span style={{ fontSize: 11, fontWeight: 400 }}>₦{pro.mobilePrice.toLocaleString()}</span>
                </button>
              )}
            </div>
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
                  {item.pro.verified && <span style={{ fontSize: 12, color: GOLD }}>✓</span>}
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
function ExploreScreen({ onProfile, user }) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [bookModal, setBookModal] = useState(null);

  const filtered = professionals.filter(p => {
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
        {["All", ...new Set(professionals.map(p => p.category))].map(cat => (
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
                    {pro.verified && <span style={{ color: GOLD, fontSize: 13 }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{pro.handle}</div>
                  <Badge text={pro.category} color={pro.color} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>{pro.price}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>per session</div>
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

// ─── AI SCANNER ───
function AIScannerModal({ onClose }) {
  const [step, setStep] = useState("choose");
  const [scanType, setScanType] = useState(null);

  const scanTypes = [
    { id: "face", icon: "😊", label: "Face Shape", desc: "Find makeup & skincare styles" },
    { id: "hair", icon: "💇", label: "Hair Type", desc: "Discover perfect hairstyles" },
    { id: "nails", icon: "💅", label: "Nail Shape", desc: "Get nail art recommendations" },
    { id: "skin", icon: "✨", label: "Skin Tone", desc: "Find your perfect look" },
  ];

  const results = {
    face: { type: "Oval Face Shape", desc: "Most versatile shape! Almost any hairstyle suits you.", styles: ["Beach Waves", "Bob Cut", "Pixie Cut", "Long Layers"] },
    hair: { type: "Type 4C Natural Hair", desc: "Tightly coiled hair that thrives with moisture.", styles: ["Box Braids", "Loc Extensions", "TWA", "Bantu Knots"] },
    nails: { type: "Short Oval Nails", desc: "Perfect for gel extensions and minimalist nail art.", styles: ["French Tips", "Ombre Gel", "Chrome Finish", "3D Florals"] },
    skin: { type: "Deep Brown Skin Tone", desc: "Gold, bronze and deep berry shades complement you best.", styles: ["Bronze Glam", "Nude Glam", "Bold Lip", "Dewy Skin"] },
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>AI Style Scanner ✨</h3>
          <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Get personalized style recommendations</p>
        </div>
        <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      {step === "choose" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {scanTypes.map(s => (
            <button key={s.id} onClick={() => { setScanType(s.id); setStep("results"); }} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 14px", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: TEXT, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.desc}</div>
            </button>
          ))}
        </div>
      )}

      {step === "results" && scanType && (
        <div>
          <div style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{scanTypes.find(s => s.id === scanType)?.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: GOLD, marginBottom: 6 }}>{results[scanType].type}</div>
            <div style={{ fontSize: 13, color: `${TEXT}99`, lineHeight: 1.6 }}>{results[scanType].desc}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>RECOMMENDED STYLES</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {results[scanType].styles.map(style => (
                <span key={style} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 20, padding: "6px 14px", fontSize: 12, color: GOLD, fontWeight: 600 }}>{style}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={() => setStep("choose")} outline style={{ flex: 1 }}>Scan Again</GoldBtn>
            <GoldBtn onClick={onClose} style={{ flex: 1 }}>Done ✨</GoldBtn>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── PROFILE SCREEN ───
function ProfileScreen({ user, onAuth, onLogout }) {
  const [showScanner, setShowScanner] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  if (!user) return <AuthScreen onAuthenticated={onAuth} />;

  const isPro = user.type === "professional";

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'Helvetica Neue', Arial, sans-serif", paddingBottom: 100 }}>
      <div style={{ background: isPro ? `linear-gradient(135deg, ${GOLD}22, ${DARK3})` : `linear-gradient(135deg, #1a1a2e, ${DARK3})`, borderBottom: `1px solid ${BORDER}`, padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
          <Avatar initials={user.name.slice(0, 2).toUpperCase()} size={72} color={GOLD} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: TEXT, marginBottom: 2 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{user.email}</div>
            <span style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 6, padding: "3px 10px", fontSize: 10, color: GOLD, fontWeight: 700 }}>
              {isPro ? "✂️ PROFESSIONAL" : "👤 CLIENT"}
            </span>
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
          <div style={{ display: "flex", gap: 10 }}>
            <GoldBtn onClick={() => setShowUpload(true)} style={{ flex: 1, padding: "10px 0", fontSize: 12 }}>📹 Upload Content</GoldBtn>
            <GoldBtn outline style={{ flex: 1, padding: "10px 0", fontSize: 12 }}>✏️ Edit Services</GoldBtn>
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

      <div style={{ padding: "16px 20px" }}>
        {[
          { icon: "📅", label: "My Bookings", sub: "View & manage appointments" },
          { icon: "❤️", label: isPro ? "My Services" : "Saved Professionals", sub: isPro ? "Manage your service offerings" : "Your beauty favorites" },
          { icon: "💬", label: "Messages", sub: "Chat with " + (isPro ? "clients" : "professionals") },
          { icon: "💳", label: "Payment Methods", sub: isPro ? "Bank accounts & payouts" : "Cards & wallet" },
          { icon: "🔔", label: "Notifications", sub: "Booking reminders & offers" },
          { icon: "🔒", label: "Security", sub: "Password & 2FA" },
          { icon: "🚪", label: "Sign Out", sub: "Log out of STYLEX", danger: true },
        ].map((item, i) => (
          <div key={i} onClick={async () => { if (item.label === "Sign Out") { await supabase.auth.signOut(); onLogout(); } }} style={{ background: CARD, borderRadius: 14, padding: "16px 18px", marginBottom: 10, border: `1px solid ${item.danger ? "#ff444433" : BORDER}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: item.danger ? "#ff6666" : TEXT }}>{item.label}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{item.sub}</div>
            </div>
            <span style={{ color: MUTED, fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>

      {showScanner && <AIScannerModal onClose={() => setShowScanner(false)} />}
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
              {pro.verified && <span style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: GOLD, fontWeight: 700 }}>✓ VERIFIED</span>}
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

// ─── MAIN APP ───
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
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
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
export default function StylexApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [viewingPro, setViewingPro] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div style={{ maxWidth: 480, margin: "0 auto", background: DARK, minHeight:"100vh", position: "relative", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {activeTab === "home" && <HomeScreen user={user} onProfile={pro => setViewingPro(pro)} />}
      {activeTab === "explore" && <ExploreScreen user={user} onProfile={pro => setViewingPro(pro)} />}
      {activeTab === "bookings" && <BookingsScreen user={user} onLogin={() => setActiveTab("profile")} />}
      {activeTab === "profile" && <ProfileScreen user={user} onAuth={handleAuth} onLogout={handleLogout} />}
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
    </div>
  );
}