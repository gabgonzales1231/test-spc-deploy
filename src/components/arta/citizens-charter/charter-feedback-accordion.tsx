"use client";

import { useState } from "react";
import Image from "next/image";

const QR_ITEMS = [
  {
    id: "hrmo",
    label: "Visit and/or hand in your letter",
    colorBorder: "border-blue-100",
    colorBg: "bg-blue-50/10 hover:bg-blue-50/40",
    colorIcon: "bg-blue-100 text-blue-600",
    colorTitle: "text-blue-900",
    src: "/citizens-charter/qr/qr-1.png",
    alt: "QR HRMO",
    // Envelope — letter/mail
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    id: "pacd",
    label: "Public Assistance Complaints Desk (PACD)",
    colorBorder: "border-yellow-100",
    colorBg: "bg-yellow-50/10 hover:bg-yellow-50/40",
    colorIcon: "bg-yellow-100 text-yellow-600",
    colorTitle: "text-yellow-900",
    src: "/citizens-charter/qr/qr-2.png",
    alt: "QR PACD",
    // Map pin — physical desk/location
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    id: "8888",
    label: "8888 Hotline",
    colorBorder: "border-emerald-100",
    colorBg: "bg-emerald-50/10 hover:bg-emerald-50/40",
    colorIcon: "bg-emerald-100 text-emerald-600",
    colorTitle: "text-emerald-900",
    src: "/citizens-charter/qr/qr-3.png",
    alt: "QR 8888 Hotline",
    // Phone — hotline calls
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
  {
    id: "ccb",
    label: "Contact Center ng Bayan",
    colorBorder: "border-emerald-100",
    colorBg: "bg-emerald-50/10 hover:bg-emerald-50/40",
    colorIcon: "bg-emerald-100 text-emerald-600",
    colorTitle: "text-emerald-900",
    src: "/citizens-charter/qr/qr-4.png",
    alt: "QR CSC CCB",
    // Chat bubbles — contact/messaging center
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "arta",
    label: "ARTA Contact Info",
    colorBorder: "border-emerald-100",
    colorBg: "bg-emerald-50/10 hover:bg-emerald-50/40",
    colorIcon: "bg-emerald-100 text-emerald-600",
    colorTitle: "text-emerald-900",
    src: "/citizens-charter/qr/qr-5.png",
    alt: "QR ARTA",
    // Building/office — government agency
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
];

export default function CharterFeedbackAccordion() {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [openMobileQr, setOpenMobileQr] = useState<string | null>(null);

  const toggleMobileQr = (id: string) => {
    setOpenMobileQr(openMobileQr === id ? null : id);
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all duration-200">
      {/* Accordion Header */}
      <button
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 active:bg-gray-100/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <article>
            <h1 className="text-sm sm:text-base font-bold sm:tracking-wide">
              Kung may nais iparating na sumbong, puna o papuri:
            </h1>
            <p className="text-xs md:text-sm tracking-tight sm:tracking-wide">
              (For your complaints, suggestions or commendation you may also
              send it to the following:)
            </p>
          </article>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`size-4 text-gray-500 transition-transform duration-300 shrink-0 ${
            isSectionOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Accordion Body */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isSectionOpen
            ? "grid-rows-[1fr] opacity-100 p-4 md:p-6 border-t border-gray-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-gray-500 mb-2 hidden md:block">
            I-scan ang kaukulang QR code o gamitin ang mga detalye sa ibaba
            upang maiparating ang inyong mga sumbong, puna, o papuri:
          </p>

          {/* Desktop: 5-column QR grid */}
          <div className="hidden sm:grid grid-cols-5 gap-4 items-stretch">
            {QR_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`group flex flex-col items-center p-4 rounded-xl border ${item.colorBorder} ${item.colorBg} transition-all text-center justify-between`}
              >
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 ${item.colorIcon} rounded-lg shrink-0`}>
                      {item.icon}
                    </div>
                    <span className={`font-bold ${item.colorTitle} text-sm`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-inner border border-gray-150 mb-3">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={112}
                      height={112}
                      className="size-24 md:size-28 object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Accordion dropdowns */}
          <div className="flex flex-col gap-2 sm:hidden">
            {/* HRMO */}
            <div className="border border-blue-100 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => toggleMobileQr("hrmo")}
                className="w-full flex items-center justify-between p-2.5 bg-blue-50/40 text-xs font-bold text-blue-950"
              >
                <span>Visit and/or hand in your letter</span>
                <span className={`text-blue-600 transition-transform ${openMobileQr === "hrmo" ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openMobileQr === "hrmo" && (
                <div className="flex flex-col items-center p-3 border-t border-blue-50 bg-slate-50/50 gap-3 text-center">
                  <div className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-150 text-left w-full">
                    <p className="font-bold text-blue-900">The City Human Resource Management Office</p>
                    <p><span className="font-semibold text-gray-800">Email:</span> chrmo@sanpablocity.gov.ph</p>
                    <p className="text-[10px] text-gray-400 pt-1">Address: HR Building, City Hall Cmpd. Trese Martirez St. San Pablo City 4000</p>
                  </div>
                </div>
              )}
            </div>

            {/* PACD */}
            <div className="border border-yellow-100 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => toggleMobileQr("pacd")}
                className="w-full flex items-center justify-between p-2.5 bg-yellow-50/40 text-xs font-bold text-yellow-950"
              >
                <span>Public Assistance Complaints Desk (PACD)</span>
                <span className={`text-yellow-600 transition-transform ${openMobileQr === "pacd" ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openMobileQr === "pacd" && (
                <div className="flex flex-col items-center p-3 border-t border-yellow-50 bg-slate-50/50 gap-3 text-center">
                  <div className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-150 text-left w-full space-y-0.5">
                    <p><span className="font-semibold text-gray-800">1.</span> One Stop Processing Center</p>
                    <p><span className="font-semibold text-gray-800">2.</span> Lobby Area 2nd Floor, New Governance Bldg</p>
                    <p><span className="font-semibold text-gray-800">3.</span> Lobby Area, 2nd Floor, San Pablo City Shopping Mall and Public Market</p>
                    <p><span className="font-semibold text-gray-800">4.</span> Lobby Area, Ground Floor, CCR Building</p>
                    <p><span className="font-semibold text-gray-800">Help Desk Email:</span> helpdesk@sanpablocity.gov.ph</p>
                  </div>
                </div>
              )}
            </div>

            {/* 8888 + CCB + ARTA */}
            <div className="border border-emerald-100 rounded-lg bg-white">
              <button
                onClick={() => toggleMobileQr("csc-arta")}
                className="w-full flex items-center justify-between p-2.5 bg-emerald-50/40 text-xs font-bold text-emerald-950"
              >
                <span>8888 - Contact Center ng Bayan</span>
                <span className={`text-emerald-600 transition-transform ${openMobileQr === "csc-arta" ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openMobileQr === "csc-arta" && (
                <div className="flex flex-col items-center p-3 border-t border-emerald-50 bg-slate-50/50 gap-3 text-center">
                  <div className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-150 text-left w-full space-y-2 max-h-[160px] overflow-y-auto">
                    <div>
                      <p className="font-bold text-emerald-900">8888 Citizens' Complaint Center</p>
                      <p>Email: 8888complaint@op.gov.ph</p>
                      <p>Telephone No.: Dial 8888</p>
                      <p>For admin concern: 8249-8310</p>
                      <p className="text-[10px] text-gray-400 pt-1">Address: J. P. Laurel St. San Miguel, Manila</p>
                    </div>
                    <div className="border-t border-gray-100 pt-1.5">
                      <p className="font-bold text-emerald-900">CSC Contact Center ng Bayan (CCB)</p>
                      <p>SMS: 0908-8816565</p>
                      <p>Email: email@contactcenterngbayan.gov.ph</p>
                      <p>Web: www.contactcenterngbayan.gov.ph</p>
                      <p>Hotline: 8932-0111</p>
                    </div>
                    <div className="border-t border-gray-100 pt-1.5">
                      <p className="font-bold text-emerald-900">Contact Information of ARTA</p>
                      <p>PLDT: 1-ARTA (12782) | (02) 8246-7940</p>
                      <p>Smart: 0920-925-3078 | 0998-856-8338</p>
                      <p>Email: complaints@arta.gov.ph | info@arta.gov.ph</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View more link */}
          <a
            className="backdrop-blur-lg text-center bg-emerald-100 shadow-sm transition hover:shadow-md active:scale-95 text-green-700 border border-emerald-300 rounded-lg py-1 px-3 font-semibold tracking-wide text-sm cursor-pointer"
            href="https://www.sanpablocity.gov.ph/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View more about San Pablo City
          </a>
        </div>
      </div>
    </div>
  );
}