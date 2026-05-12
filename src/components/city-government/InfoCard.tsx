"use client";

import React, { useState } from "react";
import { User, Phone } from "lucide-react";
import { Department } from "@/components/city-government/types";

export default function InfoCard({ dept }: { dept: Department }) {
  const [hovered, setHovered] = useState(false);

  const Icon = dept.icon;

  const textColorMap: Record<string, string> = {
    emerald: "text-emerald-600",
    red: "text-red-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    green: "text-green-600",
  };

  const bgLightMap: Record<string, string> = {
    emerald: "bg-emerald-50",
    red: "bg-red-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
    green: "bg-green-50",
  };

  const textColor = textColorMap[dept.color] ?? "text-gray-600";
  const bgLight = bgLightMap[dept.color] ?? "bg-gray-50";

  return (
    <div
      className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 cursor-default"
      style={{
        height: hovered ? "210px" : "130px",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.10)"
          : "0 1px 6px rgba(0,0,0,0.06)",
        transition:
          "height .35s cubic-bezier(.3, 0, 0, 1.3), box-shadow .3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon — fixed, no animation */}
      <div
        className={`absolute z-10 flex items-center justify-center rounded-xl ${bgLight}`}
        style={{ width: 40, height: 40, top: 20, left: 20 }}
      >
        <Icon className={`w-5 h-5 ${textColor}`} />
      </div>

      {/* Department name — fixed */}
      <h3
        className="absolute z-10 font-semibold text-gray-800 text-lg leading-snug"
        style={{ top: 68, left: 20, right: 20 }}
      >
        {dept.name}
      </h3>

      {/* Description — always visible, fixed */}
      <p
        className="absolute left-5 right-5 z-10 text-sm text-gray-400 leading-relaxed"
        style={{ top: 92 }}
      >
        {dept.description}
      </p>

      {/* Divider + head info — slides up on hover */}
      <div
        className="absolute left-5 right-5 z-10 flex flex-col gap-1.5"
        style={{
          top: hovered ? "152px" : "230px",
          opacity: hovered ? 1 : 0,
          transition: "all .35s cubic-bezier(.3, 0, 0, 1.3)",
        }}
      >
        <div className="w-full h-px bg-gray-100 mb-0.5" />
        <div className="flex items-center gap-2">
          <User className={`w-3 h-3 shrink-0 ${textColor}`} />
          <span className="text-xs text-gray-500 truncate">
            {dept.head?.name ?? "To be announced"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className={`w-3 h-3 shrink-0 ${textColor}`} />
          <span className={`text-xs font-medium truncate ${textColor}`}>
            {dept.head?.contact ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}