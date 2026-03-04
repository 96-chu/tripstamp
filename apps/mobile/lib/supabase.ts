import Constants from "expo-constants";
import { createSupabaseClient } from "@tripstamp/shared";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

if (!extra.SUPABASE_URL || !extra.SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase config. Check EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY and app.config.ts"
  );
}

export const supabase = createSupabaseClient(
  extra.SUPABASE_URL,
  extra.SUPABASE_ANON_KEY
);