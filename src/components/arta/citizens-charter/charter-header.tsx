// src/components/arta/citizens-charter/charter-header.tsx


//todo: to make the font sizes responsive to screen size for clean mobile view, we can use Tailwind's responsive font size classes. For example, we can use `text-5xl md:text-6xl` for the main heading and `text-xl md:text-2xl` for the subheading. This way, the font sizes will adjust based on the screen size, providing a better user experience on mobile devices.
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ScrollText } from "lucide-react";

interface CharterHeaderProps {
  showExit?: boolean;
}

export default function CharterHeader({
  showExit = false,
}: CharterHeaderProps) {
  const router = useRouter();

  const currentYear = new Date().getFullYear();

  return (
    <header className="relative h-[30rem] bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden shadow-md shadow-emerald-700">
      {showExit && (
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-4 md:top-8 md:right-8 inline-flex items-center gap-2 bg-[#005840] px-4 py-2 rounded-full cursor-pointer shadow-sm transition hover:shadow-md active:scale-95 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit
        </button>
      )}

      <div className="relative max-w-7xl mx-auto text-center pt-38 md:pt-40 px-4">
        <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
          <ScrollText className="w-4 h-4 mr-2" />
          {currentYear}
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-4">
          Karta ng Mamamayan
        </h1>
        <p className="text-lg md:text-2xl text-emerald-100 max-w-3xl mx-auto px-3">
Explore our Citizen's Charter for services, requirements, fees, processing times, and transaction steps.
        </p>
      </div>
    </header>
  );
}