// src/data/tourism/tourism.ts

export type TourismCategory = "festival" | "program";

export interface TourismHighlight {
  id: string;
  name: string;
  tagline: string;
  date?: string | null;
  href: string;
  image?: string | null;
  category: TourismCategory;
  sort_order?: number;
}

// Tourism highlight data lives in the `tourism` table in Supabase and is
// fetched through the backend via the `useTourismHighlights` hook
// (src/hooks/useTourism.ts). This file only keeps the shared type so
// existing imports of `TourismHighlight` elsewhere in the app keep working.