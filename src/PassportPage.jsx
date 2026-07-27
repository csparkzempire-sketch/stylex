import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import BeautyPassport from "./BeautyPassport";

export default function PassportPage() {
  const [userId, setUserId] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
      setChecked(true);
    });
  }, []);

  if (!checked) return <div style={{ padding: 40, color: "#888" }}>Loading…</div>;
  if (!userId) return <div style={{ padding: 40, color: "#888" }}>Sign in to view your Beauty Passport.</div>;
  return <BeautyPassport userId={userId} />;
}
