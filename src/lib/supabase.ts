import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required for the demo request form.',
    );
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
