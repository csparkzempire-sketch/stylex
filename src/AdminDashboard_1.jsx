import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://utvrujgqzheifblizarw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc"
);

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
const BLUE = "#5B9BD5";

function StatusBadge({ status }) {
  const colors = {
    verified: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    pending: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
    suspended: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    banned: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    active: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    inactive: { bg: `${MUTED}22`, color: MUTED, border: `${MUTED}44` },
    completed: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    confirmed: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    upcoming: { bg: `${BLUE}22`, color: BLUE, border: `${BLUE}44` },
    cancelled: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    new: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
    client: { bg: `${BLUE}22`, color: BLUE, border: `${BLUE}44` },
    professional: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
    public: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    private: { bg: `${MUTED}22`, color: MUTED, border: `${MUTED}44` },
  };
  const s = colors[status] || colors.pending;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{status}</span>
  );
}

function Btn({ children, onClick, color = GOLD, outline = false, danger = false, disabled = false, small = false }) {
  const bg = danger ? `${RED}22` : outline ? "transparent" : `linear-gradient(135deg, ${color}, ${color}cc)`;
  const borderC = danger ? `${RED}55` : outline ? `${color}55` : "none";
  const textC = danger ? RED : outline ? color : color === GOLD ? "#0A0A0B" : "#fff";
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? DARK3 : bg, border: `1px solid ${disabled ? BORDER : borderC}`, borderRadius: small ? 7 : 10, color: disabled ? MUTED : textC, padding: small ? "5px 12px" : "9px 18px", fontSize: small ? 11 : 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>{children}</button>
  );
}

// ─── LOGIN (real Supabase Auth) ───
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleLogin = async () => {
    setError("");
    setChecking(true);

    // 1. Real sign-in — Supabase verifies the password server-side
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInErr) {
      setChecking(false);
      setError("Invalid credentials. Access denied.");
      return;
    }

    // 2. Confirm this user is actually an admin
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profErr || !profile || !profile.is_admin) {
      await supabase.auth.signOut();   // not an admin — kick them straight back out
      setChecking(false);
      setError("This account does not have admin access.");
      return;
    }

    // 3. Verified admin — let them in
    setChecking(false);
    onLogin();
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{ background: CARD, borderRadius: 24, padding: "40px 36px", width: "100%", maxWidth: 420, border: `1px solid ${BORDER}`, boxShadow: `0 0 80px ${GOLD}10` }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 4, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
          <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginTop: 4 }}>ADMIN CONTROL PANEL</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, margin: "12px auto 0" }} />
        </div>
        <div style={{ background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>🔐</span>
          <span style={{ fontSize: 12, color: `${GOLD}cc` }}>Restricted access. Founder & Admin only.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>ADMIN EMAIL</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="admin@stylex.app" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Enter admin password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 44px 12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED }}>{showPass ? "🙈" : "👁️"}</button>
          </div>
          {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: RED }}>⚠️ {error}</div>}
          <button onClick={handleLogin} disabled={checking} style={{ background: checking ? DARK3 : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: checking ? MUTED : "#0A0A0B", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 14, cursor: checking ? "not-allowed" : "pointer", marginTop: 6 }}>{checking ? "Verifying..." : "Access Admin Panel →"}</button>
        </div>
      </div>
    </div>
  );
}


// ─── ANALYTICS PANEL ───
function AnalyticsPanel({ bookings, users, posts, products, stats }) {
  const [period, setPeriod] = useState("monthly");

  // ── helpers ──
  const monthName = (d) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date(d).getMonth()];
  const weekLabel = (d) => { const day = new Date(d); const week = Math.ceil(day.getDate() / 7); return `W${week} ${monthName(d)}`; };
  const now = new Date();

  // Build revenue data grouped by period
  const buildRevenueData = () => {
    if (period === "weekly") {
      // Last 8 weeks
      const weeks = [];
      for (let i = 7; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - i * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        const label = `W${8 - i}`;
        const rev = bookings.filter(b => { const d = new Date(b.created_at); return d >= start && d < end; }).reduce((s, b) => s + (b.price || 0), 0);
        const newUsers = users.filter(u => { const d = new Date(u.created_at); return d >= start && d < end; }).length;
        const newPosts = posts.filter(p => { const d = new Date(p.created_at); return d >= start && d < end; }).length;
        weeks.push({ label, revenue: rev, commission: Math.round(rev * 0.20), users: newUsers, posts: newPosts });
      }
      return weeks;
    }
    if (period === "monthly") {
      // Last 12 months
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " " + String(d.getFullYear()).slice(2);
        const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const rev = bookings.filter(b => { const bd = new Date(b.created_at); return bd >= d && bd < next; }).reduce((s, b) => s + (b.price || 0), 0);
        const newUsers = users.filter(u => { const ud = new Date(u.created_at); return ud >= d && ud < next; }).length;
        const newPosts = posts.filter(p => { const pd = new Date(p.created_at); return pd >= d && pd < next; }).length;
        months.push({ label, revenue: rev, commission: Math.round(rev * 0.20), users: newUsers, posts: newPosts });
      }
      return months;
    }
    // Annual — last 3 years
    const years = [];
    for (let i = 2; i >= 0; i--) {
      const yr = now.getFullYear() - i;
      const rev = bookings.filter(b => new Date(b.created_at).getFullYear() === yr).reduce((s, b) => s + (b.price || 0), 0);
      const newUsers = users.filter(u => new Date(u.created_at).getFullYear() === yr).length;
      const newPosts = posts.filter(p => new Date(p.created_at).getFullYear() === yr).length;
      years.push({ label: String(yr), revenue: rev, commission: Math.round(rev * 0.20), users: newUsers, posts: newPosts });
    }
    return years;
  };

  const data = buildRevenueData();
  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const totalComm = data.reduce((s, d) => s + d.commission, 0);
  const prevHalf = data.slice(0, Math.floor(data.length / 2)).reduce((s, d) => s + d.revenue, 0);
  const currHalf = data.slice(Math.floor(data.length / 2)).reduce((s, d) => s + d.revenue, 0);
  const trend = prevHalf === 0 ? null : ((currHalf - prevHalf) / prevHalf * 100).toFixed(1);
  const trendUp = trend === null ? null : parseFloat(trend) >= 0;

  const tooltipStyle = { background: "#16161C", border: "1px solid #2A2A35", borderRadius: 10, fontSize: 12, color: "#F0EDE8" };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={tooltipStyle}>
        <div style={{ padding: "8px 14px", borderBottom: "1px solid #2A2A35", fontWeight: 700, color: "#C9A84C" }}>{label}</div>
        <div style={{ padding: "8px 14px" }}>
          {payload.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
              <span style={{ color: "#888898" }}>{p.name}:</span>
              <span style={{ color: "#F0EDE8", fontWeight: 700 }}>{p.name.includes("Revenue") || p.name.includes("Commission") ? "₦" + p.value.toLocaleString() : p.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Period selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#888898", fontWeight: 600 }}>View by:</span>
        {["weekly", "monthly", "annual"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ background: period === p ? `linear-gradient(135deg, #C9A84C, #E8D08A)` : "#1A1A1F", border: `1px solid ${period === p ? "#C9A84C" : "#2A2A35"}`, borderRadius: 8, color: period === p ? "#0A0A0B" : "#888898", padding: "7px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{p}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 26 }}>
        {[
          { label: `${period.charAt(0).toUpperCase() + period.slice(1)} Revenue`, value: `₦${totalRev.toLocaleString()}`, icon: "💰", color: "#C9A84C" },
          { label: "Platform Earnings", value: `₦${totalComm.toLocaleString()}`, icon: "📈", color: "#4CAF50" },
          { label: "Trend", value: trend === null ? "No data" : `${trendUp ? "▲" : "▼"} ${Math.abs(trend)}%`, icon: trendUp ? "🟢" : "🔴", color: trendUp ? "#4CAF50" : "#FF5555" },
          { label: "Total Users", value: stats.users, icon: "👥", color: "#5B9BD5" },
          { label: "Total Posts", value: stats.posts, icon: "🎬", color: "#C9A84C" },
          { label: "Products", value: stats.products, icon: "🛍️", color: "#B56C8A" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#16161C", borderRadius: 14, padding: 18, border: `1px solid #2A2A35`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}44)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, color: "#888898", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Area Chart */}
      <div style={{ background: "#16161C", borderRadius: 16, border: "1px solid #2A2A35", padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ color: "#F0EDE8", fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>📈 Revenue Over Time</h3>
            <div style={{ fontSize: 12, color: "#888898" }}>Total booking revenue vs platform earnings (20%)</div>
          </div>
          {trend !== null && (
            <div style={{ background: trendUp ? "#4CAF5022" : "#FF555522", border: `1px solid ${trendUp ? "#4CAF5044" : "#FF555544"}`, borderRadius: 10, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: trendUp ? "#4CAF50" : "#FF5555" }}>
              {trendUp ? "▲" : "▼"} {Math.abs(trend)}% vs previous period
            </div>
          )}
        </div>
        {totalRev === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888898" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
            <div>No revenue data yet — bookings will populate this chart automatically</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3522" />
              <XAxis dataKey="label" tick={{ fill: "#888898", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888898", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888898", paddingTop: 16 }} />
              <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#C9A84C" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: "#C9A84C", r: 3 }} />
              <Area type="monotone" dataKey="commission" name="Platform Earnings" stroke="#4CAF50" strokeWidth={2} fill="url(#commGrad)" dot={{ fill: "#4CAF50", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* User Growth Bar Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        <div style={{ background: "#16161C", borderRadius: 16, border: "1px solid #2A2A35", padding: 24 }}>
          <h3 style={{ color: "#F0EDE8", fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>👥 User Growth</h3>
          <div style={{ fontSize: 12, color: "#888898", marginBottom: 20 }}>New signups per {period === "annual" ? "year" : period === "monthly" ? "month" : "week"}</div>
          {data.every(d => d.users === 0) ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#888898", fontSize: 13 }}>No signup data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3522" />
                <XAxis dataKey="label" tick={{ fill: "#888898", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888898", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="users" name="New Users" fill="#5B9BD5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: "#16161C", borderRadius: 16, border: "1px solid #2A2A35", padding: 24 }}>
          <h3 style={{ color: "#F0EDE8", fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>🎬 Post Activity</h3>
          <div style={{ fontSize: 12, color: "#888898", marginBottom: 20 }}>New posts per {period === "annual" ? "year" : period === "monthly" ? "month" : "week"}</div>
          {data.every(d => d.posts === 0) ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#888898", fontSize: 13 }}>No post data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3522" />
                <XAxis dataKey="label" tick={{ fill: "#888898", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888898", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="posts" name="New Posts" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue breakdown line chart */}
      <div style={{ background: "#16161C", borderRadius: 16, border: "1px solid #2A2A35", padding: 24 }}>
        <h3 style={{ color: "#F0EDE8", fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>💹 Revenue vs Earnings Breakdown</h3>
        <div style={{ fontSize: 12, color: "#888898", marginBottom: 20 }}>Side-by-side comparison of gross revenue and your net platform earnings</div>
        {totalRev === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888898" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💹</div>
            <div>Revenue data will appear here once bookings are made</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3522" />
              <XAxis dataKey="label" tick={{ fill: "#888898", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888898", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888898", paddingTop: 16 }} />
              <Line type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: "#C9A84C", r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="commission" name="Platform Earnings" stroke="#4CAF50" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#4CAF50", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ───
function SettingsPanel({ stats, follows, comments, showNotif }) {
  const [settings, setSettings] = useState({});
  const [editing, setEditing] = useState({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const SETTING_DEFS = [
    { key: "platform_name", label: "Platform Name", desc: "App display name shown to all users", icon: "✨", type: "text" },
    { key: "app_url", label: "Live App URL", desc: "Your public production URL", icon: "🌐", type: "text" },
    { key: "admin_email", label: "Admin Email", desc: "Email used to log into this panel", icon: "📧", type: "email" },
    { key: "admin_password", label: "Admin Password", desc: "Password used to log into this panel", icon: "🔑", type: "password" },
    { key: "booking_commission", label: "Booking Commission (%)", desc: "Platform fee charged on every booking", icon: "📅", type: "number", suffix: "%" },
    { key: "product_commission", label: "Product Commission (%)", desc: "Platform fee on every marketplace sale", icon: "🛍️", type: "number", suffix: "%" },
    { key: "verification_monthly", label: "Verification Price (Monthly)", desc: "Cost for pros to get verified badge per month", icon: "✅", type: "number", prefix: "₦" },
    { key: "verification_annually", label: "Verification Price (Annual)", desc: "Cost for pros to get verified badge per year", icon: "✅", type: "number", prefix: "₦" },
    { key: "boost_monthly", label: "Boost Price (Monthly)", desc: "Cost for pros to boost their profile per month", icon: "🚀", type: "number", prefix: "₦" },
    { key: "boost_annually", label: "Boost Price (Annual)", desc: "Cost for pros to boost their profile per year", icon: "🚀", type: "number", prefix: "₦" },
    { key: "supported_countries", label: "Countries Supported", desc: "Number of countries in the global marketplace", icon: "🌍", type: "number" },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoadingSettings(true);
    const { data } = await supabase.from("platform_settings").select("*");
    if (data) {
      const map = {};
      data.forEach(row => { map[row.key] = row.value; });
      setSettings(map);
      // init editing values
      const editMap = {};
      data.forEach(row => { editMap[row.key] = row.value; });
      setEditing(editMap);
    }
    setLoadingSettings(false);
  };

  const saveSetting = async (key) => {
    const newVal = editing[key];
    if (newVal === settings[key]) return; // nothing changed
    setSavingKey(key);
    const { error } = await supabase.from("platform_settings")
      .upsert({ key, value: newVal, updated_at: new Date().toISOString() });
    setSavingKey(null);
    if (error) { showNotif("Failed to save: " + error.message, "error"); return; }
    setSettings(s => ({ ...s, [key]: newVal }));
    showNotif(`${SETTING_DEFS.find(d => d.key === key)?.label} updated ✅`);
  };

  const inputStyle = {
    flex: 1,
    background: DARK3,
    border: `1px solid ${BORDER}`,
    borderRadius: 9,
    padding: "9px 12px",
    color: TEXT,
    fontSize: 13,
    outline: "none",
    minWidth: 0,
  };

  if (loadingSettings) return <div style={{ textAlign: "center", padding: 60, color: MUTED }}>Loading settings...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 22, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <span style={{ fontSize: 13, color: `${GOLD}cc`, lineHeight: 1.5 }}>Changes save instantly to the database and take effect across the live app. Edit a field and click <strong>Save</strong> to apply.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {SETTING_DEFS.map(def => (
          <div key={def.key} style={{ background: CARD, borderRadius: 14, padding: "18px 20px", border: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16 }}>{def.icon}</span>
                  <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{def.label}</div>
                </div>
                <div style={{ fontSize: 12, color: MUTED, paddingLeft: 24 }}>{def.desc}</div>
                {settings[def.key] !== editing[def.key] && (
                  <div style={{ fontSize: 11, color: GOLD, marginTop: 4, paddingLeft: 24 }}>
                    Current: <span style={{ fontFamily: def.type === "password" ? "monospace" : "inherit" }}>
                      {def.type === "password" ? "••••••••" : (def.prefix || "") + settings[def.key] + (def.suffix || "")}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 260 }}>
                {def.prefix && <span style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>{def.prefix}</span>}
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type={def.type === "password" ? (showPass ? "text" : "password") : def.type}
                    value={editing[def.key] || ""}
                    onChange={e => setEditing(ed => ({ ...ed, [def.key]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && saveSetting(def.key)}
                    style={{ ...inputStyle, paddingRight: def.type === "password" ? 38 : 12 }}
                  />
                  {def.type === "password" && (
                    <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 14 }}>{showPass ? "🙈" : "👁️"}</button>
                  )}
                </div>
                {def.suffix && <span style={{ color: MUTED, fontSize: 13 }}>{def.suffix}</span>}
                <button
                  onClick={() => saveSetting(def.key)}
                  disabled={savingKey === def.key || editing[def.key] === settings[def.key]}
                  style={{
                    background: editing[def.key] !== settings[def.key] ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : DARK3,
                    border: "none",
                    borderRadius: 9,
                    color: editing[def.key] !== settings[def.key] ? "#0A0A0B" : MUTED,
                    padding: "9px 18px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: editing[def.key] !== settings[def.key] ? "pointer" : "not-allowed",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {savingKey === def.key ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read-only info */}
      <div style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: MUTED, letterSpacing: 1, marginBottom: 12 }}>READ-ONLY INFO</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Database (Supabase)", value: "utvrujgqzheifblizarw", mono: true },
            { label: "App Version", value: "1.0.0" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: MUTED }}>{s.label}</span>
              <span style={{ fontSize: 13, color: TEXT, fontWeight: 600, fontFamily: s.mono ? "monospace" : "inherit" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live platform summary */}
      <div style={{ background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: GOLD, marginBottom: 14 }}>📊 Live Platform Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Total Users", value: stats.users },
            { label: "Professionals", value: stats.professionals },
            { label: "Total Posts", value: stats.posts },
            { label: "Total Bookings", value: stats.bookings },
            { label: "Products Listed", value: stats.products },
            { label: "Collab Requests", value: stats.collabs },
            { label: "Total Follows", value: follows.length },
            { label: "Total Comments", value: comments.length },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: DARK3, borderRadius: 9 }}>
              <span style={{ fontSize: 12, color: MUTED }}>{s.label}</span>
              <span style={{ fontSize: 12, color: TEXT, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ───
function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data
  const [stats, setStats] = useState({ users: 0, professionals: 0, clients: 0, bookings: 0, revenue: 0, posts: 0, products: 0, collabs: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [comments, setComments] = useState([]);
  const [follows, setFollows] = useState([]);

  // Filters
  const [userFilter, setUserFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [postFilter, setPostFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");

  useEffect(() => { fetchAll(); }, []);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [
        { data: profiles },
        { data: bookingData },
        { data: postData },
        { data: productData },
        { data: collabData },
        { data: commentData },
        { data: followData },
      ] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("posts").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("collab_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*").order("created_at", { ascending: false }),
        supabase.from("follows").select("*").order("created_at", { ascending: false }),
      ]);

      const allUsers = profiles || [];
      const allBookings = bookingData || [];
      const totalRevenue = allBookings.reduce((s, b) => s + (b.price || 0), 0);

      setStats({
        users: allUsers.length,
        professionals: allUsers.filter(u => u.user_type === "professional").length,
        clients: allUsers.filter(u => u.user_type === "client").length,
        bookings: allBookings.length,
        revenue: totalRevenue,
        posts: (postData || []).length,
        products: (productData || []).length,
        collabs: (collabData || []).length,
      });
      setUsers(allUsers);
      setBookings(allBookings);
      setPosts(postData || []);
      setProducts(productData || []);
      setCollabs(collabData || []);
      setComments(commentData || []);
      setFollows(followData || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // ── User Actions ──
  const verifyUser = async (id, current) => {
    await supabase.from("profiles").update({ is_verified: !current }).eq("id", id);
    setUsers(us => us.map(u => u.id === id ? { ...u, is_verified: !current } : u));
    showNotif(current ? "Verification removed" : "User verified ✅");
  };

  const boostUser = async (id, current) => {
    await supabase.from("profiles").update({ is_boosted: !current }).eq("id", id);
    setUsers(us => us.map(u => u.id === id ? { ...u, is_boosted: !current } : u));
    showNotif(current ? "Boost removed" : "User boosted 🚀");
  };

  const suspendUser = async (id, current) => {
    const newStatus = current === "suspended" ? "active" : "suspended";
    await supabase.from("profiles").update({ account_status: newStatus }).eq("id", id);
    setUsers(us => us.map(u => u.id === id ? { ...u, account_status: newStatus } : u));
    showNotif(newStatus === "suspended" ? "User suspended 🚫" : "User reactivated ✅");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user and all their data?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    setUsers(us => us.filter(u => u.id !== id));
    showNotif("User deleted");
  };

  const changeUserType = async (id, newType) => {
    await supabase.from("profiles").update({ user_type: newType }).eq("id", id);
    setUsers(us => us.map(u => u.id === id ? { ...u, user_type: newType } : u));
    showNotif(`Account changed to ${newType}`);
  };

  // ── Post Actions ──
  const deletePost = async (id) => {
    await supabase.from("posts").delete().eq("id", id);
    setPosts(ps => ps.filter(p => p.id !== id));
    showNotif("Post deleted");
  };

  // ── Product Actions ──
  const toggleProductStatus = async (id, current) => {
    const newStatus = current === "active" ? "removed" : "active";
    await supabase.from("products").update({ status: newStatus }).eq("id", id);
    setProducts(ps => ps.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showNotif(newStatus === "active" ? "Product restored ✅" : "Product removed 🚫");
  };

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(ps => ps.filter(p => p.id !== id));
    showNotif("Product deleted");
  };

  // ── Collab Actions ──
  const updateCollab = async (id, status) => {
    await supabase.from("collab_requests").update({ status }).eq("id", id);
    setCollabs(cs => cs.map(c => c.id === id ? { ...c, status } : c));
    showNotif(`Request marked as ${status}`);
  };

  // ── Booking Actions ──
  const updateBooking = async (id, status) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
    showNotif(`Booking marked as ${status}`);
  };

  // ── Comment Actions ──
  const deleteComment = async (id) => {
    await supabase.from("comments").delete().eq("id", id);
    setComments(cs => cs.filter(c => c.id !== id));
    showNotif("Comment deleted");
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "professionals", icon: "✂️", label: "Professionals" },
    { id: "posts", icon: "🎬", label: "Posts & Feed" },
    { id: "comments", icon: "💬", label: "Comments" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "marketplace", icon: "🛍️", label: "Marketplace" },
    { id: "collabs", icon: "🤝", label: "Partnerships" },
    { id: "revenue", icon: "💰", label: "Revenue" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const filteredUsers = users.filter(u => {
    const matchType = userFilter === "all" || u.user_type === userFilter;
    const matchSearch = !userSearch || (u.full_name || "").toLowerCase().includes(userSearch.toLowerCase()) || (u.email || "").toLowerCase().includes(userSearch.toLowerCase());
    return matchType && matchSearch;
  });

  const thStyle = { padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap" };
  const tdStyle = { padding: "13px 16px", fontSize: 13, borderBottom: `1px solid ${BORDER}22`, verticalAlign: "middle" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: DARK, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Notification */}
      {notif && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: notif.type === "success" ? `${GREEN}22` : `${RED}22`, border: `1px solid ${notif.type === "success" ? GREEN : RED}`, borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600, color: notif.type === "success" ? GREEN : RED, backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          {notif.type === "success" ? "✅" : "❌"} {notif.msg}
        </div>
      )}

      {/* ── Sidebar ── */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: DARK2, borderRight: `1px solid ${BORDER}`, padding: "20px 0", display: "flex", flexDirection: "column", transition: "width 0.25s", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ padding: "0 16px 20px", borderBottom: `1px solid ${BORDER}`, marginBottom: 12 }}>
          {sidebarOpen ? (
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
              <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2 }}>ADMIN PANEL</div>
            </div>
          ) : (
            <div style={{ fontSize: 16, fontWeight: 900, color: GOLD, fontFamily: "Georgia, serif" }}>SX</div>
          )}
        </div>
        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 14, padding: "6px 16px", textAlign: "left", marginBottom: 6 }}>{sidebarOpen ? "◀ Collapse" : "▶"}</button>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ background: activeTab === item.id ? `${GOLD}15` : "none", border: "none", cursor: "pointer", borderLeft: activeTab === item.id ? `3px solid ${GOLD}` : "3px solid transparent", padding: "11px 16px", display: "flex", alignItems: "center", gap: 10, color: activeTab === item.id ? GOLD : MUTED, fontSize: 12, fontWeight: activeTab === item.id ? 700 : 400, transition: "all 0.15s", textAlign: "left", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", padding: "14px 16px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onLogout} style={{ background: `${RED}11`, border: `1px solid ${RED}33`, borderRadius: 8, color: RED, cursor: "pointer", padding: "9px 14px", fontSize: 11, fontWeight: 600, width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚪</span>{sidebarOpen && "Sign Out"}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ background: `${DARK2}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <h1 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: 0 }}>{navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}</h1>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>STYLEX Global Admin · Live Supabase Data</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={fetchAll} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, color: GOLD, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🔄 Refresh</button>
            <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: GOLD, fontWeight: 700 }}>👑 FOUNDER</div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 80, color: MUTED }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>⏳</div>
              <div style={{ fontSize: 14 }}>Loading live data from Supabase...</div>
            </div>
          )}

          {/* ════════════════ OVERVIEW ════════════════ */}
          {!loading && activeTab === "overview" && (
            <div>
              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 26 }}>
                {[
                  { label: "Total Users", value: stats.users, icon: "👥", color: BLUE },
                  { label: "Professionals", value: stats.professionals, icon: "✂️", color: GOLD },
                  { label: "Clients", value: stats.clients, icon: "👤", color: GREEN },
                  { label: "Total Bookings", value: stats.bookings, icon: "📅", color: "#B56C8A" },
                  { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: "💰", color: GREEN },
                  { label: "Posts", value: stats.posts, icon: "🎬", color: BLUE },
                  { label: "Products Listed", value: stats.products, icon: "🛍️", color: GOLD },
                  { label: "Collab Requests", value: stats.collabs, icon: "🤝", color: "#B56C8A" },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}44)` }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>{s.value}</div>
                      </div>
                      <span style={{ fontSize: 24 }}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent sign ups */}
              <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 18 }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 14, margin: 0 }}>Recent Sign Ups</h3>
                  <button onClick={() => setActiveTab("users")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 7, color: MUTED, padding: "4px 12px", cursor: "pointer", fontSize: 11 }}>View All</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Name", "Email", "Type", "Country", "Joined"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                    <tbody>
                      {users.slice(0, 6).map((u, i) => (
                        <tr key={i}>
                          <td style={{ ...tdStyle, color: TEXT, fontWeight: 600 }}>{u.full_name || "—"}</td>
                          <td style={{ ...tdStyle, color: MUTED }}>{u.email}</td>
                          <td style={tdStyle}><StatusBadge status={u.user_type || "client"} /></td>
                          <td style={{ ...tdStyle, color: MUTED }}>{u.country || u.location || "—"}</td>
                          <td style={{ ...tdStyle, color: MUTED }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent posts */}
              <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 18 }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 14, margin: 0 }}>Recent Posts</h3>
                  <button onClick={() => setActiveTab("posts")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 7, color: MUTED, padding: "4px 12px", cursor: "pointer", fontSize: 11 }}>View All</button>
                </div>
                {posts.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: MUTED, fontSize: 13 }}>No posts yet</div> : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["By", "Caption", "Type", "Likes", "Comments", "Posted"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                      <tbody>
                        {posts.slice(0, 5).map((p, i) => (
                          <tr key={i}>
                            <td style={{ ...tdStyle, color: TEXT, fontWeight: 600 }}>{p.pro_name || "—"}</td>
                            <td style={{ ...tdStyle, color: MUTED, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.caption || "—"}</td>
                            <td style={tdStyle}><StatusBadge status={p.media_type || "photo"} /></td>
                            <td style={{ ...tdStyle, color: GOLD }}>{p.likes || 0}</td>
                            <td style={{ ...tdStyle, color: MUTED }}>{p.comments || 0}</td>
                            <td style={{ ...tdStyle, color: MUTED }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Collab requests summary */}
              {collabs.filter(c => c.status === "new").length > 0 && (
                <div style={{ background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: GOLD }}>🤝 {collabs.filter(c => c.status === "new").length} New Partnership Request{collabs.filter(c => c.status === "new").length > 1 ? "s" : ""}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Brands and companies want to work with STYLEX</div>
                  </div>
                  <button onClick={() => setActiveTab("collabs")} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 8, color: "#0A0A0B", padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Review →</button>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ ALL USERS ════════════════ */}
          {!loading && activeTab === "users" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search name or email..." style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 14px", color: TEXT, fontSize: 13, outline: "none", minWidth: 220 }} />
                {["all", "client", "professional"].map(f => (
                  <button key={f} onClick={() => setUserFilter(f)} style={{ background: userFilter === f ? `${GOLD}15` : DARK3, border: `1px solid ${userFilter === f ? GOLD : BORDER}`, borderRadius: 8, color: userFilter === f ? GOLD : MUTED, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{f === "all" ? `All (${users.length})` : f === "client" ? `Clients (${stats.clients})` : `Pros (${stats.professionals})`}</button>
                ))}
              </div>
              <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["User", "Email", "Type", "Country", "Status", "Verified", "Joined", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={i} style={{ opacity: u.account_status === "suspended" ? 0.6 : 1 }}>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${GOLD}22`, border: `1px solid ${GOLD}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0, overflow: "hidden" }}>
                                {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (u.full_name || "U").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: TEXT }}>{u.full_name || "No name"}</div>
                                {u.username && <div style={{ fontSize: 11, color: GOLD }}>@{u.username}</div>}
                                {u.category && <div style={{ fontSize: 11, color: MUTED }}>{u.category}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{u.email}</td>
                          <td style={tdStyle}><StatusBadge status={u.user_type || "client"} /></td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{u.country || u.location || "—"}</td>
                          <td style={tdStyle}><StatusBadge status={u.account_status || "active"} /></td>
                          <td style={{ ...tdStyle, fontSize: 16 }}>{u.is_verified ? "✅" : "—"}{u.is_boosted ? " 🚀" : ""}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 11 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <Btn small onClick={() => verifyUser(u.id, u.is_verified)} outline color={GREEN}>{u.is_verified ? "Unverify" : "✅ Verify"}</Btn>
                              <Btn small onClick={() => boostUser(u.id, u.is_boosted)} outline color={GOLD}>{u.is_boosted ? "Unboost" : "🚀 Boost"}</Btn>
                              <Btn small onClick={() => suspendUser(u.id, u.account_status)} danger>{u.account_status === "suspended" ? "Reactivate" : "Suspend"}</Btn>
                              <Btn small onClick={() => changeUserType(u.id, u.user_type === "professional" ? "client" : "professional")} outline color={BLUE}>{u.user_type === "professional" ? "→ Client" : "→ Pro"}</Btn>
                              <Btn small onClick={() => deleteUser(u.id)} danger>Delete</Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════ PROFESSIONALS ════════════════ */}
          {!loading && activeTab === "professionals" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Total Pros", value: stats.professionals, color: GOLD },
                  { label: "Verified", value: users.filter(u => u.user_type === "professional" && u.is_verified).length, color: GREEN },
                  { label: "Boosted", value: users.filter(u => u.user_type === "professional" && u.is_boosted).length, color: BLUE },
                  { label: "Suspended", value: users.filter(u => u.user_type === "professional" && u.account_status === "suspended").length, color: RED },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Professional", "Category", "Location", "Shop Price", "Verified", "Boosted", "Available", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                    <tbody>
                      {users.filter(u => u.user_type === "professional").map((u, i) => (
                        <tr key={i}>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${GOLD}22`, border: `1px solid ${GOLD}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: GOLD, overflow: "hidden" }}>
                                {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (u.full_name || "P").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: TEXT }}>{u.full_name}</div>
                                <div style={{ fontSize: 11, color: MUTED }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: GOLD, fontSize: 12 }}>{u.category || "—"}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{u.country || u.location || "—"}</td>
                          <td style={{ ...tdStyle, color: GREEN, fontWeight: 700 }}>{u.shop_price ? `₦${u.shop_price.toLocaleString()}` : "—"}</td>
                          <td style={{ ...tdStyle, fontSize: 16 }}>{u.is_verified ? "✅" : "—"}</td>
                          <td style={{ ...tdStyle, fontSize: 16 }}>{u.is_boosted ? "🚀" : "—"}</td>
                          <td style={{ ...tdStyle, fontSize: 16 }}>{u.is_available !== false ? "🟢" : "🔴"}</td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <Btn small onClick={() => verifyUser(u.id, u.is_verified)} outline color={GREEN}>{u.is_verified ? "Unverify" : "Verify"}</Btn>
                              <Btn small onClick={() => boostUser(u.id, u.is_boosted)} outline color={GOLD}>{u.is_boosted ? "Unboost" : "Boost"}</Btn>
                              <Btn small onClick={() => suspendUser(u.id, u.account_status)} danger>{u.account_status === "suspended" ? "Unsuspend" : "Suspend"}</Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════ POSTS & FEED ════════════════ */}
          {!loading && activeTab === "posts" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                {["all", "photo", "video"].map(f => (
                  <button key={f} onClick={() => setPostFilter(f)} style={{ background: postFilter === f ? `${GOLD}15` : DARK3, border: `1px solid ${postFilter === f ? GOLD : BORDER}`, borderRadius: 8, color: postFilter === f ? GOLD : MUTED, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{f === "all" ? `All Posts (${posts.length})` : `${f === "photo" ? "📷" : "🎬"} ${f}s (${posts.filter(p => p.media_type === f).length})`}</button>
                ))}
              </div>
              {posts.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 14, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
                  <p style={{ color: MUTED }}>No posts yet</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {(postFilter === "all" ? posts : posts.filter(p => p.media_type === postFilter)).map((p, i) => (
                    <div key={i} style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                      <div style={{ height: 160, background: DARK3, position: "relative", overflow: "hidden" }}>
                        {p.media_type === "video"
                          ? <video src={p.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                          : <img src={p.media_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        <div style={{ position: "absolute", top: 8, right: 8 }}>
                          <StatusBadge status={p.media_type || "photo"} />
                        </div>
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: TEXT, marginBottom: 2 }}>{p.pro_name || "Unknown"}</div>
                        <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{p.caption || "No caption"}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ fontSize: 12, color: MUTED }}>❤️ {p.likes || 0}</span>
                            <span style={{ fontSize: 12, color: MUTED }}>💬 {p.comments || 0}</span>
                          </div>
                          <Btn small danger onClick={() => deletePost(p.id)}>🗑️ Delete</Btn>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════ COMMENTS ════════════════ */}
          {!loading && activeTab === "comments" && (
            <div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>{comments.length} total comments across all posts</div>
              {comments.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 14, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                  <p style={{ color: MUTED }}>No comments yet</p>
                </div>
              ) : (
                <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["User", "Comment", "Post ID", "Date", "Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                    <tbody>
                      {comments.map((c, i) => (
                        <tr key={i}>
                          <td style={{ ...tdStyle, color: TEXT, fontWeight: 600 }}>{c.user_name || "—"}</td>
                          <td style={{ ...tdStyle, color: MUTED, maxWidth: 300 }}>{c.text}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 11, fontFamily: "monospace" }}>{c.post_id?.slice(0, 8)}...</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 11 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                          <td style={tdStyle}><Btn small danger onClick={() => deleteComment(c.id)}>🗑️ Delete</Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ BOOKINGS ════════════════ */}
          {!loading && activeTab === "bookings" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                {["all", "confirmed", "pending", "cancelled"].map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} style={{ background: bookingFilter === f ? `${GOLD}15` : DARK3, border: `1px solid ${bookingFilter === f ? GOLD : BORDER}`, borderRadius: 8, color: bookingFilter === f ? GOLD : MUTED, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{f === "all" ? `All (${bookings.length})` : `${f} (${bookings.filter(b => b.status === f).length})`}</button>
                ))}
              </div>
              {bookings.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 14, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                  <p style={{ color: MUTED }}>No bookings yet</p>
                </div>
              ) : (
                <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Reference", "Service", "Type", "Date", "Time", "Amount", "Status", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                    <tbody>
                      {(bookingFilter === "all" ? bookings : bookings.filter(b => b.status === bookingFilter)).map((b, i) => (
                        <tr key={i}>
                          <td style={{ ...tdStyle, color: GOLD, fontFamily: "monospace", fontSize: 11 }}>{b.reference}</td>
                          <td style={{ ...tdStyle, color: TEXT }}>{b.service}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{b.service_type || "—"}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{b.date}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{b.time}</td>
                          <td style={{ ...tdStyle, color: GREEN, fontWeight: 700 }}>₦{b.price?.toLocaleString()}</td>
                          <td style={tdStyle}><StatusBadge status={b.status || "pending"} /></td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <Btn small onClick={() => updateBooking(b.id, "confirmed")} outline color={GREEN}>Confirm</Btn>
                              <Btn small onClick={() => updateBooking(b.id, "cancelled")} danger>Cancel</Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ MARKETPLACE ════════════════ */}
          {!loading && activeTab === "marketplace" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Total Products", value: products.length, color: GOLD },
                  { label: "Active", value: products.filter(p => p.status === "active").length, color: GREEN },
                  { label: "Removed", value: products.filter(p => p.status === "removed").length, color: RED },
                  { label: "Total Value", value: `₦${products.filter(p => p.status === "active").reduce((s, p) => s + (p.price || 0), 0).toLocaleString()}`, color: BLUE },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {["all", "active", "removed"].map(f => (
                  <button key={f} onClick={() => setProductFilter(f)} style={{ background: productFilter === f ? `${GOLD}15` : DARK3, border: `1px solid ${productFilter === f ? GOLD : BORDER}`, borderRadius: 8, color: productFilter === f ? GOLD : MUTED, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{f === "all" ? `All (${products.length})` : `${f} (${products.filter(p => p.status === f).length})`}</button>
                ))}
              </div>
              {products.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 14, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
                  <p style={{ color: MUTED }}>No products listed yet</p>
                </div>
              ) : (
                <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Product", "Seller", "Category", "Price", "STYLEX Fee (5%)", "Status", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                    <tbody>
                      {(productFilter === "all" ? products : products.filter(p => p.status === productFilter)).map((p, i) => (
                        <tr key={i} style={{ opacity: p.status === "removed" ? 0.5 : 1 }}>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 22 }}>{p.emoji || "🛍️"}</span>
                              <span style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{p.seller_name || "—"}</td>
                          <td style={{ ...tdStyle, color: MUTED, fontSize: 12 }}>{p.category || "—"}</td>
                          <td style={{ ...tdStyle, color: GOLD, fontWeight: 700 }}>₦{p.price?.toLocaleString()}</td>
                          <td style={{ ...tdStyle, color: GREEN }}>₦{Math.round((p.price || 0) * 0.05).toLocaleString()}</td>
                          <td style={tdStyle}><StatusBadge status={p.status || "active"} /></td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <Btn small onClick={() => toggleProductStatus(p.id, p.status)} outline color={p.status === "active" ? RED : GREEN}>{p.status === "active" ? "Remove" : "Restore"}</Btn>
                              <Btn small danger onClick={() => deleteProduct(p.id)}>Delete</Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ PARTNERSHIPS ════════════════ */}
          {!loading && activeTab === "collabs" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Total Requests", value: collabs.length, color: GOLD },
                  { label: "New", value: collabs.filter(c => c.status === "new").length, color: RED },
                  { label: "Reviewing", value: collabs.filter(c => c.status === "reviewing").length, color: GOLD },
                  { label: "Approved", value: collabs.filter(c => c.status === "approved").length, color: GREEN },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {collabs.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 14, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
                  <p style={{ color: MUTED }}>No partnership requests yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {collabs.map((c, i) => (
                    <div key={i} style={{ background: CARD, borderRadius: 14, padding: 20, border: `1px solid ${c.status === "new" ? GOLD + "55" : BORDER}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{c.company_name}</div>
                            <StatusBadge status={c.request_type || "collaboration"} />
                            <StatusBadge status={c.status || "new"} />
                          </div>
                          <div style={{ fontSize: 13, color: GOLD, marginBottom: 6 }}>📧 {c.contact_email}</div>
                          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{c.message}</div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <Btn small onClick={() => updateCollab(c.id, "reviewing")} outline color={GOLD}>Mark Reviewing</Btn>
                          <Btn small onClick={() => updateCollab(c.id, "approved")} outline color={GREEN}>✅ Approve</Btn>
                          <Btn small onClick={() => updateCollab(c.id, "rejected")} danger>❌ Reject</Btn>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════ REVENUE ════════════════ */}
          {!loading && activeTab === "revenue" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 26 }}>
                {[
                  { label: "Total Booking Revenue", value: `₦${stats.revenue.toLocaleString()}`, sub: "All bookings", color: GOLD },
                  { label: "Platform Earnings (20%)", value: `₦${Math.round(stats.revenue * 0.20).toLocaleString()}`, sub: "Booking commission", color: GREEN },
                  { label: "Product Revenue", value: `₦${products.filter(p => p.status === "active").reduce((s, p) => s + (p.price || 0), 0).toLocaleString()}`, sub: "Total product value", color: BLUE },
                  { label: "Product Fees (5%)", value: `₦${Math.round(products.filter(p => p.status === "active").reduce((s, p) => s + (p.price || 0), 0) * 0.05).toLocaleString()}`, sub: "5% product commission", color: GREEN },
                  { label: "Total Bookings", value: stats.bookings, sub: "All time", color: BLUE },
                  { label: "Avg Booking Value", value: stats.bookings > 0 ? `₦${Math.round(stats.revenue / stats.bookings).toLocaleString()}` : "₦0", sub: "Per booking", color: "#B56C8A" },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}44)` }} />
                    <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Revenue breakdown */}
              <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 18 }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 14, margin: 0 }}>All Booking Transactions</h3>
                </div>
                {bookings.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: MUTED }}>No transactions yet</div> : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>{["Reference", "Service", "Amount", "Platform (20%)", "Pro Receives", "Date", "Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                      <tbody>
                        {bookings.map((b, i) => {
                          const comm = Math.round((b.price || 0) * 0.20);
                          const proGets = (b.price || 0) - comm;
                          return (
                            <tr key={i}>
                              <td style={{ ...tdStyle, color: GOLD, fontFamily: "monospace", fontSize: 11 }}>{b.reference}</td>
                              <td style={{ ...tdStyle, color: TEXT }}>{b.service}</td>
                              <td style={{ ...tdStyle, color: GOLD, fontWeight: 700 }}>₦{b.price?.toLocaleString()}</td>
                              <td style={{ ...tdStyle, color: GREEN }}>₦{comm.toLocaleString()}</td>
                              <td style={{ ...tdStyle, color: MUTED }}>₦{proGets.toLocaleString()}</td>
                              <td style={{ ...tdStyle, color: MUTED, fontSize: 11 }}>{b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}</td>
                              <td style={tdStyle}><StatusBadge status={b.status || "pending"} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ════════════════ ANALYTICS ════════════════ */}
          {!loading && activeTab === "analytics" && (
            <AnalyticsPanel bookings={bookings} users={users} posts={posts} products={products} stats={stats} />
          )}

          {/* ════════════════ SETTINGS ════════════════ */}
          {!loading && activeTab === "settings" && (
            <SettingsPanel stats={stats} follows={follows} comments={comments} showNotif={showNotif} />
          )}

        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  return <AdminPanel onLogout={() => setLoggedIn(false)} />;
}
