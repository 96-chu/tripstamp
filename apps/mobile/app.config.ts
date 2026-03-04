import "dotenv/config";

export default {
  expo: {
    name: "TripStamp",
    slug: "tripstamp",
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
};