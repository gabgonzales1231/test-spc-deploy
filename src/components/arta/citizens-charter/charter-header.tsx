"use client";

import { useRouter } from "next/navigation";

interface CharterHeaderProps {
  showExit?: boolean;
}

export default function CharterHeader({
  showExit = false,
}: CharterHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-b from-[#009A68] to-emerald-500 text-white rounded-2xl p-3 shadow-md shadow-emerald-700 text-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-wide">
        KARTA NG MAMAMAYAN
      </h1>
      <p className="text-base sm:text-lg md:text-2xl">
        CITIZEN&apos;S CHARTER
      </p>

      {showExit && (
        <div className="absolute top-5 right-2 md:top-4 md:right-4">
          <button
            onClick={() => router.back()}
            className="bg-[#005840] p-1 md:p-3 rounded-full cursor-pointer shadow-sm transition hover:shadow-md active:scale-95"
          >
            Exit
          </button>
        </div>
      )}
    </header>
  );
}