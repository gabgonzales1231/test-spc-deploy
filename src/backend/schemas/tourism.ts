// src/backend/schemas/tourism.ts
import { t } from "elysia";

export const tourismHighlightSchema = t.Object({
  id: t.String(),
  name: t.String(),
  tagline: t.String(),
  date: t.Optional(t.Union([t.String(), t.Null()])),
  href: t.String(),
  image: t.Optional(t.Union([t.String(), t.Null()])),
  category: t.Union([t.Literal("festival"), t.Literal("program")]),
  sort_order: t.Optional(t.Number()),
});

export const tourismListResponse = t.Object({
  success: t.Boolean(),
  data: t.Array(tourismHighlightSchema),
});

export type TourismHighlight = typeof tourismHighlightSchema.static;