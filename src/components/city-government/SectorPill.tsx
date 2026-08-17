//src/components/city-government/SectorPill.tsx

"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectorGroup } from "@/components/city-government/types";
// SectorGroup.icon is React.ElementType, consistent with the rest of types.ts

interface SectorPillProps {
  sector: SectorGroup;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SectorPill({ sector, isOpen, onToggle }: SectorPillProps) {
  const Icon = sector.icon;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`group flex items-center gap-4 rounded-2xl px-6 py-5 text-left transition-all duration-200 ${
          isOpen
            ? "bg-emerald-700 shadow-lg shadow-emerald-700/20"
            : "bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md"
        }`}
      >
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-colors ${
            isOpen ? "bg-white/15" : "bg-emerald-50 group-hover:bg-emerald-100"
          }`}
        >
          <Icon className={`w-6 h-6 ${isOpen ? "text-white" : "text-emerald-700"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-lg font-semibold ${isOpen ? "text-white" : "text-gray-900"}`}>
            {sector.label}
          </p>
          <p className={`text-sm ${isOpen ? "text-emerald-100" : "text-gray-500"}`}>
            {sector.offices.length} offices
          </p>
        </div>

        <div
          className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 transition-colors ${
            isOpen ? "bg-white/15" : "bg-gray-50 group-hover:bg-emerald-50"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-emerald-700" />
          )}
        </div>
      </button>

      {isOpen && (
        <>
          {/* Mobile: stacked compact cards, no labels */}
          <div className="flex min-[930px]:hidden mx-1 mb-2 flex-col gap-2">
            {sector.offices.map((office) => (
              <div
                key={office.name}
                className="border border-gray-200 px-4 py-3.5 shadow-sm flex flex-col gap-1"
              >
                <p className="text-gray-900 font-medium">{office.name || "N/A"}</p>
                <p className="text-gray-600 text-sm">{office.head || "N/A"}</p>
                <p className="text-emerald-700 text-sm">{office.email || "N/A"}</p>
                <p className="text-gray-600 text-sm">{office.contactNo || "N/A"}</p>
                <p className="text-gray-600 text-sm">{office.address || "N/A"}</p>
              </div>
            ))}
          </div>

          {/* Desktop/tablet: table layout */}
          <div className="hidden min-[930px]:block mx-1 mb-2 border border-gray-200 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 border-b border-gray-200 w-[24%]">
                    Office
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 border-b border-gray-200 w-[18%]">
                    Head
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 border-b border-gray-200 w-[30%]">
                    Contact Details
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 border-b border-gray-200 w-[28%]">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {sector.offices.map((office, i) => (
                  <tr
                    key={office.name}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      i !== sector.offices.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 text-gray-900 font-medium">{office.name || "N/A"}</td>
                    <td className="px-5 py-3.5 text-gray-600">{office.head || "N/A"}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-emerald-700">{office.email || "N/A"}</span>
                        <span className="text-gray-600">{office.contactNo || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{office.address || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}