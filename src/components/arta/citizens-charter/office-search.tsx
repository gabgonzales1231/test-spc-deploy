"use client";

import { Search, X } from "lucide-react";

interface OfficeSearchProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function OfficeSearch({ query, onChange, onClear }: OfficeSearchProps) {
  return (
    <div className="relative flex items-center border border-gray-200 py-1.5 rounded-md px-3 mb-2 shadow-sm bg-white">
      <Search className="size-5 text-gray-400 shrink-0" />
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Office"
        className="w-full ps-2 pr-8 text-gray-800 font-medium placeholder:font-normal outline-none bg-transparent"
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute right-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}