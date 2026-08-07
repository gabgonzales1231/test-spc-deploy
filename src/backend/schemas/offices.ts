//src/backend/schemas/offices.ts

import { z } from "zod";

export const sectorIdSchema = z.enum([
  "social",
  "economic",
  "infrastructure",
  "environment",
  "institutional",
  "legislative",
]);

export const officeSchema = z.object({
  id: z.string().uuid(),
  sector: sectorIdSchema,
  name: z.string(),
  slug: z.string(),
  head: z.string(),
  email: z.string(),
  address: z.string(),
  sort_order: z.number().int(),
  services: z.array(z.string()).default([]),
});

export const officesResponseSchema = z.array(officeSchema);

export type SectorId = z.infer<typeof sectorIdSchema>;
export type Office = z.infer<typeof officeSchema>;