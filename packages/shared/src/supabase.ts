import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedKey: string | null = null;

export function createSupabaseClient(url: string, anonKey: string) {
  // Keep a single client instance per runtime to avoid duplicated auth listeners.
  const key = `${url}::${anonKey}`;

  if (cachedClient && cachedKey === key) return cachedClient;

  cachedClient = createClient(url, anonKey);
  cachedKey = key;

  return cachedClient;
}

// Optional: allow tests or special cases to reset the singleton.
export function resetSupabaseClientForTests() {
  cachedClient = null;
  cachedKey = null;
}