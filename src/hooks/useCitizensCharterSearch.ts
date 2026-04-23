"use client";

import { useState, useEffect } from "react";
import { searchOffices } from "@/lib/citizens-charter/search";
import type { OfficeEntry } from "@/data/citizens-charter";

export function useCitizensCharterSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OfficeEntry[]>([]);

  useEffect(() => {
    setResults(searchOffices(query));
  }, [query]);

  const clearQuery = () => setQuery("");

  return { query, setQuery, results, clearQuery };
}