// src/components/publications/PesoCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function PesoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
  <div className="relative overflow-hidden rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/60 via-white/40 to-emerald-100/30 backdrop-blur-sm shadow-lg px-8 py-10 flex flex-col sm:flex-row items-center gap-8
    transition-transform duration-300 ease-out group-hover:scale-[1.015] group-hover:shadow-xl">

        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-emerald-200/20 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-300/10 rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32">
          <div className="absolute inset-0 rounded-full bg-white shadow-md ring-2 ring-emerald-200/60" />
          <Image
            src="/publications/peso.png"
            alt="PESO San Pablo City Logo"
            fill
            className="object-contain rounded-full p-1.5"
            sizes="128px"
          />
        </div>

        {/* Text */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">
            City Government of San Pablo
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Public Employment and Service Office
          </h2>
          <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
            Connect with PESO on Facebook for timely employment news, job fair
            announcements, and public service updates.
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 z-99">
          
          <a  href="https://www.facebook.com/PESO.sanpablo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-emerald-200 transition-all duration-150"
          >
            Access Link
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}