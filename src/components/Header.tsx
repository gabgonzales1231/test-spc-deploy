"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface SubNavItem {
  label: string;
  href: string;
  isRedress?: boolean;
}

interface NavItem {
  href?: string;
  label: string;
  hasDropdown?: boolean;
  subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  {
    label: "About Us",
    hasDropdown: true,
    subItems: [
      { label: "About", href: "/about-us" },
      { label: "City Government", href: "/about-us/city-government" },
      { label: "Local Officials", href: "/about-us/local-officials" },
      { label: "Explore San Pablo City", href: "/about-us/explore" },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/transparency", label: "Transparency" },
  { href: "/forms", label: "Forms" },
  {
    label: "ARTA Corner",
    hasDropdown: true,
    subItems: [
      { label: "Citizen's Charter", href: "/arta/citizens-charter" },
      { label: "E-PACD", href: "/arta/epacd" },
      { label: "Redress Mechanism", href: "#redress", isRedress: true },
    ],
  },
];

/* ----------------------------------------------------------------------- */
/* Redress Mechanism — compact, column-stacked popout                      */
/* ----------------------------------------------------------------------- */

const REDRESS_CHANNELS = [
  {
    id: "hrmo",
    title: "City Human Resource Management Office",
    qrSrc: "/citizens-charter/qr/qr-1.png",
    lines: [
      "Email: chrmo@sanpablocity.gov.ph",
      "HR Building, City Hall Cmpd., Trese Martirez St., San Pablo City 4000",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    id: "pacd",
    title: "Public Assistance Complaints Desk (PACD)",
    qrSrc: "/citizens-charter/qr/qr-2.png",
    lines: [
      "One Stop Processing Center",
      "Lobby, 2nd Flr., New Governance Bldg.",
      "Lobby, 2nd Flr., SPC Shopping Mall & Public Market",
      "Lobby, Ground Flr., CCR Building",
      "Help Desk: helpdesk@sanpablocity.gov.ph",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    id: "8888",
    title: "8888 Citizens' Complaint Center",
    qrSrc: "/citizens-charter/qr/qr-3.png",
    lines: [
      "Email: 8888complaint@op.gov.ph",
      "Telephone: Dial 8888",
      "Admin concerns: (02) 8249-8310",
      "J.P. Laurel St., San Miguel, Manila",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
  {
    id: "ccb",
    title: "Contact Center ng Bayan (CCB)",
    qrSrc: "/citizens-charter/qr/qr-4.png",
    lines: [
      "SMS: 0908-8816565",
      "Email: email@contactcenterngbayan.gov.ph",
      "Web: www.contactcenterngbayan.gov.ph",
      "Hotline: (02) 8932-0111",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "arta",
    title: "Anti-Red Tape Authority (ARTA)",
    qrSrc: "/citizens-charter/qr/qr-5.png",
    lines: [
      "PLDT: 1-ARTA (12782) / (02) 8246-7940",
      "Smart: 0920-925-3078 / 0998-856-8338",
      "Email: complaints@arta.gov.ph",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
];

function RedressMechanismPanel({ onClose }: { onClose: () => void }) {
  const [openId, setOpenId] = useState<string | null>(REDRESS_CHANNELS[0].id);

  const toggleChannel = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div
      className="w-full sm:w-[380px] bg-white border border-gray-100 rounded-xl shadow-2xl shadow-gray-900/15 overflow-hidden flex flex-col"
      role="dialog"
      aria-label="Redress Mechanism"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">

          <div>
            <p className="text-[16px] font-bold text-gray-900 leading-tight font-[family-name:var(--font-geist-sans)]">
              Redress Mechanism
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Complaints, suggestions &amp; commendations
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 -mr-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Close Redress Mechanism panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Channel list */}
      <div className="max-h-[min(60vh,480px)] overflow-y-auto divide-y divide-gray-100">
        {REDRESS_CHANNELS.map((channel) => {
          const isOpen = openId === channel.id;
          return (
            <div key={channel.id}>
              <button
                type="button"
                onClick={() => toggleChannel(channel.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/80 transition-colors"
              >
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                  {channel.icon}
                </span>
                <p className="flex-1 min-w-0 text-[12.5px] font-semibold text-gray-800 leading-snug">
                  {channel.title}
                </p>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex gap-4 px-4 pb-4 pt-1">
                    <div className="shrink-0 bg-white p-1.5 rounded-lg border border-gray-150 shadow-sm h-fit">
                      <Image
                        src={channel.qrSrc}
                        alt={`QR code for ${channel.title}`}
                        width={200}
                        height={200}
                        className="size-28 object-contain"
                      />
                    </div>
                    <ul className="flex-1 min-w-0 space-y-1.5 py-0.5">
                      {channel.lines.map((line, i) => (
                        <li key={i} className="text-[11.5px] text-gray-600 leading-snug">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <a
        href="https://www.sanpablocity.gov.ph/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 px-4 py-3 border-t border-gray-100 bg-gray-50/60 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
      >
        View more about San Pablo City
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isSolid, setIsSolid] = useState(false);
  const [isRedressOpen, setIsRedressOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const redressModalRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleRedress = () => {
    // Keep the parent dropdown open so the panel can sit beside it
    setIsRedressOpen((prev) => !prev);
  };

  const closeRedress = () => setIsRedressOpen(false);

  const isHiddenRoute = pathname === "/arta/citizens-charter/view";

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isDropdownActive = (subItems?: { href: string }[]) =>
    subItems?.some(
      (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
    ) ?? false;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (label: string) =>
    setOpenMobileDropdown((prev) => (prev === label ? null : label));

  const toggleDesktopDropdown = (label: string) =>
    setOpenDesktopDropdown((prev) => (prev === label ? null : label));

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDesktopDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
      setIsRedressOpen(false);
    }, 150);
  };

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const timeString = now
    ? now.toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--:--:-- --";

  const dateString = now
    ? now.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    const HEADER_HEIGHT = 72;
    const solidSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-solid-header]")
    );
    if (solidSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsSolid(entries.some((e) => e.isIntersecting));
      },
      {
        rootMargin: `-0px 0px -${window.innerHeight - HEADER_HEIGHT}px 0px`,
        threshold: 0,
      }
    );

    solidSections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const shouldLock = isMenuOpen || isRedressOpen;
    if (shouldLock) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [isMenuOpen, isRedressOpen]);

  useEffect(() => {
    if (!isRedressOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsRedressOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isRedressOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideHeader = headerRef.current?.contains(target);
      const insideRedressModal = redressModalRef.current?.contains(target);
      if (!insideHeader) {
        setOpenDesktopDropdown(null);
        if (!insideRedressModal) {
          setIsRedressOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isHiddenRoute
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      <div
        className="relative w-full bg-white transition-all duration-300"
        style={{
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div className="relative mx-auto max-w-screen-2xl px-6 lg:px-12 flex items-center justify-between h-[90px]">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3.5 shrink-0 group"
            prefetch={false}
          >
            <Image
              src="/seal.webp"
              alt="City of San Pablo Seal"
              width={52}
              height={52}
              priority
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className="w-px h-8 bg-gray-200 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-[18px] font-semibold text-gray-900 tracking-tight leading-tight">
                City Government of San Pablo
              </p>
              <p className="text-[13px] font-medium tracking-[0.1em] uppercase text-emerald-700 leading-tight mt-0.5">
                Official Website
              </p>
            </div>
            <div className="sm:hidden">
              <p className="text-[15px] font-semibold text-gray-900 tracking-tight leading-tight">
                City Government of San Pablo
              </p>
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-emerald-700 leading-tight mt-0.5">
                Official Website
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-[clamp(0px,0.4vw,4px)] flex-nowrap"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const active = item.hasDropdown
                ? isDropdownActive(item.subItems) || isActive(item.href)
                : isActive(item.href);

              return (
                <div key={item.label} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative flex items-center h-9"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex items-center h-full">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={`border border-gray-300 h-full flex items-center px-[clamp(0.5rem,0.85vw,0.875rem)] text-[clamp(11px,0.78vw,14px)] font-medium tracking-wide whitespace-nowrap leading-none transition-colors duration-150 ${
                              active
                                ? "text-emerald-700"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                            prefetch={false}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDesktopDropdown(item.label);
                            }}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className={`h-full flex items-center px-[clamp(0.5rem,0.85vw,0.875rem)] text-[clamp(11px,0.78vw,14px)] font-medium tracking-wide whitespace-nowrap leading-none cursor-default ${
                              active ? "text-emerald-700" : "text-gray-600"
                            }`}
                            onClick={() => toggleDesktopDropdown(item.label)}
                          >
                            {item.label}
                          </button>
                        )}
                        <button
                          type="button"
                          className={`h-full flex items-center -ml-1.5 pr-[clamp(0.4rem,0.6vw,0.5rem)] transition-colors duration-150 hover:text-gray-900 ${
                            active ? "text-emerald-700" : "text-gray-400"
                          }`}
                          onClick={() => toggleDesktopDropdown(item.label)}
                          aria-expanded={openDesktopDropdown === item.label}
                          aria-haspopup="true"
                        >
                          <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                              openDesktopDropdown === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {active && (
                        <span className="absolute -bottom-[1px] left-3.5 right-[26px] h-[2px] bg-emerald-600" />
                      )}

                      {openDesktopDropdown === item.label && (
                        <div className="absolute top-full left-0 pt-2 w-56 z-50">
                          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-900/10">
                            {item.subItems!.map((subItem) => {
                              const isParentOfSibling = item.subItems!.some(
                                (other) =>
                                  other.href !== subItem.href &&
                                  other.href.startsWith(subItem.href + "/")
                              );
                              const subActive = isParentOfSibling
                                ? pathname === subItem.href
                                : pathname === subItem.href ||
                                  pathname.startsWith(subItem.href + "/");
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`block px-4 py-2.5 text-[14px] transition-colors duration-150 border-b border-gray-50 last:border-0 ${
                                    subActive
                                      ? "text-emerald-700 bg-emerald-50/70 font-medium"
                                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                  }`}
                                  prefetch={false}
                                  onClick={(e) => {
                                    if (subItem.isRedress) {
                                      e.preventDefault();
                                      toggleRedress();
                                      return;
                                    }
                                    setOpenDesktopDropdown(null);
                                  }}
                                >
                                  {subItem.label}
                                </Link>
                              );
                            })}
                          </div>

                          {/* Redress Mechanism popout — appears beside the dropdown */}
                          {isRedressOpen && (
                            <div className="absolute top-0 right-full mr-2 hidden lg:block">
                              <RedressMechanismPanel onClose={closeRedress} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`relative h-9 flex items-center px-[clamp(0.5rem,0.85vw,0.875rem)] text-[clamp(11px,0.78vw,14px)] font-medium tracking-wide whitespace-nowrap leading-none transition-colors duration-150 ${
                        active
                          ? "text-emerald-700"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      prefetch={false}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute -bottom-[1px] left-3.5 right-3.5 h-[2px] bg-emerald-600" />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side — Time/date divider + mobile toggle */}
          <div className="flex items-center gap-3 h-full ">
            <div className="hidden lg:flex self-stretch items-center pl-[clamp(1rem,1.5vw,1.5rem)] border-l border-gray-200 shrink-0">
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-[clamp(13px,1vw,20px)] font-semibold text-emerald-700 tabular-nums tracking-tight whitespace-nowrap">
                  {timeString}
                </span>
                <span className="text-[clamp(8px,0.62vw,12px)] font-medium text-gray-500 mt-0.5 tracking-wide whitespace-nowrap">
                  {dateString}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden w-9 h-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden absolute top-full right-0 w-full sm:w-80 sm:right-4 bg-white border border-gray-100 shadow-xl shadow-gray-900/10 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        inert={!isMenuOpen ? true : undefined}
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col p-4 gap-0.5">
          {navItems.map((item) => {
            const active = item.hasDropdown
              ? isDropdownActive(item.subItems) || isActive(item.href)
              : isActive(item.href);

            return (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <div>
                    <div className="flex items-center justify-between">
                      {item.href ? (
                        <>
                          <Link
                            href={item.href}
                            className={`flex-1 text-[14px] font-medium tracking-wide transition-colors py-2.5 ${
                              active
                                ? "text-emerald-700"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                            prefetch={false}
                            onClick={toggleMenu}
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            className={`p-2 transition-colors ${
                              active ? "text-emerald-700" : "text-gray-400"
                            }`}
                            onClick={() => toggleMobileDropdown(item.label)}
                          >
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                openMobileDropdown === item.label ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={`flex-1 flex items-center justify-between text-[14px] font-medium tracking-wide transition-colors py-2.5 ${
                            active
                              ? "text-emerald-700"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                          onClick={() => toggleMobileDropdown(item.label)}
                        >
                          {item.label}
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              openMobileDropdown === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {openMobileDropdown === item.label && (
                      <div className="pl-3 mb-1 space-y-0.5 border-l-2 border-emerald-500/30">
                        {item.subItems!.map((subItem) => {
                          const isParentOfSibling = item.subItems!.some(
                            (other) =>
                              other.href !== subItem.href &&
                              other.href.startsWith(subItem.href + "/")
                          );
                          const subActive = isParentOfSibling
                            ? pathname === subItem.href
                            : pathname === subItem.href ||
                              pathname.startsWith(subItem.href + "/");
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block text-[13.5px] transition-colors py-2 ${
                                subActive
                                  ? "text-emerald-700 font-medium"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                              prefetch={false}
                              onClick={(e) => {
                                if (subItem.isRedress) {
                                  e.preventDefault();
                                  toggleRedress();
                                  return;
                                }
                                toggleMenu();
                              }}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    <div className="h-px bg-gray-50" />
                  </div>
                ) : (
                  <>
                    <Link
                      href={item.href!}
                      className={`block text-[14px] font-medium tracking-wide transition-colors py-2.5 ${
                        active
                          ? "text-emerald-700"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                      prefetch={false}
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                    <div className="h-px bg-gray-50" />
                  </>
                )}
              </div>
            );
          })}

          {/* Mobile time/date */}
          <div className="pt-3 pb-1">
            <div className="w-full flex flex-col items-center gap-0.5 py-3 border-t border-gray-100">
              <span className="text-[18px] font-bold text-gray-900 tabular-nums tracking-tight">
                {timeString}
              </span>
              <span className="text-[14px] font-medium text-gray-500 tracking-wide">
                {dateString}
              </span>
            </div>
          </div>
        </nav>
      </div>
    </header>

    {isMounted &&
      isRedressOpen &&
      createPortal(
        <div
          className="fixed inset-0 z-[9999] lg:hidden flex items-center justify-center overflow-y-auto bg-white/80 backdrop-blur-sm px-4 py-8"
          onClick={closeRedress}
        >
          <div
            ref={redressModalRef}
            className="relative w-full max-w-md my-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <RedressMechanismPanel onClose={closeRedress} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}