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
const ADMIN_PASSWORD = "Ccc777###";

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

function StatCard({ label, value, change, icon, color, loading }) {
  return (
    <div style={{ background: CARD, borderRadius: 16, padding: "20px", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}44)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: TEXT }}>
            {loading ? <span style={{ color: MUTED, fontSize: 16 }}>Loading...</span> : value}
          </div>
          {change && <div style={{ fontSize: 12, color: change.startsWith("+") ? GREEN : RED, marginTop: 4, fontWeight: 600 }}>{change}</div>}
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>{icon}</div>
      </div>
    </div>
  );
}

// ─── LOGIN ───
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid credentials. Access denied.");
    }
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
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="admin@stylex.ng" onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Enter admin password" onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 44px 12px 14px", color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED }}>{showPass ? "🙈" : "👁️"}</button>
            </div>
          </div>
          {error && <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: RED }}>⚠️ {error}</div>}
          <button onClick={handleLogin} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: "#0A0A0B", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 14, cursor: "pointer", marginTop: 6 }}>
            Access Admin Panel →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───
function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real data from Supabase
  const [stats, setStats] = useState({ users: 0, professionals: 0, clients: 0, bookings: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch real data from Supabase
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const profileList = profiles || [];

      // Fetch bookings
      const { data: bookingData } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      const bookingList = bookingData || [];

      // Calculate stats
      const totalRevenue = bookingList.reduce((sum, b) => sum + (b.price || 0), 0);
      const professionals = profileList.filter(p => p.user_type === "professional");
      const clients = profileList.filter(p => p.user_type === "client");

      setStats({
        users: profileList.length,
        professionals: professionals.length,
        clients: clients.length,
        bookings: bookingList.length,
        revenue: totalRevenue
      });

      setUsers(profileList);
      setBookings(bookingList);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "revenue", icon: "💰", label: "Revenue" },
    { id: "settings", icon: "⚙️", label: "Settings" },
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

        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 16, padding: "8px 20px", textAlign: "left", marginBottom: 8 }}>
          {sidebarOpen ? "◀" : "▶"}
        </button>

        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ background: activeTab === item.id ? `${GOLD}15` : "none", border: "none", cursor: "pointer", borderLeft: activeTab === item.id ? `3px solid ${GOLD}` : "3px solid transparent", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, color: activeTab === item.id ? GOLD : MUTED, fontSize: 13, fontWeight: activeTab === item.id ? 700 : 400, transition: "all 0.2s", textAlign: "left" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={() => fetchAllData()} style={{ background: `${BLUE}11`, border: `1px solid ${BLUE}33`, borderRadius: 10, color: BLUE, cursor: "pointer", padding: "10px 16px", fontSize: 12, fontWeight: 600, width: "100%", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span>🔄</span>{sidebarOpen && "Refresh Data"}
          </button>
          <button onClick={onLogout} style={{ background: `${RED}11`, border: `1px solid ${RED}33`, borderRadius: 10, color: RED, cursor: "pointer", padding: "10px 16px", fontSize: 12, fontWeight: 600, width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚪</span>{sidebarOpen && "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{ background: `${DARK2}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <h1 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: 0 }}>
              {navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>STYLEX Admin · Live Data from Supabase</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: GREEN }}>🟢 Connected to Supabase</div>
            <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: GOLD, fontWeight: 700 }}>👑 FOUNDER</div>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard label="Total Users" value={stats.users} icon="👥" color={BLUE} loading={loading} />
                <StatCard label="Professionals" value={stats.professionals} icon="✂️" color={GOLD} loading={loading} />
                <StatCard label="Clients" value={stats.clients} icon="👤" color="#B56C8A" loading={loading} />
                <StatCard label="Total Bookings" value={stats.bookings} icon="📅" color={GREEN} loading={loading} />
                <StatCard label="Total Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon="💰" color="#7C5CB5" loading={loading} />
                <StatCard label="Commission (5%)" value={`₦${Math.round(stats.revenue * 0.05).toLocaleString()}`} icon="🏦" color={GREEN} loading={loading} />
              </div>

              {/* Recent Users */}
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>Recent Signups</h3>
                  <button onClick={() => setActiveTab("users")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>View All</button>
                </div>
                {loading ? (
                  <div style={{ padding: 30, textAlign: "center", color: MUTED }}>Loading real data...</div>
                ) : users.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
                    <div style={{ color: MUTED, fontSize: 13 }}>No users yet. Share your app to get users!</div>
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
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{new Date(user.created_at).toLocaleDateString()}</td>
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
                {loading ? (
                  <div style={{ padding: 30, textAlign: "center", color: MUTED }}>Loading...</div>
                ) : bookings.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                    <div style={{ color: MUTED, fontSize: 13 }}>No bookings yet. Bookings will appear here when users start booking.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                          {["Reference", "Service", "Date", "Time", "Amount", "Commission", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 10).map((b, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                            <td style={{ padding: "14px 16px", fontSize: 11, color: GOLD, fontFamily: "monospace" }}>{b.reference}</td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.service}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.date}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.time}</td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 700 }}>₦{b.price?.toLocaleString()}</td>
                            <td style={{ padding: "14px 16px", fontSize: 12, color: GREEN }}>₦{Math.round((b.price || 0) * 0.05).toLocaleString()}</td>
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

          {/* USERS */}
          {activeTab === "users" && (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Total", val: stats.users, color: BLUE },
                  { label: "Professionals", val: stats.professionals, color: GOLD },
                  { label: "Clients", val: stats.clients, color: GREEN },
                ].map(s => (
                  <div key={s.label} style={{ background: CARD, borderRadius: 12, padding: "14px 20px", border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{loading ? "..." : s.val}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>All Users — Real Data</h3>
                </div>
                {loading ? (
                  <div style={{ padding: 40, textAlign: "center", color: MUTED }}>Loading from Supabase...</div>
                ) : users.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: TEXT, marginBottom: 8 }}>No users yet</div>
                    <div style={{ color: MUTED, fontSize: 13 }}>Share your app link to get your first users!</div>
                    <div style={{ marginTop: 16, background: DARK3, borderRadius: 10, padding: "10px 16px", fontSize: 13, color: GOLD, fontFamily: "monospace" }}>stylex-mauve.vercel.app</div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Name", "Email", "Type", "Phone", "Location", "Category", "Joined"].map(h => (
                          <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                          <td style={{ padding: "14px 18px", fontSize: 13, color: TEXT, fontWeight: 600 }}>{user.full_name || "—"}</td>
                          <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{user.email}</td>
                          <td style={{ padding: "14px 18px" }}><StatusBadge status={user.user_type || "client"} /></td>
                          <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{user.phone || "—"}</td>
                          <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{user.location || "—"}</td>
                          <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{user.category || "—"}</td>
                          <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Total", val: stats.bookings, color: BLUE },
                  { label: "Revenue", val: `₦${stats.revenue.toLocaleString()}`, color: GOLD },
                  { label: "Commission", val: `₦${Math.round(stats.revenue * 0.05).toLocaleString()}`, color: GREEN },
                ].map(s => (
                  <div key={s.label} style={{ background: CARD, borderRadius: 12, padding: "14px 20px", border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{loading ? "..." : s.val}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>All Bookings — Real Data</h3>
                </div>
                {loading ? (
                  <div style={{ padding: 40, textAlign: "center", color: MUTED }}>Loading from Supabase...</div>
                ) : bookings.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: TEXT, marginBottom: 8 }}>No bookings yet</div>
                    <div style={{ color: MUTED, fontSize: 13 }}>Bookings will appear here when users start booking professionals</div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Reference", "Service", "Date", "Time", "Amount", "Commission", "Status"].map(h => (
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
                          <td style={{ padding: "14px 16px", fontSize: 12, color: GREEN }}>₦{Math.round((b.price || 0) * 0.05).toLocaleString()}</td>
                          <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status || "pending"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* REVENUE */}
          {activeTab === "revenue" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, sub: "All time", color: GOLD },
                  { label: "Platform Commission", value: `₦${Math.round(stats.revenue * 0.05).toLocaleString()}`, sub: "5% of all bookings", color: GREEN },
                  { label: "Total Bookings", value: stats.bookings, sub: "All time", color: BLUE },
                  { label: "Avg Booking Value", value: stats.bookings > 0 ? `₦${Math.round(stats.revenue / stats.bookings).toLocaleString()}` : "₦0", sub: "Per booking", color: "#B56C8A" },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}44)`, borderRadius: 2, marginBottom: 14 }} />
                    <div style={{ fontSize: 11, color: MUTED, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{loading ? "..." : s.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 22 }}>
                <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Revenue Summary</h3>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 30, color: MUTED }}>
                    No revenue data yet. Revenue will appear here when users make real bookings.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {bookings.map((b, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}22` }}>
                        <div>
                          <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{b.service}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{b.reference} · {b.date}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>₦{b.price?.toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: GREEN }}>Commission: ₦{Math.round((b.price || 0) * 0.05).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { title: "Platform Commission Rate", desc: "Percentage charged per booking", value: "5%", editable: true },
                  { title: "Admin Email", desc: "Login email for admin panel", value: ADMIN_EMAIL, editable: true },
                  { title: "App Name", desc: "Display name across the platform", value: "STYLEX", editable: true },
                  { title: "Live App URL", desc: "Your Vercel deployment URL", value: "stylex-mauve.vercel.app", editable: false },
                  { title: "Database", desc: "Supabase connection status", value: "✅ Connected", editable: false },
                  { title: "Payment Provider", desc: "Active payment gateway", value: "Flutterwave (Coming Soon)", editable: false },
                ].map((setting, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 14, padding: "18px 20px", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 3 }}>{setting.title}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{setting.desc}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{setting.value}</span>
                      {setting.editable && (
                        <button onClick={() => showNotif("Settings saved!")} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}44`, borderRadius: 8, color: GOLD, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                      )}
                    </div>
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