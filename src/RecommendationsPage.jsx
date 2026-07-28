import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import SmartRecommendations from "./SmartRecommendations";

export default function RecommendationsPage() {
  const [userId, setUserId] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
      setChecked(true);
    });
  }, []);

  if (!checked) return <div style={{ padding: 40, color: "#888" }}>Loading…</div>;
  if (!userId) return <div style={{ padding: 40, color: "#888" }}>Sign in to see your matches.</div>;
  return <SmartRecommendations userId={userId} />;
}
