// src/components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  {
    label: "About Us",
    href: "/about-us",
    hasDropdown: true,
    subItems: [
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
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isSolid, setIsSolid] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDesktopDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDesktopDropdown(null), 150);
  };

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-chat"));
  };

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
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      )
        setOpenDesktopDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
              width={42}
              height={42}
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
            className="hidden lg:flex items-center gap-1"
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
                      className="relative flex items-center"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex items-center">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={`px-3.5 py-2 text-[12.5px] font-medium tracking-wide transition-colors duration-150 ${
                              active
                                ? "text-emerald-700"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                            prefetch={false}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span
                            className={`px-3.5 py-2 text-[12.5px] font-medium tracking-wide cursor-default ${
                              active ? "text-emerald-700" : "text-gray-600"
                            }`}
                          >
                            {item.label}
                          </span>
                        )}
                        <button
                          type="button"
                          className={`-ml-1.5 pr-2 py-2 transition-colors duration-150 hover:text-gray-900 ${
                            active ? "text-emerald-700" : "text-gray-400"
                          }`}
                          onClick={() =>
                            setOpenDesktopDropdown((prev) =>
                              prev === item.label ? null : item.label
                            )
                          }
                          aria-expanded={openDesktopDropdown === item.label}
                          aria-haspopup="true"
                        >
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
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
                              const subActive =
                                pathname === subItem.href ||
                                pathname.startsWith(subItem.href + "/");
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`block px-4 py-2.5 text-[12.5px] transition-colors duration-150 border-b border-gray-50 last:border-0 ${
                                    subActive
                                      ? "text-emerald-700 bg-emerald-50/70 font-medium"
                                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                  }`}
                                  prefetch={false}
                                  onClick={() => setOpenDesktopDropdown(null)}
                                >
                                  {subItem.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`relative px-3.5 py-2 text-[12.5px] font-medium tracking-wide transition-colors duration-150 ${
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

          {/* Right side — Ask a question + mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openChat}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-[13.5px] font-semibold text-white rounded-md transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: "0 2px 8px rgba(5,150,105,0.35)",
              }}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              Ask a question
            </button>

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
                          const subActive =
                            pathname === subItem.href ||
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
                              onClick={toggleMenu}
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

          {/* Mobile Ask a question */}
          <div className="pt-3 pb-1">
            <button
              type="button"
              onClick={() => { toggleMenu(); openChat(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold text-white rounded-md transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: "0 2px 8px rgba(5,150,105,0.30)",
              }}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              Ask a question
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}