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

const ADMIN_EMAIL = "c.sparkz.empire@gmail.com";
const ADMIN_PASSWORD = "Csparkz777###";

function StatusBadge({ status }) {
  const colors = {
    verified: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    pending: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
    suspended: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    active: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    inactive: { bg: `${MUTED}22`, color: MUTED, border: `${MUTED}44` },
    completed: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    confirmed: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    upcoming: { bg: `${BLUE}22`, color: BLUE, border: `${BLUE}44` },
    cancelled: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    open: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    reviewing: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
    client: { bg: `${BLUE}22`, color: BLUE, border: `${BLUE}44` },
    professional: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
  };
  const s = colors[status] || colors.pending;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{status}</span>
  );
}

// ─── LOGIN ───
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) onLogin();
    else setError("Invalid credentials. Access denied.");
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
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="admin@stylex.ng" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Enter admin password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 44px 12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED }}>{showPass ? "🙈" : "👁️"}</button>
          </div>
          {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: RED }}>⚠️ {error}</div>}
          <button onClick={handleLogin} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: "#0A0A0B", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 14, cursor: "pointer", marginTop: 6 }}>Access Admin Panel →</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PANEL ───
function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  // Real data from Supabase
  const [stats, setStats] = useState({ users: 0, professionals: 0, clients: 0, bookings: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const allUsers = profiles || [];
      const professionals = allUsers.filter(u => u.user_type === "professional");
      const clients = allUsers.filter(u => u.user_type === "client");

      // Fetch bookings
      const { data: bookingData } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      const allBookings = bookingData || [];
      const totalRevenue = allBookings.reduce((sum, b) => sum + (b.price || 0), 0);

      setStats({
        users: allUsers.length,
        professionals: professionals.length,
        clients: clients.length,
        bookings: allBookings.length,
        revenue: totalRevenue
      });
      setUsers(allUsers);
      setBookings(allBookings);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteUser = async (id) => {
    await supabase.from("profiles").delete().eq("id", id);
    fetchAllData();
    showNotif("User removed successfully");
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "revenue", icon: "💰", label: "Revenue" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const statCards = [
    { label: "Total Users", value: stats.users, icon: "👥", color: BLUE, sub: "Registered accounts" },
    { label: "Professionals", value: stats.professionals, icon: "✂️", color: GOLD, sub: "Beauty professionals" },
    { label: "Clients", value: stats.clients, icon: "👤", color: GREEN, sub: "Registered clients" },
    { label: "Total Bookings", value: stats.bookings, icon: "📅", color: "#B56C8A", sub: "All time bookings" },
    { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: "💰", color: GREEN, sub: "Platform earnings" },
    { label: "Active Now", value: stats.users, icon: "🟢", color: BLUE, sub: "Total registered" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: DARK, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, background: notification.type === "success" ? `${GREEN}22` : `${RED}22`, border: `1px solid ${notification.type === "success" ? GREEN : RED}`, borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600, color: notification.type === "success" ? GREEN : RED, backdropFilter: "blur(10px)" }}>
          {notification.type === "success" ? "✅" : "❌"} {notification.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 240 : 70, background: DARK2, borderRight: `1px solid ${BORDER}`, padding: "24px 0", display: "flex", flexDirection: "column", transition: "width 0.3s", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
          {sidebarOpen ? (
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 3, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
              <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2 }}>ADMIN PANEL</div>
            </div>
          ) : (
            <div style={{ fontSize: 18, fontWeight: 900, color: GOLD, fontFamily: "Georgia, serif" }}>SX</div>
          )}
        </div>
        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 16, padding: "8px 20px", textAlign: "left", marginBottom: 8 }}>{sidebarOpen ? "◀" : "▶"}</button>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ background: activeTab === item.id ? `${GOLD}15` : "none", border: "none", cursor: "pointer", borderLeft: activeTab === item.id ? `3px solid ${GOLD}` : "3px solid transparent", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, color: activeTab === item.id ? GOLD : MUTED, fontSize: 13, fontWeight: activeTab === item.id ? 700 : 400, transition: "all 0.2s", textAlign: "left" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onLogout} style={{ background: `${RED}11`, border: `1px solid ${RED}33`, borderRadius: 10, color: RED, cursor: "pointer", padding: "10px 16px", fontSize: 12, fontWeight: 600, width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚪</span>{sidebarOpen && "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ background: `${DARK2}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <h1 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: 0 }}>{navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}</h1>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>STYLEX Admin · Real Data from Supabase</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={fetchAllData} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, color: GOLD, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🔄 Refresh</button>
            <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: GOLD, fontWeight: 700 }}>👑 FOUNDER</div>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {loading && (
            <div style={{ textAlign: "center", padding: 60, color: MUTED }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              <div>Loading real data from Supabase...</div>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {!loading && activeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {statCards.map((stat, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${stat.color}, ${stat.color}44)` }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{stat.label.toUpperCase()}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: TEXT }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{stat.sub}</div>
                      </div>
                      <div style={{ fontSize: 28, opacity: 0.8 }}>{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Users */}
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>Recent Sign Ups</h3>
                  <button onClick={() => setActiveTab("users")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>View All</button>
                </div>
                {users.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: MUTED }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                    <div>No users have signed up yet.</div>
                    <div style={{ fontSize: 12, marginTop: 8 }}>Share your app link to get your first users!</div>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                          {["Name", "Email", "Type", "Location", "Joined"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 5).map((user, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT, fontWeight: 600 }}>{user.full_name || "—"}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{user.email}</td>
                            <td style={{ padding: "14px 16px" }}><StatusBadge status={user.user_type || "client"} /></td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{user.location || "—"}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Bookings */}
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>Recent Bookings</h3>
                </div>
                {bookings.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: MUTED }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
                    <div>No bookings yet.</div>
                    <div style={{ fontSize: 12, marginTop: 8 }}>Bookings will appear here once users start booking.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                          {["Reference", "Service", "Date", "Time", "Amount", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                            <td style={{ padding: "14px 16px", fontSize: 11, color: GOLD, fontFamily: "monospace" }}>{b.reference}</td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.service}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.date}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.time}</td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 700 }}>₦{b.price?.toLocaleString()}</td>
                            <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status || "pending"} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {!loading && activeTab === "users" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: MUTED }}>{users.length} registered users</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 12, color: GOLD }}>✂️ {stats.professionals} Professionals</span>
                  <span style={{ fontSize: 12, color: BLUE }}>👤 {stats.clients} Clients</span>
                </div>
              </div>

              {users.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 16, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No users yet</h3>
                  <p style={{ color: MUTED, fontSize: 13 }}>Share your app link to get your first users!</p>
                  <div style={{ marginTop: 20, background: DARK3, borderRadius: 12, padding: 16, border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>YOUR APP LINK</div>
                    <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>stylex-mauve.vercel.app</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {users.map((user, i) => (
                    <div key={i} style={{ background: CARD, borderRadius: 14, padding: "18px 20px", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${GOLD}22`, border: `1.5px solid ${GOLD}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: GOLD }}>
                          {(user.full_name || user.email || "U").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{user.full_name || "No name"}</div>
                          <div style={{ fontSize: 12, color: MUTED }}>{user.email}</div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                            {user.location && `📍 ${user.location}`}
                            {user.phone && ` · 📱 ${user.phone}`}
                            {user.category && ` · ✂️ ${user.category}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <StatusBadge status={user.user_type || "client"} />
                        <div style={{ fontSize: 11, color: MUTED }}>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</div>
                        <button onClick={() => deleteUser(user.id)} style={{ background: `${RED}22`, border: `1px solid ${RED}44`, borderRadius: 8, color: RED, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {!loading && activeTab === "bookings" && (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Total", val: bookings.length, color: BLUE },
                  { label: "Confirmed", val: bookings.filter(b => b.status === "confirmed").length, color: GREEN },
                  { label: "Pending", val: bookings.filter(b => b.status === "pending").length, color: GOLD },
                  { label: "Cancelled", val: bookings.filter(b => b.status === "cancelled").length, color: RED },
                ].map(s => (
                  <div key={s.label} style={{ background: CARD, borderRadius: 12, padding: "14px 20px", border: `1px solid ${BORDER}`, minWidth: 100 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {bookings.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 16, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No bookings yet</h3>
                  <p style={{ color: MUTED, fontSize: 13 }}>Bookings will appear here when users start booking professionals</p>
                </div>
              ) : (
                <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Reference", "Service", "Date", "Time", "Amount", "Status"].map(h => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                          <td style={{ padding: "14px 16px", fontSize: 11, color: GOLD, fontFamily: "monospace" }}>{b.reference}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.service}</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.date}</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.time}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 700 }}>₦{b.price?.toLocaleString()}</td>
                          <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status || "pending"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── REVENUE ── */}
          {!loading && activeTab === "revenue" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, sub: "All time", color: GOLD },
                  { label: "Platform Commission", value: `₦${Math.round(stats.revenue * 0.05).toLocaleString()}`, sub: "5% of bookings", color: GREEN },
                  { label: "Total Bookings", value: stats.bookings, sub: "All time", color: BLUE },
                  { label: "Avg Booking Value", value: stats.bookings > 0 ? `₦${Math.round(stats.revenue / stats.bookings).toLocaleString()}` : "₦0", sub: "Per booking", color: "#B56C8A" },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}44)`, borderRadius: 2, marginBottom: 14 }} />
                    <div style={{ fontSize: 11, color: MUTED, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {bookings.length === 0 ? (
                <div style={{ background: CARD, borderRadius: 16, padding: 60, textAlign: "center", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No revenue yet</h3>
                  <p style={{ color: MUTED, fontSize: 13 }}>Revenue will appear here when users start paying for bookings</p>
                </div>
              ) : (
                <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}` }}>
                    <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>All Transactions</h3>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Reference", "Service", "Amount", "Commission (5%)", "Date", "Status"].map(h => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                          <td style={{ padding: "14px 16px", fontSize: 11, color: GOLD, fontFamily: "monospace" }}>{b.reference}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.service}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 700 }}>₦{b.price?.toLocaleString()}</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: GREEN }}>₦{Math.round((b.price || 0) * 0.05).toLocaleString()}</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}</td>
                          <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status || "pending"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {!loading && activeTab === "settings" && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { title: "Platform Commission Rate", desc: "Current rate charged per booking", value: "5%" },
                  { title: "Admin Email", desc: "Login email for admin panel", value: ADMIN_EMAIL },
                  { title: "App Name", desc: "Display name across the platform", value: "STYLEX" },
                  { title: "Live App URL", desc: "Your public app URL", value: "stylex-mauve.vercel.app" },
                  { title: "Database", desc: "Supabase project", value: "utvrujgqzheifblizarw" },
                  { title: "Supported Cities", desc: "Cities where service is active", value: "Lagos, Abuja, Port Harcourt, Enugu" },
                ].map((setting, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: "18px 20px", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 3 }}>{setting.title}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{setting.desc}</div>
                    </div>
                    <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{setting.value}</span>
                  </div>
                ))}
              </div>
            </div>
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