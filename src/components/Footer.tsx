"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type FooterLink = {
  href: string;
  label: string;
};

type FooterSectionProps = {
  title: string;
  links?: FooterLink[];
  linkClassName?: string;
  children?: React.ReactNode;
};

const FooterSection = ({ title, links, linkClassName, children }: FooterSectionProps) => (
  <div className="flex flex-col items-start min-w-0">
    <h3 className="text-white font-semibold mb-3 text-md">{title}</h3>
    {links && (
      <ul className="space-y-1 text-sm text-left">
        {links.map(({ href, label }) => (
          <li key={label}>
            <Link
              href={href}
              className={`text-emerald-200 hover:text-primary-400 transition-colors break-words ${
                linkClassName ?? ""
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    )}
    {children}
  </div>
);

type RepublicNoticeProps = {
  className?: string;
};

const RepublicNotice = ({ className }: RepublicNoticeProps) => {
  return (
    <div className={`flex flex-col items-start min-w-0 w-full max-w-[190px] lg:max-w-[220px] xl:max-w-[260px] ${className ?? ""}`}>
      <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wide break-words">
        Republic of the Philippines
      </h3>
      <p className="text-emerald-200 text-xs tracking-tight leading-tight md:text-sm md:tracking-normal md:leading-relaxed break-words">
        All content is in the public domain unless otherwise stated.
      </p>
    </div>
  );
};

export default function Footer() {
  const pathname = usePathname();
  const isHidden = pathname.startsWith("/arta/citizens-charter/view");

  const cityLinks: FooterLink[] = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/about-us", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/transparency", label: "Transparency" },
    { href: "/forms", label: "Forms" },
    { href: "/arta/citizens-charter", label: "Citizen's Charter" },
  ];

  const govLinks: FooterLink[] = [
    { href: "https://op-proper.gov.ph/", label: "Office of the President" },
    { href: "https://main.ovp.gov.ph/", label: "Office of the Vice President" },
    { href: "http://www.senate.gov.ph/", label: "Senate of the Philippines" },
    { href: "http://www.congress.gov.ph/", label: "House of Representatives" },
    { href: "http://sc.judiciary.gov.ph/", label: "Supreme Court" },
    { href: "http://ca.judiciary.gov.ph/", label: "Court of Appeals" },
    { href: "http://sb.judiciary.gov.ph/", label: "Sandiganbayan" },
  ];

  const govphLinks: FooterLink[] = [
    { href: "https://e.gov.ph", label: "eGov Website" },
    {
      href: "https://apps.apple.com/ph/app/egovph/id6447682225",
      label: "Download Apple app",
    },
    {
      href: "https://play.google.com/store/apps/details?id=egov.app&hl=en_US",
      label: "Download Android app",
    },
  ];

  if (isHidden) return null;

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="footerGrid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="white"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#footerGrid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-16 h-16 bg-primary-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-primary-300 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
        {/* ===================== MOBILE LAYOUT ===================== */}
        <div className="md:hidden px-4 overflow-x-hidden">
          {/* Brand Header: logos row, then seal + title inline */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
              <Image
                src="/Logo-Bagong-Pilipinas.png"
                alt="Bagong Pilipinas Logo"
                width={48}
                height={32}
                className="w-10 h-auto sm:w-[60px]"
                loading="lazy"
              />
              <Image
                src="/-transparency-seal-.png"
                alt="City of San Pablo Logo"
                width={48}
                height={32}
                className="w-10 h-auto sm:w-[60px]"
                loading="lazy"
              />
              <Image
                src="/republic-ph-logo.png"
                alt="Republic of the Philippines Logo"
                width={48}
                height={32}
                className="w-10 h-auto sm:w-[60px]"
                loading="lazy"
              />
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/seal.webp"
                alt="City of San Pablo Official Seal"
                width={90}
                height={90}
                className="w-16 h-16 sm:w-[90px] sm:h-[90px] shrink-0"
                loading="lazy"
              />
              <div className="text-left min-w-0">
                <p className="text-white font-semibold text-lg sm:text-xl leading-tight uppercase break-words">
                  City Government of San Pablo
                </p>
                <p className="text-emerald-200 font-light text-sm uppercase tracking-wide">
                  Official Website
                </p>
              </div>
            </div>
          </div>

          {/* Row: SPC Quick Links | Government Links */}
          <div className="grid grid-cols-2 mb-10 min-w-0">
            <FooterSection title="SPC Quick Links" links={cityLinks} />
            <FooterSection
              title="Government Links"
              links={govLinks}
              linkClassName="text-xs tracking-tight leading-tight whitespace-nowrap"
            />
          </div>

          {/* Row: eGOV PH | Republic notice */}
          <div className="grid grid-cols-2 mb-2 min-w-0">
            <FooterSection
              title="eGOV PH"
              links={govphLinks}
              linkClassName="text-xs tracking-tight leading-tight"
            />
            <RepublicNotice />
          </div>
        </div>

        {/* ===================== DESKTOP LAYOUT ===================== */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col items-start pr-4 md:pr-6 lg:pr-8 min-w-0">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-1.5 md:gap-2 mb-3">
                <Image
                  src="/Logo-Bagong-Pilipinas.png"
                  alt="Bagong Pilipinas Logo"
                  width={60}
                  height={40}
                  className="w-8 md:w-9 lg:w-[52px] xl:w-[60px] h-auto"
                  loading="lazy"
                />
                <Image
                  src="/-transparency-seal-.png"
                  alt="City of San Pablo Logo"
                  width={60}
                  height={40}
                  className="w-8 md:w-9 lg:w-[52px] xl:w-[60px] h-auto"
                  loading="lazy"
                />
                <Image
                  src="/republic-ph-logo.png"
                  alt="Republic of the Philippines Logo"
                  width={60}
                  height={40}
                  className="w-8 md:w-9 lg:w-[52px] xl:w-[60px] h-auto"
                  loading="lazy"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-white font-semibold text-sm leading-tight uppercase">
                  City Government of San Pablo
                </p>
                <p className="text-emerald-200 text-xs uppercase tracking-wide">
                  Official Website
                </p>
              </div>

              <Image
                src="/seal.webp"
                alt="City of San Pablo Official Seal"
                width={110}
                height={110}
                className="w-20 md:w-24 lg:w-[90px] xl:w-[110px] h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* SPC Quick Links */}
          <FooterSection title="SPC Quick Links" links={cityLinks} />

          {/* Government Links */}
          <FooterSection title="Government Links" links={govLinks} />

          {/* eGOV PH — configured independently from Republic Notice below */}
          <div className="flex flex-col items-start min-w-0">
            <FooterSection title="eGOV PH" links={govphLinks} />
            {/* Republic Notice — its own instance/props, edit here without touching eGOV PH above */}
            <RepublicNotice className="mt-6" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-700 pt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-emerald-200 text-sm">
            &copy; {new Date().getFullYear()} City Government of San Pablo. All rights reserved.
          </p>
          <div className="flex flex-row gap-4 md:gap-6 text-sm justify-center">
            <Link
              href="/privacy-policy"
              className="text-emerald-200 hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-emerald-200 hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="text-emerald-200 hover:text-primary-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}