import { useState, useEffect, useRef } from "react";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C96A";
const DARK_BG = "#0A0A0B";
const CARD_BG = "#111113";
const CARD_BORDER = "#1E1E22";

const professionals = [
  { id: 1, name: "Adaeze Okonkwo", category: "Hairstylist", location: "Lagos", rating: 4.9, reviews: 128, price: 8500, followers: 12400, verified: true, avatar: "AO", color: "#7C3AED", services: ["Braids", "Weave", "Natural Styles"], bio: "Award-winning stylist with 8 years experience. Specializing in protective styles and natural hair care.", available: true, badge: "Top Creator" },
  { id: 2, name: "Chukwudi Eze", category: "Barber", location: "Abuja", rating: 4.8, reviews: 203, price: 3500, followers: 8900, verified: true, avatar: "CE", color: "#0891B2", services: ["Fade", "Line-up", "Beard Trim"], bio: "Master barber. Precision cuts and creative designs. Your look, perfected.", available: true, badge: "Rising Star" },
  { id: 3, name: "Fatima Al-Hassan", category: "Makeup Artist", location: "Abuja", rating: 5.0, reviews: 87, price: 15000, followers: 22100, verified: true, avatar: "FA", color: "#DB2777", services: ["Bridal", "Editorial", "Glam"], bio: "Luxury MUA. Bridal specialist. Transformations that make you feel like royalty.", available: false, badge: "Elite Pro" },
  { id: 4, name: "Blessing Nwosu", category: "Nail Technician", location: "Port Harcourt", rating: 4.7, reviews: 156, price: 6000, followers: 5600, verified: true, avatar: "BN", color: "#D97706", services: ["Gel Nails", "Nail Art", "Pedicure"], bio: "Nail artist creating miniature masterpieces. Bold, beautiful, long-lasting.", available: true, badge: null },
  { id: 5, name: "Amara Diallo", category: "Lash Technician", location: "Lagos", rating: 4.9, reviews: 94, price: 9500, followers: 7800, verified: true, avatar: "AD", color: "#059669", services: ["Classic Lashes", "Volume", "Mega Volume"], bio: "Certified lash artist. Eyes that speak before you do.", available: true, badge: "Trending" },
  { id: 6, name: "Kemi Adeyemi", category: "Skincare", location: "Lagos", rating: 4.6, reviews: 71, price: 12000, followers: 4200, verified: false, avatar: "KA", color: "#7C3AED", services: ["Facial", "Chemical Peel", "Dermaplaning"], bio: "Licensed esthetician. Glow from within. Science-backed skincare treatments.", available: true, badge: null },
];

const feedVideos = [
  { id: 1, pro: professionals[0], title: "Knotless Braids Transformation ✨", likes: 4821, comments: 312, caption: "From damaged to STUNNING in 4 hours! Book via my profile 💫", duration: "0:58" },
  { id: 2, pro: professionals[2], title: "Bridal Glam Tutorial", likes: 9102, comments: 541, caption: "Her wedding day look! She cried happy tears 🤍 #BridalMUA", duration: "1:12" },
  { id: 3, pro: professionals[1], title: "High Fade + Design 🔥", likes: 3299, comments: 189, caption: "This client trusted the process and WOW 🔥 #Barber", duration: "0:45" },
  { id: 4, pro: professionals[4], title: "Mega Volume Lashes 👁️", likes: 6720, comments: 402, caption: "Woke up like this? No. Had me do it 😂 Book now!", duration: "0:33" },
];

const categories = ["All", "Barbers", "Hairstylists", "Makeup", "Nails", "Lashes", "Skincare", "Tattoo"];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}
function formatNaira(n) {
  return "₦" + n.toLocaleString();
}

function Avatar({ initials, color, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", border: `1.5px solid ${color}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 700, color, fontFamily: "'Playfair Display', serif",
      flexShrink: 0
    }}>{initials}</div>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 0.8, padding: "3px 8px",
      borderRadius: 20, background: color + "22", color, border: `1px solid ${color}44`,
      textTransform: "uppercase"
    }}>{text}</span>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ color: GOLD, fontSize: 12, letterSpacing: 1 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "#888", fontSize: 11, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function ProCard({ pro, onClick }) {
  return (
    <div onClick={() => onClick(pro)} style={{
      background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
      borderRadius: 16, padding: 0, cursor: "pointer", overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
      position: "relative"
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = pro.color + "66"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ height: 80, background: `linear-gradient(135deg, ${pro.color}22, ${pro.color}08)`, position: "relative" }}>
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
          {pro.badge && <Badge text={pro.badge} color={GOLD} />}
          {pro.verified && <Badge text="✓ Pro" color={pro.color} />}
        </div>
        <div style={{
          position: "absolute", bottom: -28, left: 16,
          border: `3px solid ${CARD_BG}`, borderRadius: "50%"
        }}>
          <Avatar initials={pro.avatar} color={pro.color} size={56} />
        </div>
        <div style={{
          position: "absolute", bottom: 8, right: 12,
          width: 10, height: 10, borderRadius: "50%",
          background: pro.available ? "#22C55E" : "#EF4444",
          boxShadow: pro.available ? "0 0 8px #22C55E88" : "none"
        }} />
      </div>
      <div style={{ padding: "36px 16px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#F0EEE8", fontFamily: "'Playfair Display', serif" }}>{pro.name}</div>
        <div style={{ fontSize: 12, color: pro.color, marginTop: 2, fontWeight: 600 }}>{pro.category} · {pro.location}</div>
        <div style={{ marginTop: 6 }}><StarRating rating={pro.rating} /></div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{pro.reviews} reviews · {formatNum(pro.followers)} followers</div>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pro.services.slice(0, 2).map(s => (
            <span key={s} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "#1A1A1E", color: "#999", border: "1px solid #2A2A2E" }}>{s}</span>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 15 }}>{formatNaira(pro.price)}</span>
          <button style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: "#0A0A0B", border: "none", borderRadius: 20, padding: "6px 14px",
            fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5
          }}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

function FeedCard({ video, onBook }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [saved, setSaved] = useState(false);

  return (
    <div style={{
      background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
      borderRadius: 20, overflow: "hidden", marginBottom: 20
    }}>
      <div style={{
        height: 340, background: `linear-gradient(180deg, ${video.pro.color}18 0%, ${video.pro.color}33 50%, #0A0A0B 100%)`,
        position: "relative", display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>
            {video.pro.category === "Hairstylist" ? "💇‍♀️" : video.pro.category === "Makeup Artist" ? "💄" : video.pro.category === "Barber" ? "✂️" : "👁️"}
          </div>
          <div style={{ color: "#ffffff88", fontSize: 13 }}>{video.duration}</div>
        </div>
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials={video.pro.avatar} color={video.pro.color} size={36} />
            <div>
              <div style={{ color: "#F0EEE8", fontWeight: 600, fontSize: 13 }}>{video.pro.name}</div>
              <div style={{ color: video.pro.color, fontSize: 11 }}>{video.pro.category}</div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <span style={{ background: "#00000088", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11 }}>▶ REEL</span>
        </div>
        <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { icon: liked ? "❤️" : "🤍", label: formatNum(likes), action: () => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); } },
            { icon: "💬", label: formatNum(video.comments), action: () => {} },
            { icon: saved ? "🔖" : "📌", label: "Save", action: () => setSaved(!saved) },
            { icon: "↗️", label: "Share", action: () => {} },
          ].map(({ icon, label, action }) => (
            <button key={label} onClick={action} style={{
              background: "#00000066", border: "1px solid #ffffff22", borderRadius: 12,
              padding: "8px 10px", cursor: "pointer", textAlign: "center", backdropFilter: "blur(8px)"
            }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ color: "#fff", fontSize: 10, marginTop: 2 }}>{label}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ color: "#F0EEE8", fontWeight: 600, fontSize: 14 }}>{video.title}</div>
        <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{video.caption}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={() => onBook(video.pro)} style={{
            flex: 1, background: `linear-gradient(135deg, ${GOLD}DD, ${GOLD_LIGHT}DD)`,
            color: "#0A0A0B", border: "none", borderRadius: 24, padding: "10px 0",
            fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: 0.5
          }}>✦ Book {video.pro.name}</button>
          <button style={{
            background: "transparent", border: `1px solid ${video.pro.color}66`,
            color: video.pro.color, borderRadius: 24, padding: "10px 18px",
            fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>Follow</button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ pro, onClose, onBook }) {
  if (!pro) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000CC", zIndex: 1000,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0D0D0F", border: `1px solid ${CARD_BORDER}`,
        borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480,
        maxHeight: "88vh", overflowY: "auto", paddingBottom: 32
      }}>
        <div style={{ height: 120, background: `linear-gradient(135deg, ${pro.color}33, ${pro.color}11)`, position: "relative" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, background: "#00000066",
            border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%",
            cursor: "pointer", fontSize: 16
          }}>✕</button>
          <div style={{ position: "absolute", bottom: -32, left: 24, border: `4px solid #0D0D0F`, borderRadius: "50%" }}>
            <Avatar initials={pro.avatar} color={pro.color} size={64} />
          </div>
        </div>
        <div style={{ padding: "44px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EEE8" }}>{pro.name}</div>
              <div style={{ color: pro.color, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{pro.category} · {pro.location}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {pro.badge && <Badge text={pro.badge} color={GOLD} />}
              {pro.verified && <Badge text="✓ Verified" color={pro.color} />}
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
            {[
              { label: "Reviews", val: pro.reviews },
              { label: "Followers", val: formatNum(pro.followers) },
              { label: "Rating", val: pro.rating + "/5" },
            ].map(({ label, val }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#F0EEE8" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "#999", fontSize: 13, lineHeight: 1.7, marginTop: 16 }}>{pro.bio}</p>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Services</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {pro.services.map(s => (
                <span key={s} style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: pro.color + "18", color: pro.color, border: `1px solid ${pro.color}33`
                }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, padding: 16, background: CARD_BG, borderRadius: 16, border: `1px solid ${CARD_BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase" }}>Starting from</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: GOLD, marginTop: 2 }}>{formatNaira(pro.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: pro.available ? "#22C55E" : "#EF4444" }} />
                <span style={{ fontSize: 12, color: pro.available ? "#22C55E" : "#EF4444" }}>{pro.available ? "Available" : "Busy"}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => onBook(pro)} style={{
              flex: 1, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              color: "#0A0A0B", border: "none", borderRadius: 24, padding: "14px 0",
              fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 0.5
            }}>✦ Book Appointment</button>
            <button style={{
              width: 48, height: 48, background: "transparent",
              border: `1px solid ${CARD_BORDER}`, borderRadius: "50%",
              color: "#888", cursor: "pointer", fontSize: 18
            }}>💬</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ pro, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");
  if (!pro) return null;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const upcoming = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000CC", zIndex: 1100,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#0D0D0F", border: `1px solid ${CARD_BORDER}`,
        borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480,
        maxHeight: "90vh", overflowY: "auto", paddingBottom: 32
      }}>
        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#F0EEE8" }}>
              {step === 1 ? "Choose Service" : step === 2 ? "Pick Date & Time" : "Confirm Booking"}
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? GOLD : "#222" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "10px 12px", background: CARD_BG, borderRadius: 12 }}>
            <Avatar initials={pro.avatar} color={pro.color} size={36} />
            <div>
              <div style={{ color: "#F0EEE8", fontWeight: 600, fontSize: 13 }}>{pro.name}</div>
              <div style={{ color: pro.color, fontSize: 11 }}>{pro.category}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {step === 1 && (
            <div>
              <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Select a service</div>
              {pro.services.map(s => (
                <div key={s} onClick={() => setSelectedService(s)} style={{
                  padding: "14px 16px", borderRadius: 12, marginBottom: 8, cursor: "pointer",
                  background: selectedService === s ? pro.color + "22" : CARD_BG,
                  border: `1px solid ${selectedService === s ? pro.color + "66" : CARD_BORDER}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all 0.15s"
                }}>
                  <span style={{ color: "#F0EEE8", fontSize: 14 }}>{s}</span>
                  <span style={{ color: GOLD, fontSize: 14, fontWeight: 700 }}>{formatNaira(pro.price)}</span>
                </div>
              ))}
            </div>
          )}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Select date</div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                {upcoming.map((d, i) => (
                  <div key={i} onClick={() => setSelectedDate(d)} style={{
                    flexShrink: 0, width: 52, padding: "10px 8px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                    background: selectedDate === d ? GOLD : CARD_BG,
                    border: `1px solid ${selectedDate === d ? GOLD : CARD_BORDER}`,
                    transition: "all 0.15s"
                  }}>
                    <div style={{ fontSize: 10, color: selectedDate === d ? "#0A0A0B" : "#666", fontWeight: 600 }}>{days[d.getDay()]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: selectedDate === d ? "#0A0A0B" : "#F0EEE8", marginTop: 4 }}>{d.getDate()}</div>
                  </div>
                ))}
              </div>
              {selectedDate && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Select time</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {timeSlots.map(t => (
                      <div key={t} onClick={() => setSelectedTime(t)} style={{
                        padding: "8px 4px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                        background: selectedTime === t ? pro.color + "33" : CARD_BG,
                        border: `1px solid ${selectedTime === t ? pro.color + "88" : CARD_BORDER}`,
                        color: selectedTime === t ? pro.color : "#888", fontSize: 12, fontWeight: 600,
                        transition: "all 0.15s"
                      }}>{t}</div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Note (optional)</div>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Any special requests or information..."
                  style={{
                    width: "100%", background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                    borderRadius: 12, color: "#F0EEE8", padding: "10px 12px", fontSize: 13,
                    resize: "none", outline: "none", boxSizing: "border-box", height: 72, fontFamily: "inherit"
                  }} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div style={{ background: CARD_BG, borderRadius: 16, padding: 16, border: `1px solid ${CARD_BORDER}` }}>
                <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Booking Summary</div>
                {[
                  ["Service", selectedService],
                  ["Date", selectedDate?.toDateString()],
                  ["Time", selectedTime],
                  ["Professional", pro.name],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${CARD_BORDER}` }}>
                    <span style={{ color: "#666", fontSize: 13 }}>{label}</span>
                    <span style={{ color: "#F0EEE8", fontSize: 13, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
                  <span style={{ color: "#F0EEE8", fontSize: 15, fontWeight: 700 }}>Total</span>
                  <span style={{ color: GOLD, fontSize: 18, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{formatNaira(pro.price)}</span>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Payment Method</div>
                {["Paystack", "Flutterwave", "Bank Transfer"].map((method, i) => (
                  <div key={method} style={{
                    padding: "12px 16px", borderRadius: 12, marginBottom: 6,
                    background: i === 0 ? GOLD + "18" : CARD_BG,
                    border: `1px solid ${i === 0 ? GOLD + "66" : CARD_BORDER}`,
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer"
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? GOLD : "#444" }} />
                    <span style={{ color: i === 0 ? GOLD : "#888", fontSize: 13, fontWeight: 600 }}>{method}</span>
                    {i === 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: GOLD, fontWeight: 700 }}>RECOMMENDED</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "0 24px" }}>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 ? !selectedService : !selectedDate || !selectedTime} style={{
              width: "100%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              color: "#0A0A0B", border: "none", borderRadius: 24, padding: "14px 0",
              fontWeight: 800, fontSize: 15, cursor: "pointer", letterSpacing: 0.5,
              opacity: (step === 1 ? !selectedService : !selectedDate || !selectedTime) ? 0.4 : 1
            }}>Continue →</button>
          ) : (
            <button onClick={() => onConfirm(pro, selectedService, selectedDate, selectedTime)} style={{
              width: "100%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              color: "#0A0A0B", border: "none", borderRadius: 24, padding: "14px 0",
              fontWeight: 800, fontSize: 15, cursor: "pointer", letterSpacing: 0.5
            }}>✦ Confirm & Pay {formatNaira(pro.price)}</button>
          )}
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{
              width: "100%", background: "transparent", border: "none",
              color: "#666", cursor: "pointer", marginTop: 8, padding: "10px 0", fontSize: 13
            }}>← Back</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ booking, onClose }) {
  if (!booking) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000CC", zIndex: 1200,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)", padding: 24
    }}>
      <div style={{
        background: "#0D0D0F", border: `1px solid ${GOLD}44`,
        borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", textAlign: "center"
      }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✨</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: GOLD }}>Booking Confirmed!</div>
        <div style={{ color: "#888", fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
          Your appointment with <strong style={{ color: "#F0EEE8" }}>{booking.pro.name}</strong> is confirmed for{" "}
          <strong style={{ color: "#F0EEE8" }}>{booking.date?.toDateString()}</strong> at{" "}
          <strong style={{ color: "#F0EEE8" }}>{booking.time}</strong>.
        </div>
        <div style={{
          margin: "20px 0", padding: 16, background: CARD_BG, borderRadius: 16,
          border: `1px solid ${CARD_BORDER}`, fontSize: 12, color: "#666"
        }}>
          📱 A confirmation has been sent to your phone. Show this QR code at your appointment.
          <div style={{
            width: 80, height: 80, margin: "12px auto 0",
            background: `repeating-conic-gradient(#${Math.floor(Math.random() * 16777215).toString(16)} 0% 25%, #1A1A1E 0% 50%) 0 0/8px 8px`,
            borderRadius: 8
          }} />
        </div>
        <button onClick={onClose} style={{
          width: "100%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
          color: "#0A0A0B", border: "none", borderRadius: 24, padding: "14px 0",
          fontWeight: 800, fontSize: 15, cursor: "pointer"
        }}>Done</button>
      </div>
    </div>
  );
}

function AuthModal({ mode, onClose, onAuth }) {
  const [tab, setTab] = useState(mode);
  const [userType, setUserType] = useState("client");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000CC", zIndex: 1300,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)", padding: 24
    }}>
      <div style={{
        background: "#0D0D0F", border: `1px solid ${CARD_BORDER}`,
        borderRadius: 24, padding: 32, maxWidth: 380, width: "100%"
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: GOLD, letterSpacing: 2 }}>STYLEX</div>
          <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Beauty. Refined.</div>
        </div>
        <div style={{ display: "flex", gap: 0, background: CARD_BG, borderRadius: 24, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 0", borderRadius: 20, border: "none",
              background: tab === t ? GOLD : "transparent",
              color: tab === t ? "#0A0A0B" : "#666",
              fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
              textTransform: "capitalize"
            }}>{t === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>
        {tab === "signup" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["client", "professional"].map(t => (
                <div key={t} onClick={() => setUserType(t)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, cursor: "pointer", textAlign: "center",
                  background: userType === t ? GOLD + "22" : CARD_BG,
                  border: `1px solid ${userType === t ? GOLD + "88" : CARD_BORDER}`,
                  color: userType === t ? GOLD : "#666", fontSize: 12, fontWeight: 600,
                  textTransform: "capitalize", transition: "all 0.15s"
                }}>{t === "client" ? "👤 Client" : "✂️ Professional"}</div>
              ))}
            </div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
              style={{
                width: "100%", background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                borderRadius: 12, color: "#F0EEE8", padding: "12px 16px", fontSize: 14,
                marginBottom: 12, boxSizing: "border-box", outline: "none", fontFamily: "inherit"
              }} />
          </>
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
          style={{
            width: "100%", background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 12, color: "#F0EEE8", padding: "12px 16px", fontSize: 14,
            marginBottom: 12, boxSizing: "border-box", outline: "none", fontFamily: "inherit"
          }} />
        <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" type="password"
          style={{
            width: "100%", background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 12, color: "#F0EEE8", padding: "12px 16px", fontSize: 14,
            marginBottom: 20, boxSizing: "border-box", outline: "none", fontFamily: "inherit"
          }} />
        <button onClick={() => onAuth(tab, userType, name, email)} style={{
          width: "100%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
          color: "#0A0A0B", border: "none", borderRadius: 24, padding: "14px 0",
          fontWeight: 800, fontSize: 15, cursor: "pointer", letterSpacing: 0.5
        }}>{tab === "login" ? "Sign In" : "Create Account"}</button>
        <button onClick={onClose} style={{
          width: "100%", background: "transparent", border: "none",
          color: "#555", cursor: "pointer", marginTop: 12, padding: "8px 0", fontSize: 13
        }}>Maybe later</button>
      </div>
    </div>
  );
}

export default function StylexApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);
  const [bookingPro, setBookingPro] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuth = (mode, userType, name, email) => {
    const u = { name: name || email.split("@")[0], email, type: userType };
    setUser(u);
    setShowAuth(false);
    showNotif(`Welcome${mode === "signup" ? "" : " back"}, ${u.name}! 👋`);
  };

  const handleBook = (pro) => {
    if (!user) { setAuthMode("login"); setShowAuth(true); return; }
    setSelectedPro(null);
    setBookingPro(pro);
  };

  const handleConfirm = (pro, service, date, time) => {
    const b = { pro, service, date, time, id: Date.now() };
    setBookings(prev => [...prev, b]);
    setBookingPro(null);
    setConfirmedBooking(b);
  };

  const filtered = professionals.filter(p => {
    const matchCat = selectedCat === "All" || p.category.toLowerCase().includes(selectedCat.toLowerCase().replace(/s$/, ""));
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "explore", icon: "🔍", label: "Explore" },
    { id: "feed", icon: "▶", label: "Reels" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: DARK_BG, color: "#F0EEE8",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      maxWidth: 480, margin: "0 auto", position: "relative",
      paddingBottom: 80
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: DARK_BG + "EE", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${CARD_BORDER}`,
        padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: GOLD, letterSpacing: 3 }}>STYLEX</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar initials={user.name.slice(0, 2).toUpperCase()} color={GOLD} size={34} />
              <span style={{ fontSize: 13, color: "#888" }}>{user.name}</span>
            </div>
          ) : (
            <>
              <button onClick={() => { setAuthMode("login"); setShowAuth(true); }} style={{
                background: "transparent", border: `1px solid ${CARD_BORDER}`,
                color: "#888", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer"
              }}>Sign In</button>
              <button onClick={() => { setAuthMode("signup"); setShowAuth(true); }} style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color: "#0A0A0B", border: "none", borderRadius: 20, padding: "6px 14px",
                fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}>Join</button>
            </>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: GOLD, color: "#0A0A0B", padding: "10px 20px", borderRadius: 24,
          fontSize: 13, fontWeight: 700, zIndex: 2000, whiteSpace: "nowrap",
          boxShadow: `0 4px 24px ${GOLD}44`
        }}>{notification}</div>
      )}

      {/* Main Content */}
      <div style={{ padding: "0 16px" }}>

        {/* HOME */}
        {activeTab === "home" && (
          <div>
            <div style={{ padding: "20px 0 8px" }}>
              <div style={{ fontSize: 13, color: "#666" }}>Good day ✨</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#F0EEE8", marginTop: 2 }}>
                Find your perfect<br /><span style={{ color: GOLD }}>beauty expert</span>
              </div>
            </div>
            <div style={{ position: "relative", marginTop: 16 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search professionals, services..."
                style={{
                  width: "100%", background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 50, color: "#F0EEE8", padding: "12px 20px 12px 44px",
                  fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit"
                }} />
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            </div>

            {/* Categories */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 0 8px", scrollbarWidth: "none" }}>
              {categories.map(c => (
                <button key={c} onClick={() => setSelectedCat(c)} style={{
                  flexShrink: 0, padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: selectedCat === c ? GOLD : CARD_BG,
                  color: selectedCat === c ? "#0A0A0B" : "#888",
                  border: `1px solid ${selectedCat === c ? GOLD : CARD_BORDER}`,
                  transition: "all 0.15s"
                }}>{c}</button>
              ))}
            </div>

            {/* Featured Banner */}
            {selectedCat === "All" && !search && (
              <div style={{
                background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`,
                border: `1px solid ${GOLD}33`, borderRadius: 20, padding: 20, marginBottom: 20
              }}>
                <Badge text="✦ Featured Week" color={GOLD} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#F0EEE8", marginTop: 10 }}>
                  Top Bridal MUAs in Abuja
                </div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>3 verified artists available this week</div>
                <button onClick={() => setSelectedCat("Makeup")} style={{
                  marginTop: 12, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#0A0A0B", border: "none", borderRadius: 20, padding: "8px 20px",
                  fontWeight: 700, fontSize: 12, cursor: "pointer"
                }}>Explore →</button>
              </div>
            )}

            <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              {filtered.length} Professionals
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.map(p => <ProCard key={p.id} pro={p} onClick={setSelectedPro} />)}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#555" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                <div>No professionals found</div>
              </div>
            )}
          </div>
        )}

        {/* EXPLORE */}
        {activeTab === "explore" && (
          <div style={{ paddingTop: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F0EEE8", marginBottom: 16 }}>
              Explore <span style={{ color: GOLD }}>Trending</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Bridal Ready", sub: "14 MUAs", emoji: "💍", color: "#DB2777" },
                { label: "Fresh Fades", sub: "8 Barbers", emoji: "✂️", color: "#0891B2" },
                { label: "Nail Art", sub: "11 Artists", emoji: "💅", color: "#D97706" },
                { label: "Lash Queen", sub: "6 Techs", emoji: "👁️", color: "#059669" },
              ].map(({ label, sub, emoji, color }) => (
                <div key={label} onClick={() => { setActiveTab("home"); setSelectedCat(label.split(" ")[0]); }} style={{
                  background: color + "18", border: `1px solid ${color}33`, borderRadius: 16,
                  padding: 20, cursor: "pointer", transition: "transform 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
                  <div style={{ fontWeight: 700, color: "#F0EEE8", fontSize: 14 }}>{label}</div>
                  <div style={{ color, fontSize: 12, marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Top Rated This Week</div>
            {professionals.sort((a, b) => b.rating - a.rating).slice(0, 3).map((p, i) => (
              <div key={p.id} onClick={() => setSelectedPro(p)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 14,
                marginBottom: 8, cursor: "pointer"
              }}>
                <span style={{ fontSize: 16, color: i === 0 ? GOLD : i === 1 ? "#C0C0C0" : "#CD7F32", fontWeight: 800, minWidth: 20 }}>#{i + 1}</span>
                <Avatar initials={p.avatar} color={p.color} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#F0EEE8" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: p.color }}>{p.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StarRating rating={p.rating} />
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{formatNum(p.followers)} followers</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FEED */}
        {activeTab === "feed" && (
          <div style={{ paddingTop: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F0EEE8", marginBottom: 16 }}>
              Beauty <span style={{ color: GOLD }}>Reels</span>
            </div>
            {feedVideos.map(v => <FeedCard key={v.id} video={v} onBook={handleBook} />)}
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div style={{ paddingTop: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F0EEE8", marginBottom: 16 }}>
              My <span style={{ color: GOLD }}>Bookings</span>
            </div>
            {!user && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                <div style={{ color: "#888", marginBottom: 16 }}>Sign in to view your bookings</div>
                <button onClick={() => { setAuthMode("login"); setShowAuth(true); }} style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#0A0A0B", border: "none", borderRadius: 24, padding: "12px 28px",
                  fontWeight: 700, cursor: "pointer"
                }}>Sign In</button>
              </div>
            )}
            {user && bookings.length === 0 && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✂️</div>
                <div style={{ color: "#888", marginBottom: 16 }}>No bookings yet. Find a professional!</div>
                <button onClick={() => setActiveTab("home")} style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#0A0A0B", border: "none", borderRadius: 24, padding: "12px 28px",
                  fontWeight: 700, cursor: "pointer"
                }}>Explore Pros</button>
              </div>
            )}
            {user && bookings.map(b => (
              <div key={b.id} style={{
                background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                borderRadius: 16, padding: 16, marginBottom: 12
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar initials={b.pro.avatar} color={b.pro.color} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#F0EEE8" }}>{b.pro.name}</div>
                    <div style={{ color: b.pro.color, fontSize: 12 }}>{b.service}</div>
                    <div style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{b.date?.toDateString()} at {b.time}</div>
                  </div>
                  <div>
                    <span style={{ background: "#22C55E22", color: "#22C55E", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>Confirmed</span>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${CARD_BORDER}` }}>
                  <span style={{ color: GOLD, fontWeight: 700 }}>{formatNaira(b.pro.price)}</span>
                  <button style={{
                    background: "transparent", border: `1px solid #EF444444`, color: "#EF4444",
                    borderRadius: 20, padding: "5px 14px", fontSize: 11, cursor: "pointer"
                  }}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div style={{ paddingTop: 20 }}>
            {!user ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: GOLD, marginBottom: 8 }}>STYLEX</div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                <div style={{ color: "#888", marginBottom: 20 }}>Join STYLEX to connect with top beauty professionals</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => { setAuthMode("signup"); setShowAuth(true); }} style={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    color: "#0A0A0B", border: "none", borderRadius: 24, padding: "12px 24px",
                    fontWeight: 700, cursor: "pointer"
                  }}>Create Account</button>
                  <button onClick={() => { setAuthMode("login"); setShowAuth(true); }} style={{
                    background: "transparent", border: `1px solid ${CARD_BORDER}`,
                    color: "#888", borderRadius: 24, padding: "12px 24px", cursor: "pointer"
                  }}>Sign In</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
                  <Avatar initials={user.name.slice(0, 2).toUpperCase()} color={GOLD} size={72} />
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EEE8" }}>{user.name}</div>
                    <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>{user.email}</div>
                    <Badge text={user.type === "professional" ? "✂️ Professional" : "👤 Client"} color={GOLD} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                  {[
                    { label: "Bookings", val: bookings.length },
                    { label: "Following", val: 0 },
                    { label: "Saved", val: 0 },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 14, padding: 14, textAlign: "center" }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{val}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
                {[
                  { icon: "📅", label: "My Bookings", action: () => setActiveTab("bookings") },
                  { icon: "❤️", label: "Saved Professionals", action: () => {} },
                  { icon: "⭐", label: "My Reviews", action: () => {} },
                  { icon: "💳", label: "Payment Methods", action: () => {} },
                  { icon: "🔔", label: "Notifications", action: () => {} },
                  { icon: "⚙️", label: "Settings", action: () => {} },
                ].map(({ icon, label, action }) => (
                  <div key={label} onClick={action} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "16px 0",
                    borderBottom: `1px solid ${CARD_BORDER}`, cursor: "pointer"
                  }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{icon}</span>
                    <span style={{ flex: 1, color: "#D0CCC4", fontSize: 14 }}>{label}</span>
                    <span style={{ color: "#444", fontSize: 16 }}>›</span>
                  </div>
                ))}
                <button onClick={() => { setUser(null); showNotif("Signed out successfully"); }} style={{
                  width: "100%", background: "transparent", border: `1px solid #EF444444`,
                  color: "#EF4444", borderRadius: 24, padding: "12px 0", marginTop: 24,
                  fontWeight: 600, cursor: "pointer"
                }}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#0A0A0BEE",
        backdropFilter: "blur(20px)", borderTop: `1px solid ${CARD_BORDER}`,
        display: "flex", padding: "8px 0 12px", zIndex: 200
      }}>
        {navItems.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            flex: 1, background: "transparent", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              background: activeTab === id ? GOLD + "22" : "transparent",
              border: activeTab === id ? `1px solid ${GOLD}44` : "1px solid transparent",
              fontSize: id === "feed" ? 14 : 18, transition: "all 0.2s",
              color: activeTab === id ? GOLD : "#555"
            }}>{icon}</div>
            <span style={{ fontSize: 10, color: activeTab === id ? GOLD : "#555", fontWeight: activeTab === id ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Modals */}
      {selectedPro && <ProfileModal pro={selectedPro} onClose={() => setSelectedPro(null)} onBook={handleBook} />}
      {bookingPro && <BookingModal pro={bookingPro} onClose={() => setBookingPro(null)} onConfirm={handleConfirm} />}
      {confirmedBooking && <SuccessModal booking={confirmedBooking} onClose={() => setConfirmedBooking(null)} />}
      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
    </div>
  );
}
