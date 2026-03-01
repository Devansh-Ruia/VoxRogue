import { createClient } from '@supabase/supabase-js';

let _client = null;

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  return _client;
}