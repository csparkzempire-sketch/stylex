import { useState } from "react";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8D08A";
const DARK = "#0A0A0B";
const DARK2 = "#111114";
const DARK3 = "#1A1A1F";
const CARD = "#16161C";
const BORDER = "#2A2A35";
const TEXT = "#F0EDE8";
const MUTED = "#888898";
const GREEN = "#4CAF50";
const RED = "#FF5555";

function InputField({ label, type = "text", value, onChange, placeholder, error, icon }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={{ marginBottom: 4 }}>
      {label && <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
        <input
          type={type === "password" ? (showPass ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%", background: DARK3,
            border: `1.5px solid ${error ? RED : BORDER}`,
            borderRadius: 12, padding: `12px ${type === "password" ? "44px" : "14px"} 12px ${icon ? "42px" : "14px"}`,
            color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s"
          }}
        />
        {type === "password" && (
          <button onClick={() => setShowPass(s => !s)} style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED
          }}>{showPass ? "🙈" : "👁️"}</button>
        )}
      </div>
      {error && <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>⚠️ {error}</div>}
    </div>
  );
}

function GoldBtn({ children, onClick, style = {}, outline = false, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? DARK3 : outline ? "transparent" : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
      color: disabled ? MUTED : outline ? GOLD : "#0A0A0B",
      border: outline ? `1.5px solid ${GOLD}` : disabled ? `1px solid ${BORDER}` : "none",
      borderRadius: 12, padding: "13px 22px", fontWeight: 700,
      fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: 0.5, transition: "all 0.2s",
      width: "100%", ...style
    }}>{children}</button>
  );
}

// ─── FAKE USER DATABASE ───
const USERS_DB = [
  { email: "client@stylex.ng", password: "Client@123", name: "Test Client", type: "client" },
  { email: "pro@stylex.ng", password: "Pro@123", name: "Test Professional", type: "professional" },
];

// ─── SIGN IN SCREEN ───
function SignInScreen({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSignIn = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setGeneralError("");

    // Simulate API call delay
    setTimeout(() => {
      const user = USERS_DB.find(u => u.email === email && u.password === password);
      if (user) {
        onSuccess(user);
      } else {
        // Check if email exists but password is wrong
        const emailExists = USERS_DB.find(u => u.email === email);
        if (emailExists) {
          setErrors({ password: "Incorrect password. Please try again." });
        } else {
          setGeneralError("No account found with this email. Please sign up.");
        }
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, margin: "0 0 6px" }}>Welcome Back 👋</h2>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Sign in to continue to STYLEX</p>
      </div>

      {generalError && (
        <div style={{
          background: `${RED}15`, border: `1px solid ${RED}44`,
          borderRadius: 10, padding: "12px 14px", fontSize: 13, color: RED,
          display: "flex", gap: 8, alignItems: "center"
        }}>
          <span>⚠️</span> {generalError}
        </div>
      )}

      <InputField
        label="EMAIL ADDRESS"
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); setGeneralError(""); }}
        placeholder="Enter your email"
        error={errors.email}
        icon="📧"
      />

      <InputField
        label="PASSWORD"
        type="password"
        value={password}
        onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); setGeneralError(""); }}
        placeholder="Enter your password"
        error={errors.password}
      />

      <div style={{ textAlign: "right", marginTop: -8 }}>
        <span style={{ fontSize: 12, color: GOLD, cursor: "pointer", fontWeight: 600 }}>Forgot Password?</span>
      </div>

      <GoldBtn onClick={handleSignIn} disabled={loading}>
        {loading ? "Signing in..." : "Sign In →"}
      </GoldBtn>

      <div style={{ textAlign: "center", fontSize: 12, color: MUTED }}>
        Don't have an account?{" "}
        <span onClick={onSwitch} style={{ color: GOLD, fontWeight: 700, cursor: "pointer" }}>
          Create Account
        </span>
      </div>

      {/* Demo credentials hint */}
      <div style={{
        background: `${GOLD}08`, border: `1px solid ${GOLD}22`,
        borderRadius: 10, padding: "10px 14px", fontSize: 11, color: MUTED
      }}>
        <div style={{ fontWeight: 700, color: GOLD, marginBottom: 4 }}>Demo Credentials:</div>
        <div>Client: client@stylex.ng / Client@123</div>
        <div>Pro: pro@stylex.ng / Pro@123</div>
      </div>
    </div>
  );
}

// ─── SIGN UP SCREEN ───
function SignUpScreen({ onSwitch, onSuccess }) {
  const [step, setStep] = useState(1); // 1=account type, 2=personal info, 3=security, 4=verify
  const [userType, setUserType] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "", category: "", location: "", agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    else if (USERS_DB.find(u => u.email === form.email)) e.email = "This email is already registered";
    if (!form.phone) e.phone = "Phone number is required";
    else if (form.phone.length < 11) e.phone = "Enter a valid Nigerian phone number";
    return e;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Must contain at least one uppercase letter";
    else if (!/[0-9]/.test(form.password)) e.password = "Must contain at least one number";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms";
    return e;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!userType) { setErrors({ userType: "Please select an account type" }); return; }
      setStep(2);
    } else if (step === 2) {
      const e = validateStep2();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
      setStep(3);
    } else if (step === 3) {
      const e = validateStep3();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 1500);
    }
  };

  const categories = ["Hairstylist", "Makeup Artist", "Barber", "Nail Tech", "Lash Tech", "Tattoo Artist", "Skincare", "Pedicure"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Step {Math.min(step, 3)} of 3</span>
          <span style={{ fontSize: 11, color: GOLD }}>{["", "Account Type", "Personal Info", "Security"][Math.min(step, 3)]}</span>
        </div>
        <div style={{ height: 4, background: DARK3, borderRadius: 2 }}>
          <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, width: `${(Math.min(step, 3) / 3) * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* STEP 1: Account Type */}
      {step === 1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 22, margin: "0 0 6px" }}>Join STYLEX ✨</h2>
            <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Who are you joining as?</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {[
              { id: "client", icon: "👤", title: "I'm a Client", desc: "I want to discover and book beauty professionals", features: ["Browse professionals", "Book appointments", "AI style scanner", "Pay securely online"] },
              { id: "professional", icon: "✂️", title: "I'm a Professional", desc: "I offer beauty services and want to grow my clientele", features: ["Create a profile", "Upload portfolio videos", "Manage bookings", "Receive payments"] },
            ].map(type => (
              <button key={type.id} onClick={() => { setUserType(type.id); setErrors({}); }} style={{
                background: userType === type.id ? `${GOLD}15` : DARK3,
                border: `2px solid ${userType === type.id ? GOLD : BORDER}`,
                borderRadius: 16, padding: "18px", cursor: "pointer",
                textAlign: "left", transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{type.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>{type.title}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{type.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${userType === type.id ? GOLD : BORDER}`, background: userType === type.id ? GOLD : "none", flexShrink: 0 }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {type.features.map(f => (
                    <span key={f} style={{ fontSize: 10, color: userType === type.id ? GOLD : MUTED, background: userType === type.id ? `${GOLD}15` : `${MUTED}11`, border: `1px solid ${userType === type.id ? GOLD : BORDER}33`, borderRadius: 20, padding: "3px 10px" }}>✓ {f}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          {errors.userType && <div style={{ fontSize: 12, color: RED, textAlign: "center" }}>⚠️ {errors.userType}</div>}
        </div>
      )}

      {/* STEP 2: Personal Info */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: "0 0 4px" }}>Personal Information</h2>
            <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Tell us about yourself</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="FIRST NAME" value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="First name" error={errors.firstName} />
            <InputField label="LAST NAME" value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Last name" error={errors.lastName} />
          </div>

          <div style={{ marginTop: 12 }}>
            <InputField label="EMAIL ADDRESS" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" error={errors.email} icon="📧" />
          </div>

          <div style={{ marginTop: 12 }}>
            <InputField label="PHONE NUMBER" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="08012345678" error={errors.phone} icon="📱" />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>LOCATION (CITY)</label>
            <select value={form.location} onChange={e => update("location", e.target.value)} style={{ width: "100%", background: DARK3, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", color: form.location ? TEXT : MUTED, fontSize: 14, outline: "none" }}>
              <option value="">Select your city</option>
              {["Lagos", "Abuja", "Port Harcourt", "Enugu", "Kano", "Ibadan", "Benin City", "Kaduna"].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {userType === "professional" && (
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>YOUR SPECIALTY</label>
              <select value={form.category} onChange={e => update("category", e.target.value)} style={{ width: "100%", background: DARK3, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", color: form.category ? TEXT : MUTED, fontSize: 14, outline: "none" }}>
                <option value="">Select your specialty</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Security */}
      {step === 3 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: "0 0 4px" }}>Secure Your Account 🔐</h2>
            <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Create a strong password</p>
          </div>

          <InputField label="CREATE PASSWORD" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min. 8 chars, 1 uppercase, 1 number" error={errors.password} />

          {/* Password strength */}
          {form.password.length > 0 && (
            <div style={{ marginTop: 8, marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[
                  form.password.length >= 8,
                  /[A-Z]/.test(form.password),
                  /[0-9]/.test(form.password),
                  /[^A-Za-z0-9]/.test(form.password),
                ].map((met, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: met ? GREEN : DARK3, transition: "background 0.2s" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>
                {[form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length < 2 ? "Weak" :
                  [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length < 4 ? "Medium" : "Strong ✓"} password
              </div>
            </div>
          )}

          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <InputField label="CONFIRM PASSWORD" type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} placeholder="Re-enter your password" error={errors.confirmPassword} />
          </div>

          {/* Terms */}
          <button onClick={() => update("agreeTerms", !form.agreeTerms)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "flex-start", gap: 10, padding: 0, textAlign: "left"
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: form.agreeTerms ? GOLD : "none",
              border: `2px solid ${form.agreeTerms ? GOLD : BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: "#0A0A0B"
            }}>{form.agreeTerms ? "✓" : ""}</div>
            <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
              I agree to STYLEX's{" "}
              <span style={{ color: GOLD }}>Terms of Service</span>{" "}and{" "}
              <span style={{ color: GOLD }}>Privacy Policy</span>
            </span>
          </button>
          {errors.agreeTerms && <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>⚠️ {errors.agreeTerms}</div>}
        </div>
      )}

      {/* STEP 4: Success */}
      {step === 4 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: GOLD, fontWeight: 800, fontSize: 22, margin: "0 0 10px" }}>Account Created!</h2>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
            Welcome to STYLEX, <strong style={{ color: TEXT }}>{form.firstName}</strong>!<br />
            A verification link has been sent to<br />
            <strong style={{ color: GOLD }}>{form.email}</strong>
          </p>
          <div style={{ background: DARK3, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>ACCOUNT TYPE</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{userType === "professional" ? "✂️ Beauty Professional" : "👤 Client"}</div>
          </div>
          <button onClick={() => onSuccess({ email: form.email, name: form.firstName, type: userType })} style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: "#0A0A0B", border: "none", borderRadius: 12,
            padding: "14px", fontWeight: 800, fontSize: 14,
            cursor: "pointer", width: "100%"
          }}>Go to My Account →</button>
        </div>
      )}

      {/* Navigation buttons */}
      {step < 4 && (
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, background: "none", border: `1.5px solid ${BORDER}`,
              borderRadius: 12, padding: "13px", color: MUTED,
              fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>← Back</button>
          )}
          <GoldBtn onClick={handleNext} disabled={loading} style={{ flex: 2 }}>
            {loading ? "Creating account..." : step === 3 ? "Create Account 🚀" : "Continue →"}
          </GoldBtn>
        </div>
      )}

      {step === 1 && (
        <div style={{ textAlign: "center", fontSize: 12, color: MUTED }}>
          Already have an account?{" "}
          <span onClick={onSwitch} style={{ color: GOLD, fontWeight: 700, cursor: "pointer" }}>Sign In</span>
        </div>
      )}
    </div>
  );
}

// ─── MAIN AUTH WRAPPER ───
export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSuccess = (user) => {
    setLoggedInUser(user);
    if (onAuthenticated) onAuthenticated(user);
  };

  if (loggedInUser) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
        <div style={{ background: CARD, borderRadius: 24, padding: 32, maxWidth: 400, width: "100%", border: `1px solid ${BORDER}`, textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>👋</div>
          <h2 style={{ color: GOLD, fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Welcome, {loggedInUser.name}!</h2>
          <div style={{ background: DARK3, borderRadius: 12, padding: 14, marginBottom: 20, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Signed in as</div>
            <div style={{ fontSize: 14, color: TEXT, fontWeight: 600 }}>{loggedInUser.email}</div>
            <div style={{ fontSize: 12, color: GOLD, marginTop: 4 }}>{loggedInUser.type === "professional" ? "✂️ Professional" : "👤 Client"}</div>
          </div>
          <button onClick={() => setLoggedInUser(null)} style={{
            background: "none", border: `1px solid ${BORDER}`, borderRadius: 10,
            color: MUTED, padding: "10px 20px", cursor: "pointer", fontSize: 13
          }}>Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{
        background: CARD, borderRadius: 24, padding: "32px 28px",
        width: "100%", maxWidth: 420, border: `1px solid ${BORDER}`,
        boxShadow: `0 0 80px ${GOLD}08`
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 4, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: 3 }}>BEAUTY MARKETPLACE</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, margin: "10px auto 0" }} />
        </div>

        {mode === "signin"
          ? <SignInScreen onSwitch={() => setMode("signup")} onSuccess={handleSuccess} />
          : <SignUpScreen onSwitch={() => setMode("signin")} onSuccess={handleSuccess} />
        }
      </div>
    </div>
  );
}