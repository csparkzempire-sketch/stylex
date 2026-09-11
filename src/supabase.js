import { createClient } from '@supabase/supabase-js'

// The anon key is public by design — it ships inside this bundle, so treat it
// as known to everyone. It is safe here ONLY because row level security
// decides what it can actually read and write; RLS is the real protection,
// not the secrecy of this string.
//
// Read from the environment first so the key can be rotated in Vercel without
// a code change. The literal stays as a fallback so an unconfigured build
// still runs — it is already published, so keeping it is not a new exposure.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || 'https://utvrujgqzheifblizarw.supabase.co'

const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc'

export const supabase = createClient(supabaseUrl, supabaseKey)
