"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      [key: string]: unknown;
    };
  }
}

const EXCLUDED_ROUTES = ["/privacy-policy", "/terms-of-service", "/cookie-policy"];

export default function DataPrivacyPolicyPopup() {
  const pathname = usePathname();

  // Start as null — means "not yet determined"
  // This prevents any render on the first paint, so the popup
  // never becomes the LCP element and never causes a CLS on mount.
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [isRejected, setIsRejected] = useState(false);

  // Defer localStorage check until after first paint using setTimeout.
  // requestAnimationFrame alone isn't enough — we need to yield to the
  // browser's paint cycle before checking, so we use a 0ms setTimeout
  // which fires after the current task queue (including first paint) clears.
  useEffect(() => {
    if (EXCLUDED_ROUTES.includes(pathname)) {
      setIsOpen(false);
      setIsRejected(false);
      return;
    }

    const timer = setTimeout(() => {
      const accepted = localStorage.getItem("dataPolicyAccepted");
      if (accepted === "true") {
        setIsOpen(false);
        setIsRejected(false);
      } else {
        setIsOpen(true);
        setIsRejected(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Body scroll lock — only applied when popup is open
  // Uses scrollY snapshot to prevent jump on unlock
  useEffect(() => {
    if (EXCLUDED_ROUTES.includes(pathname)) return;
    if (!isOpen && !isRejected) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, isRejected, pathname]);

  // Tawk.to widget hide/show
  useEffect(() => {
    if (EXCLUDED_ROUTES.includes(pathname)) return;

    let interval: ReturnType<typeof setInterval>;
    if (isOpen || isRejected) {
      interval = setInterval(() => {
        window.Tawk_API?.hideWidget?.();
      }, 300);
    } else if (!isOpen && !isRejected) {
      window.Tawk_API?.showWidget?.();
    }

    return () => clearInterval(interval);
  }, [isOpen, isRejected, pathname]);

  // Restore body styles on excluded routes
  useEffect(() => {
    if (EXCLUDED_ROUTES.includes(pathname)) {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    }
  }, [pathname]);

  // Not yet determined — render nothing at all on first paint.
  // This is what prevents the popup text from becoming the LCP element.
  if (isOpen === null) return null;

  if (EXCLUDED_ROUTES.includes(pathname)) return null;

  if (isRejected) {
    return (
      <div
        className="fixed inset-0 z-[9998] bg-black/60 select-none"
        aria-hidden="true"
      />
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60 select-none" aria-hidden="true" />
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-[0_-8px_20px_rgba(0,0,0,0.25)]">
        <div className="p-6 w-full">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">
                Data Privacy Policy
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                The City Government of San Pablo values your privacy and is
                dedicated to protecting your personal data in compliance with
                the Data Privacy Act (DPA) of 2012 (Republic Act No. 10173).{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Read More
                </a>
              </p>
            </div>
            <div className="flex gap-3 md:flex-shrink-0">
              <button
                onClick={() => {
                  localStorage.setItem("dataPolicyAccepted", "false");
                  setIsOpen(false);
                  setIsRejected(true);
                }}
                className="px-6 py-2.5 font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Reject All
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("dataPolicyAccepted", "true");
                  setIsOpen(false);
                  setIsRejected(false);
                  document.body.style.position = "";
                  document.body.style.top = "";
                  document.body.style.width = "";
                  document.body.style.overflow = "";
                }}
                className="px-6 py-2.5 font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}