"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// Fix TS error for Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      // other runtime properties are allowed but unknown to TypeScript
      [key: string]: unknown;
    };
  }
}

export default function DataPrivacyPolicyPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    // Always show popup if not accepted, even if rejected previously—but never on excluded routes
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-of-service" ||
      pathname === "/cookie-policy"
    ) {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
      }
      setIsOpen(false);
      setIsRejected(false);
      return;
    }
    if (typeof window !== "undefined") {
      const accepted = window.localStorage.getItem("dataPolicyAccepted");
      if (accepted === "true") {
        setIsOpen(false);
        setIsRejected(false);
        if (typeof document !== "undefined") {
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
          document.body.style.overflow = "";
        }
      } else {
        setIsOpen(true);
        setIsRejected(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-of-service" ||
      pathname === "/cookie-policy"
    )
      return;
    if (isOpen || isRejected) {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        return () => {
          const y = document.body.style.top;
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
          document.body.style.overflow = "";
          window.scrollTo(0, parseInt(y || "0") * -1);
        };
      }
    }
  }, [isOpen, isRejected, pathname]);

  useEffect(() => {
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-of-service" ||
      pathname === "/cookie-policy"
    )
      return;
    let interval: ReturnType<typeof setInterval>;
    if (isOpen || isRejected) {
      if (typeof window !== "undefined") {
        interval = setInterval(() => {
          if (window.Tawk_API && window.Tawk_API.hideWidget) {
            window.Tawk_API.hideWidget();
          }
        }, 300);
      }
    } else if (
      typeof window !== "undefined" &&
      !isOpen &&
      !isRejected &&
      window.Tawk_API &&
      window.Tawk_API.showWidget
    ) {
      window.Tawk_API.showWidget();
    }
    return () => clearInterval(interval);
  }, [isOpen, isRejected, pathname]);

  // On pathname change, if on excluded routes, always restore scroll instantly.
  useEffect(() => {
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-of-service" ||
      pathname === "/cookie-policy"
    ) {
      if (typeof document !== "undefined") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
      }
    }
  }, [pathname]);

  const handleAcceptAll = () => {
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-of-service" ||
      pathname === "/cookie-policy"
    )
      return;
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      window.localStorage.setItem("dataPolicyAccepted", "true");
      setIsOpen(false);
      setIsRejected(false);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    }
  };

  const handleRejectAll = () => {
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-of-service" ||
      pathname === "/cookie-policy"
    )
      return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dataPolicyAccepted", "false");
      setIsOpen(false);
      setIsRejected(true); // show only overlay, block everything else
    }
  };

  // Only after all hooks, conditionally render nothing on /privacy-policy
  if (
    pathname === "/privacy-policy" ||
    pathname === "/terms-of-service" ||
    pathname === "/cookie-policy"
  ) {
    return null;
  }

  // Just show overlay and disable page after rejection, no modal
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
      {/* Strong page lock overlay WHILE modal open, blocks all pointer events except modal */}
      <div className="fixed inset-0 z-[9998] bg-black/60 select-none" />
      {/* Popup container - highest z, fully clickable */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-[0_-8px_20px_rgba(0,0,0,0.25)]">
        <div className="p-6 w-full">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Text Section */}
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
            {/* Buttons */}
            <div className="flex gap-3 md:flex-shrink-0">
              <button
                onClick={handleRejectAll}
                className="px-6 py-2.5 font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
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
