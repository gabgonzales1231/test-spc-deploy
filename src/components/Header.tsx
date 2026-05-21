"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Navigation items definition
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
      { label: "The History of San Pablo", href: "/about-us/history" },
      { label: "Visions and Mission", href: "/about-us/mission-vision" },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/disclosure-portal", label: "Transparency" },
  { href: "/forms", label: "Forms" },
  { href: "/publications", label: "Publications" },
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
  const headerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if the current route should hide the header
  const isHiddenRoute = pathname === "/arta/citizens-charter/view";

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDesktopDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
    }, 200);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDesktopDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 transition-all duration-500 ease-in-out ${
        isHiddenRoute 
          ? "opacity-0 -translate-y-10 pointer-events-none" 
          : "opacity-100 translate-y-0"
      }`}
    >
      <div className="bg-white rounded-full shadow-xl border border-gray-100 px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Image
            src="/seal.webp"
            alt="City of San Pablo Logo"
            width={48}
            height={48}
            priority
          />
          <span className="ml-2 text-md lg:text-2xl font-bold text-gray-900">
            City of San Pablo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6 items-center" aria-label="Primary navigation">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.hasDropdown ? (
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                          openDesktopDropdown === item.label ? "text-emerald-700" : "text-gray-700"
                        }`}
                        prefetch={false}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className={`ml-1 p-1 transition-colors hover:text-emerald-700 ${
                          openDesktopDropdown === item.label ? "text-emerald-700" : "text-gray-700"
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
                          className={`h-4 w-4 transition-transform ${
                            openDesktopDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`flex items-center text-sm font-medium transition-colors hover:text-emerald-700 ${
                        openDesktopDropdown === item.label ? "text-emerald-700" : "text-gray-700"
                      }`}
                      onClick={() =>
                        setOpenDesktopDropdown((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                      aria-expanded={openDesktopDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          openDesktopDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  {openDesktopDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-2 w-56 z-50">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                        {item.subItems!.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                            prefetch={false}
                            onClick={() => setOpenDesktopDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className="text-sm font-medium hover:text-emerald-700 transition-colors text-gray-700"
                  prefetch={false}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="lg:hidden"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={`rounded-lg lg:hidden absolute top-15 right-5 w-xs bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
        inert={!isMenuOpen ? true : undefined}
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-2 p-6">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.hasDropdown ? (
                <div>
                  <div className="flex items-center justify-between">
                    {item.href ? (
                      <>
                        <Link
                          href={item.href}
                          className={`flex-1 text-sm font-medium transition-colors py-2 hover:text-emerald-700 ${
                            openMobileDropdown === item.label ? "text-emerald-700" : "text-gray-700"
                          }`}
                          prefetch={false}
                          onClick={toggleMenu}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          className={`p-2 transition-colors hover:text-emerald-700 ${
                            openMobileDropdown === item.label ? "text-emerald-700" : "text-gray-700"
                          }`}
                          onClick={() => toggleMobileDropdown(item.label)}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openMobileDropdown === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={`flex-1 flex items-center justify-between text-sm font-medium transition-colors py-2 hover:text-emerald-700 ${
                          openMobileDropdown === item.label ? "text-emerald-700" : "text-gray-700"
                        }`}
                        onClick={() => toggleMobileDropdown(item.label)}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openMobileDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {openMobileDropdown === item.label && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.subItems!.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block text-sm text-gray-700 hover:text-emerald-700 transition-colors py-1"
                          prefetch={false}
                          onClick={toggleMenu}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className="block text-sm font-medium text-gray-700 hover:text-emerald-700 transition-colors py-2"
                  prefetch={false}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}