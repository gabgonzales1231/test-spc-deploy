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

export const contactInfoSchema = z.object({
  email: z.string().nullable().optional(),
  contact_no: z.string().nullable().optional(),
  social_url: z.string().nullable().optional(),
});

export const officeSchema = z.object({
  id: z.string().uuid(),
  sector: sectorIdSchema,
  name: z.string(),
  slug: z.string(),
  head: z.string(),
  contact_info: contactInfoSchema.nullable(),
  address: z.string(),
  sort_order: z.number().int(),
  services: z.array(z.string()).default([]),
  office_no: z.number().int().nullable(),
});

export const officesResponseSchema = z.array(officeSchema);

export type SectorId = z.infer<typeof sectorIdSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type Office = z.infer<typeof officeSchema>;