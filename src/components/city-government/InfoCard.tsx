"use client";

import React from "react";
import { User, Phone } from "lucide-react";
import { Department } from "@/components/city-government/types";

export default function InfoCard({ dept }: { dept: Department }) {
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
      className="relative overflow-hidden bg-white rounded-2xl border cursor-default w-full"
      style={{
        height: "230px",
        borderColor: "transparent",
        boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
      }}
    >
      {/* Static content — icon, name, description centered */}
      <div className="absolute inset-x-0 top-0 flex flex-col items-center text-center px-6 pt-6 gap-2">
        <div
          className={`flex items-center justify-center rounded-xl ${bgLight}`}
          style={{ width: 44, height: 44, flexShrink: 0 }}
        >
          <Icon className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg leading-snug">
          {dept.name}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {dept.description}
        </p>
      </div>

      {/* Divider + head info */}
      <div className="absolute left-6 right-6 top-[160px] z-10 flex flex-col items-center gap-2">
        <div className="w-full h-px bg-gray-100" />
        <div className="flex items-center gap-2">
          <User className={`w-3.5 h-3.5 shrink-0 ${textColor}`} />
          <span className="text-xs text-gray-500 truncate">
            {dept.head?.name ?? "To be announced"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className={`w-3.5 h-3.5 shrink-0 ${textColor}`} />
          <span className={`text-xs font-medium truncate ${textColor}`}>
            {dept.head?.contact ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}