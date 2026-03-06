import { supabase } from "./supabase";

type CacheItem = {
  url: string;
  expiresAt: number;
};

const cache = new Map<string, CacheItem>();

function nowMs() {
  return Date.now();
}

function getBucket() {
  return (import.meta.env.VITE_SUPABASE_ASSETS_BUCKET as string) || "assets";
}

function getTtlSeconds() {
  const raw = import.meta.env.VITE_SUPABASE_SIGNED_URL_TTL;
  const ttl = Number(raw);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 600;
}

// Returns a signed URL for an object in a private bucket.
// Uses a simple in-memory cache to avoid repeated signing.
export async function getPrivateAssetUrl(path: string) {
  const bucket = getBucket();
  const ttlSec = getTtlSeconds();
  const cacheKey = `${bucket}:${path}`;
  const cached = cache.get(cacheKey);

  // Refresh slightly early to avoid edge expiration.
  const refreshBeforeMs = 15_000;

  if (cached && cached.expiresAt - refreshBeforeMs > nowMs()) {
    return cached.url;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, ttlSec);

  if (error || !data?.signedUrl) {
    throw error ?? new Error("Failed to create signed URL.");
  }

  cache.set(cacheKey, {
    url: data.signedUrl,
    expiresAt: nowMs() + ttlSec * 1000,
  });

  return data.signedUrl;
}