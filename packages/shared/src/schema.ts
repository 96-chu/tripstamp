import { z } from "zod";

export const DestinationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  country: z.string().optional(),
  city: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover_photo_url: z.string().url().optional()
});

export const CheckinSchema = z.object({
  id: z.string().uuid().optional(),
  destination_id: z.string(),
  visited_at: z.string(), // ISO
  note: z.string().max(2000).optional(),
  photo_urls: z.array(z.string().url()).default([]),
  lat: z.number().optional(),
  lng: z.number().optional()
});

export type Destination = z.infer<typeof DestinationSchema>;
export type Checkin = z.infer<typeof CheckinSchema>;