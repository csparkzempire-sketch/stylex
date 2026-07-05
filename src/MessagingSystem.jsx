import { useState, useEffect, useRef } from "react";
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

function Avatar({ initials, size = 40, color = GOLD, img = null }) {
  if (img) return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${color}55`, flexShrink: 0 }}>
      <img src={img} alt={initials} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color, flexShrink: 0 }}>{initials}</div>
  );
}

// ─── CONVERSATIONS LIST ───
function ConversationsList({ user, onOpen, onNewChat }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConvos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });
    setConvos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadConvos();
    // Real-time updates
    const channel = supabase.channel("convos")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, loadConvos)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user.id]);

  const getOtherPerson = (convo) => {
    const isP1 = convo.participant1_id === user.id;
    return {
      name: isP1 ? convo.participant2_name : convo.participant1_name,
      avatar: isP1 ? convo.participant2_avatar : convo.participant1_avatar,
      unread: isP1 ? convo.unread_1 : convo.unread_2,
    };
  };

  const totalUnread = convos.reduce((s, c) => {
    const isP1 = c.participant1_id === user.id;
    return s + (isP1 ? c.unread_1 : c.unread_2);
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: DARK, paddingBottom: 100, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${DARK}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 20, margin: 0 }}>Messages</h2>
          {totalUnread > 0 && <div style={{ fontSize: 12, color: GOLD, marginTop: 2 }}>{totalUnread} unread</div>}
        </div>
        <button onClick={onNewChat} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 10, color: "#0A0A0B", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✏️ New</button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: MUTED }}>Loading messages...</div>
      ) : convos.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
          <h3 style={{ color: TEXT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No messages yet</h3>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>Start a conversation with a beauty professional or client</p>
          <button onClick={onNewChat} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 12, color: "#0A0A0B", padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Start a Conversation</button>
        </div>
      ) : (
        <div style={{ padding: "12px 0" }}>
          {convos.map(convo => {
            const other = getOtherPerson(convo);
            const initials = (other.name || "U").slice(0, 2).toUpperCase();
            const hasUnread = other.unread > 0;
            return (
              <button key={convo.id} onClick={() => onOpen(convo)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, textAlign: "left", borderBottom: `1px solid ${BORDER}22` }}>
                <div style={{ position: "relative" }}>
                  <Avatar initials={initials} size={50} color={GOLD} img={other.avatar || null} />
                  {hasUnread && <div style={{ position: "absolute", top: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: RED, border: `2px solid ${DARK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>{other.unread}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: hasUnread ? 800 : 600, fontSize: 14, color: TEXT }}>{other.name}</span>
                    <span style={{ fontSize: 11, color: MUTED }}>{convo.last_message_at ? new Date(convo.last_message_at).toLocaleDateString("en", { month: "short", day: "numeric" }) : ""}</span>
                  </div>
                  <div style={{ fontSize: 13, color: hasUnread ? TEXT : MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: hasUnread ? 600 : 400 }}>{convo.last_message || "Start a conversation"}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── NEW CHAT MODAL ───
function NewChatModal({ user, onClose, onStart }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase.from("profiles").select("id, full_name, avatar_url, user_type, category, username")
        .neq("id", user.id)
        .or(`full_name.ilike.%${search}%,username.ilike.%${search}%`)
        .limit(10);
      setResults(data || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "flex-end", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: DARK2, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", border: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ color: TEXT, fontWeight: 800, fontSize: 18, margin: 0 }}>New Message</h3>
          <button onClick={onClose} style={{ background: `${GOLD}11`, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          autoFocus
          style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 16px", color: TEXT, fontSize: 14, outline: "none", marginBottom: 16 }}
        />
        <div style={{ overflowY: "auto", flex: 1 }}>
          {searching && <div style={{ textAlign: "center", padding: 20, color: MUTED }}>Searching...</div>}
          {!searching && search && results.length === 0 && <div style={{ textAlign: "center", padding: 20, color: MUTED }}>No users found</div>}
          {results.map(u => (
            <button key={u.id} onClick={() => onStart(u)} style={{ width: "100%", background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 14, cursor: "pointer", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left", marginBottom: 10 }}>
              <Avatar initials={(u.full_name || "U").slice(0, 2).toUpperCase()} size={44} color={GOLD} img={u.avatar_url || null} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{u.full_name}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{u.user_type === "professional" ? `✂️ ${u.category || "Professional"}` : "👤 Client"}{u.username ? ` · @${u.username}` : ""}</div>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 8, color: "#0A0A0B", padding: "6px 14px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Message</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT SCREEN ───
function ChatScreen({ user, conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const isP1 = conversation.participant1_id === user.id;
  const other = {
    id: isP1 ? conversation.participant2_id : conversation.participant1_id,
    name: isP1 ? conversation.participant2_name : conversation.participant1_name,
    avatar: isP1 ? conversation.participant2_avatar : conversation.participant1_avatar,
  };

  const loadMessages = async () => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", conversation.id).order("created_at", { ascending: true });
    setMessages(data || []);
    // Mark as read
    await supabase.from("conversations").update(isP1 ? { unread_1: 0 } : { unread_2: 0 }).eq("id", conversation.id);
  };

  useEffect(() => {
    loadMessages();
    const channel = supabase.channel(`chat-${conversation.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversation.id}` }, (payload) => {
        setMessages(ms => [...ms, payload.new]);
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (type = "text", content = null, mediaUrl = null, duration = null) => {
    const msgContent = content || text.trim();
    if (!msgContent && !mediaUrl) return;
    setSending(true);
    setText("");
    setMediaFile(null);
    setMediaPreview(null);

    const msg = {
      conversation_id: conversation.id,
      sender_id: user.id,
      sender_name: user.name,
      type,
      content: msgContent,
      media_url: mediaUrl,
      duration,
    };

    await supabase.from("messages").insert(msg);

    // Update conversation last message
    const lastMsg = type === "text" ? msgContent : type === "image" ? "📷 Photo" : type === "voice" ? "🎤 Voice note" : msgContent;
    const unreadUpdate = isP1 ? { unread_2: (conversation.unread_2 || 0) + 1 } : { unread_1: (conversation.unread_1 || 0) + 1 };
    await supabase.from("conversations").update({ last_message: lastMsg, last_message_at: new Date().toISOString(), ...unreadUpdate }).eq("id", conversation.id);

    // Send push notification to other person
    fetch("/api/push-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: other.id,
        title: `💬 ${user.name}`,
        body: lastMsg,
        url: "https://stylex.pro",
      }),
    }).catch(() => {});

    setSending(false);
  };

  const handlePhoto = async (e) => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    if (f.size > 5 * 1024 * 1024) { alert("Image too large. Max 5MB."); return; }
    setMediaFile(f);
    setMediaPreview(URL.createObjectURL(f));
  };

  const sendPhoto = async () => {
    if (!mediaFile) return;
    setSending(true);
    const ext = mediaFile.name.split(".").pop();
    const path = `messages/${conversation.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("posts").upload(path, mediaFile);
    if (error) { setSending(false); alert("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("posts").getPublicUrl(path);
    await sendMessage("image", "📷 Photo", urlData.publicUrl);
    setSending(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const dur = recordingTime;
        setRecordingTime(0);
        clearInterval(timerRef.current);
        setSending(true);
        const path = `messages/${conversation.id}/voice_${Date.now()}.webm`;
        await supabase.storage.from("posts").upload(path, blob);
        const { data: urlData } = supabase.storage.from("posts").getPublicUrl(path);
        await sendMessage("voice", `🎤 Voice note (${dur}s)`, urlData.publicUrl, dur);
        setSending(false);
      };
      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch { alert("Could not access microphone"); }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (d) => {
    const date = new Date(d);
    return date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
  };

  const isMine = (msg) => msg.sender_id === user.id;

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", flexDirection: "column", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${DARK}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>←</button>
        <Avatar initials={(other.name || "U").slice(0, 2).toUpperCase()} size={38} color={GOLD} img={other.avatar || null} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{other.name}</div>
          <div style={{ fontSize: 11, color: GREEN }}>● Active on STYLEX</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 140 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👋</div>
            <p style={{ color: MUTED, fontSize: 13 }}>Say hello to {other.name}!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const mine = isMine(msg);
          const showDate = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
          return (
            <div key={msg.id}>
              {showDate && (
                <div style={{ textAlign: "center", fontSize: 11, color: MUTED, margin: "10px 0" }}>
                  {new Date(msg.created_at).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {!mine && <Avatar initials={(other.name || "U").slice(0, 2).toUpperCase()} size={28} color={GOLD} img={other.avatar || null} />}
                <div style={{ maxWidth: "72%", background: mine ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : CARD, borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: msg.type === "image" ? 4 : "10px 14px", border: mine ? "none" : `1px solid ${BORDER}` }}>
                  {msg.type === "text" && <div style={{ fontSize: 14, color: mine ? "#0A0A0B" : TEXT, lineHeight: 1.5 }}>{msg.content}</div>}
                  {msg.type === "image" && (
                    <div>
                      <img src={msg.media_url} alt="photo" style={{ width: "100%", maxWidth: 240, borderRadius: 14, display: "block" }} />
                      {msg.content && msg.content !== "📷 Photo" && <div style={{ fontSize: 13, color: mine ? "#0A0A0B" : TEXT, padding: "6px 8px 2px" }}>{msg.content}</div>}
                    </div>
                  )}
                  {msg.type === "voice" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
                      <span style={{ fontSize: 20 }}>🎤</span>
                      <audio src={msg.media_url} controls style={{ height: 32, maxWidth: 180 }} />
                      {msg.duration && <span style={{ fontSize: 11, color: mine ? "#0A0A0B99" : MUTED }}>{msg.duration}s</span>}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: mine ? "#0A0A0B88" : MUTED, marginTop: 4, textAlign: "right" }}>{formatTime(msg.created_at)}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Photo preview */}
      {mediaPreview && (
        <div style={{ position: "fixed", bottom: 80, left: 0, right: 0, background: DARK2, border: `1px solid ${BORDER}`, padding: 14, display: "flex", alignItems: "center", gap: 12, zIndex: 50 }}>
          <img src={mediaPreview} alt="preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>Photo ready to send</div>
            <div style={{ fontSize: 11, color: MUTED }}>Tap send to share</div>
          </div>
          <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} style={{ background: `${RED}22`, border: "none", borderRadius: 8, color: RED, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Remove</button>
          <button onClick={sendPhoto} disabled={sending} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 8, color: "#0A0A0B", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>{sending ? "..." : "Send"}</button>
        </div>
      )}

      {/* Input bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: `${DARK2}f5`, backdropFilter: "blur(16px)", borderTop: `1px solid ${BORDER}`, padding: "10px 16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />

        {recording ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: `${RED}15`, border: `1px solid ${RED}33`, borderRadius: 24, padding: "10px 16px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, animation: "pulse 1s infinite" }} />
            <span style={{ color: RED, fontSize: 13, fontWeight: 600 }}>Recording... {recordingTime}s</span>
            <button onClick={stopRecording} style={{ marginLeft: "auto", background: RED, border: "none", borderRadius: 8, color: "#fff", padding: "4px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Stop ⏹</button>
          </div>
        ) : (
          <>
            <button onClick={() => fileInputRef.current?.click()} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📷</button>
            <button onClick={startRecording} style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎤</button>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={`Message ${other.name}...`}
              style={{ flex: 1, background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "11px 16px", color: TEXT, fontSize: 14, outline: "none" }}
            />
            <button onClick={() => sendMessage()} disabled={sending || !text.trim()} style={{ background: text.trim() ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : DARK3, border: "none", borderRadius: "50%", width: 40, height: 40, cursor: text.trim() ? "pointer" : "default", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>→</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MESSAGING SCREEN (main entry) ───
export function MessagingScreen({ user, initialConversation = null, onLogin }) {
  const [view, setView] = useState(initialConversation ? "chat" : "list");
  const [activeConvo, setActiveConvo] = useState(initialConversation);
  const [showNewChat, setShowNewChat] = useState(false);

  if (!user) return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
        <h2 style={{ color: "#F0EDE8", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Sign in to message</h2>
        <p style={{ color: "#888898", fontSize: 13, marginBottom: 24 }}>Chat with beauty professionals and clients</p>
        <button onClick={onLogin} style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, border: "none", borderRadius: 12, color: "#0A0A0B", padding: "13px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign In / Sign Up</button>
      </div>
    </div>
  );

  const handleStartChat = async (otherUser) => {
    setShowNewChat(false);
    // Check if conversation already exists - try both orderings
    const { data: existing1 } = await supabase.from("conversations")
      .select("*")
      .eq("participant1_id", user.id)
      .eq("participant2_id", otherUser.id)
      .maybeSingle();

    const { data: existing2 } = !existing1 ? await supabase.from("conversations")
      .select("*")
      .eq("participant1_id", otherUser.id)
      .eq("participant2_id", user.id)
      .maybeSingle() : { data: null };

    const existing = existing1 || existing2;
    if (existing) { setActiveConvo(existing); setView("chat"); return; }

    // Create new conversation
    const { data: newConvo, error } = await supabase.from("conversations").insert({
      participant1_id: user.id,
      participant1_name: user.name,
      participant1_avatar: null,
      participant2_id: otherUser.id,
      participant2_name: otherUser.full_name,
      participant2_avatar: otherUser.avatar_url || null,
      last_message: "",
    }).select().maybeSingle();

    if (error) { console.error("Convo create error:", error); alert("Could not start conversation. Please try again."); return; }
    if (newConvo) { setActiveConvo(newConvo); setView("chat"); }
  };

  if (view === "chat" && activeConvo) {
    return <ChatScreen user={user} conversation={activeConvo} onBack={() => setView("list")} />;
  }

  return (
    <div>
      <ConversationsList user={user} onOpen={(convo) => { setActiveConvo(convo); setView("chat"); }} onNewChat={() => setShowNewChat(true)} />
      {showNewChat && <NewChatModal user={user} onClose={() => setShowNewChat(false)} onStart={handleStartChat} />}
    </div>
  );
}

// ─── MESSAGE BUTTON (for pro profiles) ───
export function MessageButton({ user, targetUser, onLogin, style = {} }) {
  const [loading, setLoading] = useState(false);
  const [convo, setConvo] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleMessage = async () => {
    if (!user) { onLogin(); return; }
    setLoading(true);
    const { data: existing1 } = await supabase.from("conversations")
      .select("*").eq("participant1_id", user.id).eq("participant2_id", targetUser.id).maybeSingle();
    const { data: existing2 } = !existing1 ? await supabase.from("conversations")
      .select("*").eq("participant1_id", targetUser.id).eq("participant2_id", user.id).maybeSingle() : { data: null };
    const existing = existing1 || existing2;

    if (existing) { setConvo(existing); setLoading(false); setShowChat(true); return; }

    const { data: newConvo } = await supabase.from("conversations").insert({
      participant1_id: user.id,
      participant1_name: user.name,
      participant1_avatar: null,
      participant2_id: targetUser.id,
      participant2_name: targetUser.name,
      participant2_avatar: targetUser.avatarUrl || null,
      last_message: "",
    }).select().maybeSingle();

    setConvo(newConvo);
    setLoading(false);
    setShowChat(true);
  };

  if (showChat && convo) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
        <ChatScreen user={user} conversation={convo} onBack={() => setShowChat(false)} />
      </div>
    );
  }

  return (
    <button onClick={handleMessage} disabled={loading} style={{ background: "transparent", border: `1.5px solid ${GOLD}`, borderRadius: 10, color: GOLD, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", ...style }}>
      {loading ? "..." : "💬 Message"}
    </button>
  );
}

export default MessagingScreen;