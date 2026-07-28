// src/backend/schemas/service-standard.ts

import { z } from "zod";

export const ServiceStandardSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  order_index: z.number().int(),
  file_path: z.string().nullable(),  // storage-relative path in 'media' bucket
  image_url: z.string().url().nullable(), // resolved public URL, computed server-side
  timestamp: z.string(),
});

export type ServiceStandard = z.infer<typeof ServiceStandardSchema>;

export const ServiceStandardListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(ServiceStandardSchema),
});