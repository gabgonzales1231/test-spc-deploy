//src/data/service.ts

import { LucideIcon, FileText, Landmark, Briefcase } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  locked?: boolean;
}

export const servicesData: Service[] = [
  {
    icon: Landmark,
    title: "Real Property Information System",
    description:
      "Calculate your taxes and view your property information - no account required.",
    link: "https://realpropertytax.sanpablocity.gov.ph",
    locked: true,
  },
  // {
  //   icon: FileText,
  //   title: "Business Permits & Licensing",
  //   description:
  //     "Apply for business permits, renewals, and licenses. Fast-track processing for new business registrations and renewals.",
  //   link: "https://bplo.sanpablocity.gov.ph",
  // },

  {
    icon: Briefcase,
    title: "E-Government Services",
    description:
      "Essentially providing the Filipino access to an online one-stop shop giving a variety of LGU System Automation.",
    link: "https://elgu-city-of-san-pablo-laguna.e.gov.ph",
  },
];
