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
const BLUE = "#5B9BD5";

// ─── ADMIN CREDENTIALS ───
const ADMIN_EMAIL = "c.sparkz.empire@gmail.com";
const ADMIN_PASSWORD = "Ccc777###";

const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: "👥", color: BLUE },
  { label: "Professionals", value: "347", change: "+8%", icon: "✂️", color: GOLD },
  { label: "Total Bookings", value: "892", change: "+23%", icon: "📅", color: GREEN },
  { label: "Revenue (₦)", value: "4.2M", change: "+18%", icon: "💰", color: "#B56C8A" },
  { label: "Pending Payouts", value: "₦890K", change: "-5%", icon: "💳", color: "#7C5CB5" },
  { label: "Active Today", value: "143", change: "+31%", icon: "🟢", color: GREEN },
];

const professionals = [
  { id: 1, name: "Amara Osei", category: "Hairstylist", location: "Lagos", status: "verified", bookings: 89, earnings: "₦1.2M", joined: "Jan 12, 2025", flagged: false },
  { id: 2, name: "Fatima Bello", category: "Makeup Artist", location: "Abuja", status: "verified", bookings: 64, earnings: "₦980K", joined: "Feb 3, 2025", flagged: false },
  { id: 3, name: "Chidi Nwosu", category: "Barber", location: "PH", status: "pending", bookings: 12, earnings: "₦45K", joined: "May 28, 2025", flagged: false },
  { id: 4, name: "Zara Adeyemi", category: "Nail Tech", location: "Lagos", status: "verified", bookings: 45, earnings: "₦320K", joined: "Mar 7, 2025", flagged: true },
  { id: 5, name: "Kemi Lawal", category: "Lash Tech", location: "Abuja", status: "suspended", bookings: 23, earnings: "₦180K", joined: "Apr 1, 2025", flagged: false },
  { id: 6, name: "Emeka Obi", category: "Tattoo Artist", location: "Enugu", status: "pending", bookings: 5, earnings: "₦60K", joined: "Jun 1, 2025", flagged: false },
];

const users = [
  { id: 1, name: "Chioma Eze", email: "chioma@gmail.com", bookings: 8, spent: "₦95K", joined: "Feb 2025", status: "active" },
  { id: 2, name: "Ngozi Madu", email: "ngozi@yahoo.com", bookings: 3, spent: "₦42K", joined: "Mar 2025", status: "active" },
  { id: 3, name: "Tunde Bakare", email: "tunde@gmail.com", bookings: 1, spent: "₦15K", joined: "May 2025", status: "inactive" },
  { id: 4, name: "Adaeze Obi", email: "adaeze@gmail.com", bookings: 12, spent: "₦180K", joined: "Jan 2025", status: "active" },
  { id: 5, name: "Bola Akin", email: "bola@hotmail.com", bookings: 0, spent: "₦0", joined: "Jun 2025", status: "inactive" },
];

const bookings = [
  { id: "SX-4A8B2C", client: "Chioma Eze", pro: "Amara Osei", service: "Box Braids", date: "Jun 12", amount: "₦15,750", status: "completed", commission: "₦787" },
  { id: "SX-9F3D7E", client: "Ngozi Madu", pro: "Fatima Bello", service: "Bridal Makeup", date: "Jun 17", amount: "₦21,000", status: "upcoming", commission: "₦1,050" },
  { id: "SX-2E5C1A", client: "Adaeze Obi", pro: "Chidi Nwosu", service: "Skin Fade", date: "Jun 1", amount: "₦5,250", status: "completed", commission: "₦262" },
  { id: "SX-7K2M9P", client: "Tunde Bakare", pro: "Zara Adeyemi", service: "Gel Nails", date: "Jun 8", amount: "₦8,400", status: "cancelled", commission: "₦0" },
  { id: "SX-1B3N5Q", client: "Bola Akin", pro: "Kemi Lawal", service: "Volume Lashes", date: "Jun 20", amount: "₦12,600", status: "upcoming", commission: "₦630" },
];

const disputes = [
  { id: 1, client: "Ngozi Madu", pro: "Zara Adeyemi", issue: "Professional arrived 2 hours late", amount: "₦8,000", status: "open", date: "Jun 5" },
  { id: 2, client: "Tunde Bakare", pro: "Kemi Lawal", issue: "Service quality not as advertised", amount: "₦12,000", status: "reviewing", date: "Jun 3" },
];

function StatusBadge({ status }) {
  const colors = {
    verified: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    pending: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
    suspended: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    active: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    inactive: { bg: `${MUTED}22`, color: MUTED, border: `${MUTED}44` },
    completed: { bg: `${GREEN}22`, color: GREEN, border: `${GREEN}44` },
    upcoming: { bg: `${BLUE}22`, color: BLUE, border: `${BLUE}44` },
    cancelled: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    open: { bg: `${RED}22`, color: RED, border: `${RED}44` },
    reviewing: { bg: `${GOLD}22`, color: GOLD, border: `${GOLD}44` },
  };
  const s = colors[status] || colors.pending;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 5,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>{status}</span>
  );
}

function StatCard({ stat }) {
  return (
    <div style={{
      background: CARD, borderRadius: 16, padding: "20px",
      border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${stat.color}, ${stat.color}44)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{stat.label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: TEXT }}>{stat.value}</div>
          <div style={{ fontSize: 12, color: stat.change.startsWith("+") ? GREEN : RED, marginTop: 4, fontWeight: 600 }}>{stat.change} this month</div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>{stat.icon}</div>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ───
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid email or password. Access denied.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: DARK,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20
    }}>
      <div style={{
        background: CARD, borderRadius: 24, padding: "40px 36px",
        width: "100%", maxWidth: 420, border: `1px solid ${BORDER}`,
        boxShadow: `0 0 80px ${GOLD}10`
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 4, color: GOLD, fontFamily: "Georgia, serif" }}>STYLEX</div>
          <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginTop: 4 }}>ADMIN CONTROL PANEL</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, margin: "12px auto 0" }} />
        </div>

        {/* Warning box */}
        <div style={{
          background: `${GOLD}11`, border: `1px solid ${GOLD}33`,
          borderRadius: 10, padding: "10px 14px", marginBottom: 24,
          display: "flex", gap: 10, alignItems: "center"
        }}>
          <span style={{ fontSize: 16 }}>🔐</span>
          <span style={{ fontSize: 12, color: `${GOLD}cc` }}>Restricted access. Founder & Admin only.</span>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>ADMIN EMAIL</label>
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@stylex.ng"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%", background: DARK3, border: `1px solid ${BORDER}`,
                borderRadius: 10, padding: "12px 14px", color: TEXT,
                fontSize: 14, outline: "none", boxSizing: "border-box"
              }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", background: DARK3, border: `1px solid ${BORDER}`,
                  borderRadius: 10, padding: "12px 44px 12px 14px", color: TEXT,
                  fontSize: 14, outline: "none", boxSizing: "border-box"
                }} />
              <button onClick={() => setShowPass(s => !s)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED
              }}>{showPass ? "🙈" : "👁️"}</button>
            </div>
          </div>

          {error && (
            <div style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: RED }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleLogin} style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: "#0A0A0B", border: "none", borderRadius: 12,
            padding: "14px", fontWeight: 800, fontSize: 14,
            cursor: "pointer", marginTop: 6, letterSpacing: 0.5
          }}>
            Access Admin Panel →
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 20 }}>
          Default credentials shown for demo purposes only.<br />
          Change password after first login.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───
function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [proList, setProList] = useState(professionals);
  const [userList, setUserList] = useState(users);
  const [disputeList, setDisputeList] = useState(disputes);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateProStatus = (id, status) => {
    setProList(p => p.map(pro => pro.id === id ? { ...pro, status } : pro));
    showNotif(`Professional ${status} successfully`);
  };

  const toggleFlag = (id) => {
    setProList(p => p.map(pro => pro.id === id ? { ...pro, flagged: !pro.flagged } : pro));
    showNotif("Professional flag updated");
  };

  const resolveDispute = (id) => {
    setDisputeList(d => d.map(dis => dis.id === id ? { ...dis, status: "resolved" } : dis));
    showNotif("Dispute marked as resolved");
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "professionals", icon: "✂️", label: "Professionals" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "disputes", icon: "⚖️", label: "Disputes" },
    { id: "revenue", icon: "💰", label: "Revenue" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: DARK, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: notification.type === "success" ? `${GREEN}22` : `${RED}22`,
          border: `1px solid ${notification.type === "success" ? GREEN : RED}`,
          borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600,
          color: notification.type === "success" ? GREEN : RED,
          backdropFilter: "blur(10px)"
        }}>
          {notification.type === "success" ? "✅" : "❌"} {notification.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 70, background: DARK2,
        borderRight: `1px solid ${BORDER}`, padding: "24px 0",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s", flexShrink: 0, position: "sticky", top: 0, height: "100vh"
      }}>
        {/* Logo */}
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

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(s => !s)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: MUTED, fontSize: 16, padding: "8px 20px", textAlign: "left", marginBottom: 8
        }}>{sidebarOpen ? "◀" : "▶"}</button>

        {/* Nav */}
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            background: activeTab === item.id ? `${GOLD}15` : "none",
            border: "none", cursor: "pointer",
            borderLeft: activeTab === item.id ? `3px solid ${GOLD}` : "3px solid transparent",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: 12,
            color: activeTab === item.id ? GOLD : MUTED,
            fontSize: 13, fontWeight: activeTab === item.id ? 700 : 400,
            transition: "all 0.2s", textAlign: "left"
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}

        {/* Logout */}
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onLogout} style={{
            background: `${RED}11`, border: `1px solid ${RED}33`,
            borderRadius: 10, color: RED, cursor: "pointer",
            padding: "10px 16px", fontSize: 12, fontWeight: 600,
            width: "100%", display: "flex", alignItems: "center", gap: 8
          }}>
            <span>🚪</span>{sidebarOpen && "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{
          background: `${DARK2}ee`, backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${BORDER}`, padding: "16px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100
        }}>
          <div>
            <h1 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: 0 }}>
              {navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>STYLEX Admin · Founder Access</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: MUTED }}>Logged in as</div>
            <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: GOLD, fontWeight: 700 }}>
              👑 FOUNDER
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
              </div>

              {/* Recent bookings */}
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, margin: 0 }}>Recent Bookings</h3>
                  <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>View All</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Booking ID", "Client", "Professional", "Service", "Amount", "Commission", "Status"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: GOLD, fontFamily: "monospace" }}>{b.id}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.client}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.pro}</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.service}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 700 }}>{b.amount}</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: GREEN }}>{b.commission}</td>
                          <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFESSIONALS ── */}
          {activeTab === "professionals" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: MUTED }}>{proList.length} professionals registered</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, color: GREEN }}>● {proList.filter(p => p.status === "verified").length} Verified</span>
                  <span style={{ fontSize: 12, color: GOLD }}>● {proList.filter(p => p.status === "pending").length} Pending</span>
                  <span style={{ fontSize: 12, color: RED }}>● {proList.filter(p => p.status === "suspended").length} Suspended</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {proList.map(pro => (
                  <div key={pro.id} style={{
                    background: CARD, borderRadius: 14, padding: "18px 20px",
                    border: `1px solid ${pro.flagged ? `${RED}44` : BORDER}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: `${GOLD}22`, border: `1.5px solid ${GOLD}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: GOLD
                      }}>{pro.name.split(" ").map(n => n[0]).join("")}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{pro.name}</span>
                          {pro.flagged && <span style={{ fontSize: 10, color: RED, background: `${RED}22`, border: `1px solid ${RED}44`, borderRadius: 4, padding: "2px 6px" }}>🚩 FLAGGED</span>}
                        </div>
                        <div style={{ fontSize: 12, color: MUTED }}>{pro.category} · {pro.location} · Joined {pro.joined}</div>
                        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: MUTED }}>📅 {pro.bookings} bookings</span>
                          <span style={{ fontSize: 11, color: GREEN }}>💰 {pro.earnings}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <StatusBadge status={pro.status} />
                      {pro.status === "pending" && (
                        <button onClick={() => updateProStatus(pro.id, "verified")} style={{
                          background: `${GREEN}22`, border: `1px solid ${GREEN}44`,
                          borderRadius: 8, color: GREEN, padding: "6px 12px",
                          cursor: "pointer", fontSize: 11, fontWeight: 700
                        }}>✓ Verify</button>
                      )}
                      {pro.status === "verified" && (
                        <button onClick={() => updateProStatus(pro.id, "suspended")} style={{
                          background: `${RED}22`, border: `1px solid ${RED}44`,
                          borderRadius: 8, color: RED, padding: "6px 12px",
                          cursor: "pointer", fontSize: 11, fontWeight: 700
                        }}>⊘ Suspend</button>
                      )}
                      {pro.status === "suspended" && (
                        <button onClick={() => updateProStatus(pro.id, "verified")} style={{
                          background: `${BLUE}22`, border: `1px solid ${BLUE}44`,
                          borderRadius: 8, color: BLUE, padding: "6px 12px",
                          cursor: "pointer", fontSize: 11, fontWeight: 700
                        }}>↺ Restore</button>
                      )}
                      <button onClick={() => toggleFlag(pro.id)} style={{
                        background: pro.flagged ? `${RED}22` : `${MUTED}11`,
                        border: `1px solid ${pro.flagged ? RED : BORDER}`,
                        borderRadius: 8, color: pro.flagged ? RED : MUTED,
                        padding: "6px 12px", cursor: "pointer", fontSize: 11
                      }}>🚩 {pro.flagged ? "Unflag" : "Flag"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>{userList.length} registered clients</div>
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["Name", "Email", "Bookings", "Total Spent", "Joined", "Status", "Action"].map(h => (
                        <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                        <td style={{ padding: "14px 18px", fontSize: 13, color: TEXT, fontWeight: 600 }}>{user.name}</td>
                        <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{user.email}</td>
                        <td style={{ padding: "14px 18px", fontSize: 13, color: TEXT }}>{user.bookings}</td>
                        <td style={{ padding: "14px 18px", fontSize: 13, color: GOLD, fontWeight: 700 }}>{user.spent}</td>
                        <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{user.joined}</td>
                        <td style={{ padding: "14px 18px" }}><StatusBadge status={user.status} /></td>
                        <td style={{ padding: "14px 18px" }}>
                          <button onClick={() => {
                            setUserList(u => u.map(us => us.id === user.id ? { ...us, status: us.status === "active" ? "inactive" : "active" } : us));
                            showNotif("User status updated");
                          }} style={{
                            background: "none", border: `1px solid ${BORDER}`,
                            borderRadius: 6, color: MUTED, padding: "5px 10px",
                            cursor: "pointer", fontSize: 11
                          }}>Toggle</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeTab === "bookings" && (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Total", val: bookings.length, color: BLUE },
                  { label: "Completed", val: bookings.filter(b => b.status === "completed").length, color: GREEN },
                  { label: "Upcoming", val: bookings.filter(b => b.status === "upcoming").length, color: GOLD },
                  { label: "Cancelled", val: bookings.filter(b => b.status === "cancelled").length, color: RED },
                ].map(s => (
                  <div key={s.label} style={{ background: CARD, borderRadius: 12, padding: "14px 20px", border: `1px solid ${BORDER}`, minWidth: 100 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["ID", "Client", "Professional", "Service", "Date", "Amount", "Commission", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                        <td style={{ padding: "14px 16px", fontSize: 11, color: GOLD, fontFamily: "monospace" }}>{b.id}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.client}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{b.pro}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.service}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{b.date}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: GOLD, fontWeight: 700 }}>{b.amount}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: GREEN }}>{b.commission}</td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DISPUTES ── */}
          {activeTab === "disputes" && (
            <div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>{disputeList.filter(d => d.status !== "resolved").length} active disputes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {disputeList.map(d => (
                  <div key={d.id} style={{
                    background: CARD, borderRadius: 16, padding: 22,
                    border: `1px solid ${d.status === "open" ? `${RED}44` : BORDER}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>Dispute #{d.id}</span>
                          <StatusBadge status={d.status} />
                        </div>
                        <div style={{ fontSize: 12, color: MUTED }}>Filed on {d.date}</div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: RED }}>{d.amount} at stake</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                      <div style={{ background: DARK3, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 10, color: MUTED, marginBottom: 4, letterSpacing: 1 }}>CLIENT</div>
                        <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{d.client}</div>
                      </div>
                      <div style={{ background: DARK3, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 10, color: MUTED, marginBottom: 4, letterSpacing: 1 }}>PROFESSIONAL</div>
                        <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{d.pro}</div>
                      </div>
                    </div>
                    <div style={{ background: DARK3, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: MUTED, marginBottom: 4, letterSpacing: 1 }}>ISSUE REPORTED</div>
                      <div style={{ fontSize: 13, color: TEXT }}>{d.issue}</div>
                    </div>
                    {d.status !== "resolved" && (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => resolveDispute(d.id)} style={{
                          background: `${GREEN}22`, border: `1px solid ${GREEN}44`,
                          borderRadius: 10, color: GREEN, padding: "10px 20px",
                          cursor: "pointer", fontSize: 12, fontWeight: 700
                        }}>✓ Mark Resolved</button>
                        <button style={{
                          background: `${GOLD}22`, border: `1px solid ${GOLD}44`,
                          borderRadius: 10, color: GOLD, padding: "10px 20px",
                          cursor: "pointer", fontSize: 12, fontWeight: 700
                        }}>💳 Issue Refund</button>
                        <button style={{
                          background: `${RED}22`, border: `1px solid ${RED}44`,
                          borderRadius: 10, color: RED, padding: "10px 20px",
                          cursor: "pointer", fontSize: 12, fontWeight: 700
                        }}>⊘ Suspend Pro</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REVENUE ── */}
          {activeTab === "revenue" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Revenue", value: "₦4.2M", sub: "All time", color: GOLD },
                  { label: "This Month", value: "₦890K", sub: "June 2025", color: GREEN },
                  { label: "Commission Earned", value: "₦210K", sub: "5% of bookings", color: BLUE },
                  { label: "Pending Payouts", value: "₦340K", sub: "To professionals", color: RED },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}44)`, borderRadius: 2, marginBottom: 14 }} />
                    <div style={{ fontSize: 11, color: MUTED, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 22 }}>
                <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Monthly Revenue Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { month: "January", amount: 280000, max: 900000 },
                    { month: "February", amount: 420000, max: 900000 },
                    { month: "March", amount: 380000, max: 900000 },
                    { month: "April", amount: 610000, max: 900000 },
                    { month: "May", amount: 750000, max: 900000 },
                    { month: "June", amount: 890000, max: 900000 },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 70, fontSize: 12, color: MUTED }}>{row.month}</div>
                      <div style={{ flex: 1, background: DARK3, borderRadius: 6, height: 10, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 6,
                          width: `${(row.amount / row.max) * 100}%`,
                          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                          transition: "width 0.5s"
                        }} />
                      </div>
                      <div style={{ width: 80, fontSize: 12, color: GOLD, fontWeight: 700, textAlign: "right" }}>
                        ₦{(row.amount / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { title: "Platform Commission Rate", desc: "Current rate charged per booking", value: "5%", editable: true },
                  { title: "Admin Email", desc: "Login email for admin panel", value: ADMIN_EMAIL, editable: true },
                  { title: "App Name", desc: "Display name across the platform", value: "STYLEX", editable: true },
                  { title: "Supported Cities", desc: "Cities where service is active", value: "Lagos, Abuja, Port Harcourt, Enugu", editable: true },
                  { title: "Payment Providers", desc: "Active payment gateways", value: "Paystack, Flutterwave", editable: false },
                  { title: "Verification Required", desc: "Require ID verification for professionals", value: "Enabled", editable: false },
                ].map((setting, i) => (
                  <div key={i} style={{
                    background: CARD, borderRadius: 14, padding: "18px 20px",
                    border: `1px solid ${BORDER}`, display: "flex",
                    justifyContent: "space-between", alignItems: "center", gap: 16
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 3 }}>{setting.title}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{setting.desc}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{setting.value}</span>
                      {setting.editable && (
                        <button onClick={() => showNotif("Settings saved successfully")} style={{
                          background: `${GOLD}15`, border: `1px solid ${GOLD}44`,
                          borderRadius: 8, color: GOLD, padding: "5px 12px",
                          cursor: "pointer", fontSize: 11, fontWeight: 600
                        }}>Edit</button>
                      )}
                    </div>
                  </div>
                ))}

                <button onClick={() => showNotif("All settings saved!")} style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#0A0A0B", border: "none", borderRadius: 12,
                  padding: "14px", fontWeight: 800, fontSize: 14,
                  cursor: "pointer", marginTop: 8
                }}>Save All Settings</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── ROOT ───
export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  return <AdminPanel onLogout={() => setLoggedIn(false)} />;
}
