"use client";

import Link from "next/link";
import type { OfficeEntry } from "@/data/citizens-charter";

interface OfficeListProps {
  results: OfficeEntry[];
  query: string;
  onClear: () => void;
}

export default function OfficeList({ results, query, onClear }: OfficeListProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
        <p className="text-sm">No offices found{query ? ` for "${query}"` : ""}.</p>
        {query && (
          <button
            onClick={onClear}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition py-1 px-3 text-sm font-semibold text-gray-500"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {results.map((entry) => (
        <li
          key={entry.name}
          className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded-md p-3 shadow-sm"
        >
          <span className="font-medium text-gray-800 text-sm md:text-base">
            {entry.name.replace(".pdf", "")}
            <span className="ml-2 text-xs text-gray-500 font-normal">({entry.office})</span>
          </span>
          <div className="flex gap-3 mt-2 md:mt-0 shrink-0">
            
            <a  href={entry.link}
              download
              className="text-sm text-emerald-600 hover:underline"
            >
              Download
            </a>
            <Link
              href={`/arta/citizens-charter/view?file=${encodeURIComponent(entry.link)}`}
              className="text-sm text-blue-600 hover:underline"
            >
              View
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}