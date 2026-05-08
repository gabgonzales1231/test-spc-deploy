import Link from "next/link";
import Image from "next/image";
type FooterLink = {
  href: string;
  label: string;
};

type FooterSectionProps = {
  title: string;
  links?: FooterLink[];
  children?: React.ReactNode;
};

const FooterSection = ({ title, links, children }: FooterSectionProps) => (
  <div className="flex flex-col items-start">
    <h3 className="text-white font-semibold mb-3">{title}</h3>
    {links && (
      <ul className="space-y-1 text-sm text-left">
        {links.map(({ href, label }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-emerald-200 hover:text-primary-400 transition-colors"
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

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors">
    {children}
  </div>
);

export default function Footer() {
  const cityLinks: FooterLink[] = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/about-us", label: "About Us" },
    { href: "/disclosure-portal", label: "Discloure Portal" },
    { href: "/forms", label: "Forms" },
    { href: "/publications", label: "Publications" },
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
    { href: "https://e.gov.ph", label: " eGov Website" },
    {
      href: "https://apps.apple.com/ph/app/egovph/id6447682225",
      label: "Download Apple app",
    },
    {
      href: "https://play.google.com/store/apps/details?id=egov.app&hl=en_US",
      label: "Download Android app",
    },
  ];

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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1 flex flex-col items-start">
            <div className="flex items-center mb-3">
              <Image
              src="/seal.webp"
                alt="City of San Pablo Logo"
                width={64}
                height={64}
                loading="lazy"
              />
              <span className="ml-2 text-2xl font-bold">City of San Pablo</span>
            </div>
            {/*      <p className="text-emerald-200 mb-4 text-sm leading-relaxed">
              Efficient, transparent, and people-first governance.
            </p>
     <div className="flex space-x-4">
              <SocialIcon>
                <IconBrandFacebook className="w-6 h-6 text-white" />
              </SocialIcon>
              <SocialIcon>
                <IconBrandX className="w-6 h-6 text-white" />
              </SocialIcon>
              <SocialIcon>
                <IconBrandInstagram className="w-6 h-6 text-white" />
              </SocialIcon>
            </div> */}
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 col-span-1 md:col-span-3">
            {/* Left Column - City Government Links */}
            <div>
              <FooterSection title="City Government links" links={cityLinks} />
            </div>

            {/* Right Column - Government Links (Mobile) / Second Column (Desktop) */}
            <div className="md:hidden">
              <FooterSection title="Government Links" links={govLinks} />
            </div>

            <div className="hidden md:block">
              <FooterSection title="Government Links" links={govLinks} />
            </div>

            {/* GOVPH Links - Full Width Mobile / Third Column Desktop */}
            <div className="col-span-2 md:col-span-1 ">
              <FooterSection title="eGOV PH" links={govphLinks} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-700 pt-6 grid grid-cols-1 flex justify-center md:flex md:justify-between md:items-center gap-2 text-left">
          <p className="text-emerald-200 text-sm text-center">
            &copy; {new Date().getFullYear()} City Government of San Pablo City
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
