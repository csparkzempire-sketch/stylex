import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://utvrujgqzheifblizarw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnJ1amdxemhlaWZibGl6YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQ0ODEsImV4cCI6MjA5NzE4MDQ4MX0.nQNZD7ymLv1ikHzklgxeVrXFRDJMA0f46QNAsU-CWBc'

export const supabase = createClient(supabaseUrl, supabaseKey)