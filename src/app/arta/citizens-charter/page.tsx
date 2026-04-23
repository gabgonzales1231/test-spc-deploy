"use client";

import Image from "next/image";
import CharterHeader from "@/components/arta/citizens-charter/charter-header";
import OfficeSearch from "@/components/arta/citizens-charter/office-search";
import OfficeList from "@/components/arta/citizens-charter/office-list";
import { useCitizensCharterSearch } from "@/hooks/useCitizensCharterSearch";

export default function CitizensCharterPage() {
  const { query, setQuery, results, clearQuery } = useCitizensCharterSearch();

  return (
    <section className="flex flex-col min-h-screen gap-4 p-4 max-w-4xl mx-auto pt-24">
      <CharterHeader />

      {/* Prompt card */}
      <div className="bg-gray-50 shadow-sm rounded-xl p-3 md:p-4 flex items-center gap-3">
        <Image
          src="/seal.webp"
          alt="San Pablo City Seal"
          width={56}
          height={56}
          className="drop-shadow-[0_0_0.1rem_#009A68] shrink-0"
        />
        <div>
          <h2 className="text-sm sm:text-base font-bold">
            Saang opisina mo gusto magtungo?
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            (Which office do you want to transact?)
          </p>
        </div>
      </div>

      {/* Search + List */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <OfficeSearch query={query} onChange={setQuery} onClear={clearQuery} />
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <OfficeList results={results} query={query} onClear={clearQuery} />
          </div>
        </div>
      </div>
    </section>
  );
}