"use client";
import { useState, useEffect } from "react";
import { Phone, AlertCircle, Heart, Shield } from "lucide-react";

const hotlines = [
  {
    label: "CDRRMO - Emergency",
    number: "0998 540 7171",
    icon: AlertCircle,
    urgent: true,
  },

  { label: "City Information Office", number: "(049) 5611483", icon: Phone },
  { label: "City Admin's Office", number: "(049) 5210307", icon: Phone },
  { label: "CDRRM Office", number: "(049) 800 0405", icon: Phone },
];

export default function HotlinesSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="fixed right-0 top-2/3 transform -translate-y-1/2 z-50"
      // keep open when hovering anywhere in the wrapper (button OR hotlines list)
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      {/* Toggle button */}
      <button
        onClick={() => isMobile && setIsOpen(!isOpen)} // tap only for mobile
        className="bg-red-600 hover:bg-red-700 text-white p-3 shadow-lg 
          transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300
          rounded-l-full"
        aria-label="Toggle Emergency Hotlines"
      >
        <Phone
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-12" : ""
          }`}
        />
      </button>

      {/* Hotline list */}
      <div
        className={`
          absolute right-12 top-1/2 transform -translate-y-1/2
          bg-white/95 backdrop-blur-sm rounded-l-xl shadow-lg border border-white/20
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-full pointer-events-none"
          }
        `}
      >
        <div className="p-4 min-w-[220px] max-h-[300px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
            Emergency Hotlines
          </h3>
          {hotlines.map((hotline, index) => (
            <a
              key={index}
              href={`tel:${hotline.number.replace(/[^0-9+]/g, "")}`} // makes numbers clickable on mobile
              className={`
                flex items-center space-x-3 p-3 rounded-lg mb-2 transition-all hover:scale-105 cursor-pointer
                ${
                  hotline.urgent
                    ? "bg-red-50 border border-red-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }
              `}
            >
              <hotline.icon
                className={`w-5 h-5 ${
                  hotline.urgent ? "text-red-600" : "text-emerald-600"
                }`}
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{hotline.label}</div>
                <div
                  className={`font-semibold ${
                    hotline.urgent ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {hotline.number}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="px-4 pb-3">
          <div className="text-xs text-gray-400 text-center">
            {isMobile ? "Tap phone icon to close" : "Hover away to close"}
          </div>
        </div>
      </div>
    </div>
  );
}
