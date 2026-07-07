"use client";
import React, { useState, useEffect } from "react";
import { Clock, MapPin } from "lucide-react";

export default function MergedInfoCard() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) return null;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  return (
    <section className="py-3 sm:py-6 px-4" aria-label="Quick Information">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg sm:rounded-xl shadow-lg px-8 py-5 sm:p-6 overflow-hidden">
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-0">
            {/* Location Section */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center">
              <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-white opacity-80 flex-shrink-0" />
              <div className="text-white text-center">
                <div className="text-sm sm:text-lg font-bold whitespace-nowrap leading-tight">
                  City of San Pablo
                </div>
                <div className="text-[10px] sm:text-xs opacity-80 whitespace-nowrap">
                  Laguna, Philippines
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 sm:h-14 bg-white/30 flex-shrink-0 mx-2 sm:mx-0" />

            {/* DateTime Section */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center">
              <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white opacity-80 flex-shrink-0" />
              <div className="text-white text-center">
                <div className="text-[10px] sm:text-xs opacity-90 whitespace-nowrap">
                  {formatDate(currentTime)}
                </div>
                <div className="text-sm sm:text-lg font-mono font-bold whitespace-nowrap leading-tight">
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}