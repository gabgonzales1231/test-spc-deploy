"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileAboutOpen(false); // Close about submenu when main menu toggles
  };

  const toggleMobileAbout = () => {
    setIsMobileAboutOpen(!isMobileAboutOpen);
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  // Close dropdown when clicking outside (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".about-dropdown")) {
        setIsAboutDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    { href: "/disclosure-portal", label: "Disclosure Portal" },
    { href: "/forms", label: "Forms" },
  ];

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white rounded-full shadow-xl border border-gray-100 px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
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
            <div key={item.label} className="relative about-dropdown">
              {item.hasDropdown ? (
                <div className="relative">
                  <div className="flex items-center">
                    <Link
                      href={item.href!}
                      className="text-sm font-medium hover:text-primary-600 transition-colors text-gray-600"
                      prefetch={false}
                    >
                      {item.label}
                    </Link>
                    <button
                        type="button"
                        className="ml-1 p-1 hover:text-primary-600 transition-colors text-gray-600"
                        onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                        onMouseEnter={() => setIsAboutDropdownOpen(true)}
                        aria-expanded={isAboutDropdownOpen}
                        aria-haspopup="true"
>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isAboutDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {isAboutDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                      onMouseEnter={() => setIsAboutDropdownOpen(true)}
                      onMouseLeave={() => setIsAboutDropdownOpen(false)}
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          prefetch={false}
                          onClick={() => setIsAboutDropdownOpen(false)}
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
                  className="text-sm font-medium hover:text-primary-600 transition-colors text-gray-600"
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
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
<div
  id="mobile-menu"
  className={`rounded-lg lg:hidden absolute top-15 lg:top-15 right-5 lg:right-5 w-xs lg:w-xl bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
    isMenuOpen ? "max-h-96" : "max-h-0"
  }`}
  
  inert={!isMenuOpen}
  aria-label="Mobile navigation"
>
        <nav className="flex flex-col gap-2 p-6" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.hasDropdown ? (
                <div>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href!}
                      className="flex-1 text-sm lg:text-base font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
                      prefetch={false}
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      onClick={toggleMobileAbout}
                      aria-label={isMobileAboutOpen ? "Collapse About Us menu" : "Expand About Us menu"}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isMobileAboutOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {isMobileAboutOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block text-sm text-gray-600 hover:text-primary-600 transition-colors py-1"
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
                  className="block text-sm lg:text-base font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
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
