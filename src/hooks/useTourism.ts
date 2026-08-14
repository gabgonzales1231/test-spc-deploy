// src/hooks/useTourism.ts
"use client";

import { useEffect, useState } from "react";
import type { TourismHighlight } from "@/data/tourism/tourism";

const CACHE_KEY = "spc:tourism-highlights:v1";

interface UseTourismHighlightsResult {
  highlights: TourismHighlight[];
  loading: boolean;
  error: string | null;
  /** true when the data shown came from the local cache, not a live fetch */
  isStale: boolean;
}

function readCache(): TourismHighlight[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TourismHighlight[];
  } catch {
    return null;
  }
}

function writeCache(highlights: TourismHighlight[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(highlights));
  } catch {
    // Storage full or unavailable — non-fatal.
  }
}

/**
 * Fetches tourism highlight cards (festivals, programs) for the Explore
 * page's Tourism section from the backend (which reads the `tourism`
 * table in Supabase). Falls back to the last successful response cached
 * in localStorage if the request fails, same pattern as `useMapOffices`.
 */
export function useTourismHighlights(): UseTourismHighlightsResult {
  // Start empty on both server and client so the first client render
  // matches the server-rendered HTML exactly — reading localStorage
  // synchronously in the initializer (as before) caused a hydration
  // mismatch whenever a cached value existed, since the server has no
  // localStorage and always renders the empty/loading state.
  const [highlights, setHighlights] = useState<TourismHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Load any cached value after mount (client-only), before the network
  // request resolves — this still avoids an empty flash on repeat visits,
  // it just happens post-hydration instead of during the initial render.
  useEffect(() => {
    const cached = readCache();
    if (cached && cached.length > 0) {
      setHighlights(cached);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/tourism", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);

        const json = await res.json();
        const data: TourismHighlight[] = json?.data ?? [];

        if (cancelled) return;

        setHighlights(data);
        setIsStale(false);
        writeCache(data);
      } catch (err) {
        if (cancelled) return;

        const cached = readCache();
        if (cached && cached.length > 0) {
          setHighlights(cached);
          setIsStale(true);
          setError(null);
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to load tourism highlights"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { highlights, loading, error, isStale };
}