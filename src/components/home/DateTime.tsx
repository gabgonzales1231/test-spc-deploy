"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function DateTime() {
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
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90">{formatDate(currentTime)}</div>
          <div className="text-2xl font-mono font-bold">
            {formatTime(currentTime)}
          </div>
        </div>
        <Clock className="w-8 h-8 opacity-80" />
      </div>
    </div>
  );
}
