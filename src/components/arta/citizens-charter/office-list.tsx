//src/components/arta/citizens-charter/office-list.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OfficeEntry } from "@/data/citizens-charter";

interface OfficeListProps {
  results: OfficeEntry[];
  query: string;
  onClear: () => void;
}

export default function OfficeList({ results, query, onClear }: OfficeListProps) {
  const router = useRouter();

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
          role="button"
          tabIndex={0}
          onClick={() => {
            sessionStorage.setItem("cc_skip_intro", "1");
            router.push(
              `/arta/citizens-charter/view?file=${encodeURIComponent(entry.link)}`
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              sessionStorage.setItem("cc_skip_intro", "1");
              router.push(
                `/arta/citizens-charter/view?file=${encodeURIComponent(entry.link)}`
              );
            }
          }}
          className="group flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded-md p-3 shadow-sm cursor-pointer transition-all duration-200 ease-out hover:bg-white hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-emerald-200 active:scale-[0.99]"
        >
          <span className="font-medium text-gray-800 transition-colors group-hover:text-emerald-700">
            {entry.name} - {entry.office}
          </span>
          <div className="flex gap-3 mt-2 md:mt-0 shrink-0">
            <a
              href={entry.link}
              download
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-emerald-600 hover:underline"
            >
              Download
            </a>
            <Link
              href={`/arta/citizens-charter/view?file=${encodeURIComponent(entry.link)}`}
              onClick={(e) => {
                e.stopPropagation();
                sessionStorage.setItem("cc_skip_intro", "1");
              }}
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