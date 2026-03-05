import { getPrivateAssetUrl } from "@/lib/storageAssets";

export type TextureUrls = {
  earthDayUrl: string;
  earthCloudsUrl: string;
};

// Fetch signed URLs for textures stored in a private Supabase bucket.
export async function getTextureUrls(): Promise<TextureUrls> {
  const [earthDayUrl, earthCloudsUrl] = await Promise.all([
    getPrivateAssetUrl("textures/8k_earth_daymap.jpg"),
    getPrivateAssetUrl("textures/8k_earth_clouds.jpg"),
  ]);

  return {
    earthDayUrl,
    earthCloudsUrl,
  };
}