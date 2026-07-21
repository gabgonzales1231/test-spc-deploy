// src/hooks/useMap.ts
"use client";

import { useEffect, useState } from "react";
import type { CityOffice } from "@/data/map/map";

const CACHE_KEY = "spc:map-offices:v1";
const CACHE_TIMESTAMP_KEY = "spc:map-offices:v1:updated-at";

interface UseMapOfficesResult {
  offices: CityOffice[];
  loading: boolean;
  error: string | null;
  /** true when the data shown came from the local cache, not a live fetch */
  isStale: boolean;
}

function readCache(): CityOffice[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CityOffice[];
  } catch {
    // Corrupted cache entry — ignore it rather than throwing.
    return null;
  }
}

function writeCache(offices: CityOffice[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(offices));
    window.localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
  } catch {
    // Storage full or unavailable (e.g. private browsing) — non-fatal,
    // the user just won't get an offline fallback next time.
  }
}

/**
 * Fetches city office locations for the Explore map from the backend
 * (which reads the `map` table in Supabase).
 *
 * If the request fails — e.g. Supabase is down — this falls back to the
 * last successful response cached in localStorage, so the map still shows
 * something instead of going empty. `isStale` tells the UI when that's
 * happening so it can show a small "showing saved data" notice if desired.
 */
export function useMapOffices(): UseMapOfficesResult {
  const [offices, setOffices] = useState<CityOffice[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/map", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);

        const json = await res.json();
        const data: CityOffice[] = json?.data ?? [];

        if (cancelled) return;

        setOffices(data);
        setIsStale(false);
        writeCache(data);
      } catch (err) {
        if (cancelled) return;

        const cached = readCache();
        if (cached && cached.length > 0) {
          setOffices(cached);
          setIsStale(true);
          setError(null);
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to load office locations"
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

  return { offices, loading, error, isStale };
}