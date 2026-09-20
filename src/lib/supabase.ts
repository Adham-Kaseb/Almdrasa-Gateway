import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://oprlnjydxcpdjyligtxq.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcmxuanlkeGNwZGp5bGlndHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MDgxNDUsImV4cCI6MjEwNTQ4NDE0NX0.Vh-Qd9w7Q9WZR69JGwBk-LrMEkW6p35SSupLhywrg90';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'almdrasa_gateway_auth_token',
  },
});
