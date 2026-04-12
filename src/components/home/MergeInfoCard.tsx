"use client";
import { useState, useEffect } from "react";
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
      weekday: "short",
      year: "numeric",
      month: "short",
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
          <div className="flex flex-row items-center justify-center sm:justify-between gap-6 sm:gap-0">
            {/* DateTime Section - Left */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end sm:justify-start sm:flex-none">
              <Clock className="w-6 sm:w-6 h-6 sm:h-6 text-white opacity-80 flex-shrink-0" />
              <div className="text-white">
                <div className="text-xs sm:text-xs opacity-90 whitespace-nowrap">
                  {formatDate(currentTime)}
                </div>
                <div className="text-base sm:text-lg font-mono font-bold whitespace-nowrap">
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-14 sm:h-14 bg-white/30 flex-shrink-0" />

            {/* Location Section - Right */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:flex-none sm:justify-end">
              <div className="text-white text-left">
                <div className="text-base sm:text-lg font-bold whitespace-nowrap">
                  City of San Pablo
                </div>
                <div className="text-xs opacity-80 whitespace-nowrap">
                  Laguna, Philippines
                </div>
              </div>
              <MapPin className="w-6 sm:w-6 h-6 sm:h-6 text-white opacity-80 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
