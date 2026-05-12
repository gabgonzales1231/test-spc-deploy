import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  Scale,
  Heart,
  MapPin,
  Calendar,
  Award,
  Phone,
  Mail,
  Clock,
  Shield,
  Briefcase,
  GraduationCap,
} from "lucide-react";

import Section from "@/components/city-government/Section";
import SectionHeader from "@/components/city-government/SectionHeader";
import IconBadge from "@/components/city-government/IconBadge";

import BranchCard from "@/components/city-government/BranchCard";
import ContactCard from "@/components/city-government/ContactCard";
import DepartmentsSection from "@/components/city-government/DepartmentsSection";


import {
  Stat,
  Branch,

  Contact,
} from "@/components/city-government/types";

/* -------------------- Data -------------------- */
const cityStats: Stat[] = [
  { label: "Population", value: "285,348", icon: Users, color: "emerald" },
  { label: "Land Area", value: "197.56 km²", icon: MapPin, color: "blue" },
  { label: "Barangays", value: "80", icon: Building2, color: "purple" },
  { label: "Established", value: "1940", icon: Calendar, color: "orange" },
];

const governmentBranches: Branch[] = [
  {
    title: "Executive Branch",
    icon: Briefcase,
    description:
      "Led by the City Mayor, responsible for implementing policies and managing city operations",
    offices: [
      "Office of the Mayor",
      "City Administrator",
      "Department Heads",
      "City Planning Office",
    ],
  },
  {
    title: "Legislative Branch",
    icon: Scale,
    description:
      "Sangguniang Panglungsod (City Council) creates local laws and ordinances",
    offices: [
      "Vice Mayor's Office",
      "City Councilors",
      "Sanggunian Secretariat",
      "Committee Offices",
    ],
  },
  {
    title: "Judicial Branch",
    icon: Shield,
    description:
      "Local courts ensuring justice and law enforcement within the city",
    offices: [
      "Municipal Trial Court",
      "Regional Trial Court",
      "Prosecutor's Office",
      "Public Attorney's Office",
    ],
  },
];


const achievements: string[] = [
  "Seal of Good Local Governance (SGLG) Recipient",
  "Outstanding LGU in Tourism Development",
  "Most Business-Friendly City in Laguna",
  "Clean and Green City Award",
  "Digital Transformation Excellence",
];

const contacts: Contact[] = [
  {
    title: "Phone",
    icon: Phone,
    lines: ["(049) 5210307", "(049) 5035783"],
  },
  {
    title: "Email",
    icon: Mail,
    lines: ["info@sanpablocity.gov.ph"],
  },
  {
    title: "Office Hours",
    icon: Clock,
    lines: ["Mon - Fri: 8:00 AM - 5:00 PM"],
  },
];

/* -------------------- Main Page -------------------- */
export default function CityGovernmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Local Government Unit
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            City Government of
            <br />
            San Pablo
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Committed to serving our constituents with integrity, transparency,
            and excellence in public service for a progressive and sustainable
            San Pablo City.
          </p>
        </div>
      </section>

      {/* City Statistics */}
      <Section className="-mt-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cityStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <IconBadge icon={stat.icon} color={stat.color} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Government Branches */}
      <Section className="bg-white/50 backdrop-blur-sm">
        <SectionHeader
          title="Branches of Government"
          subtitle="Three co-equal branches working together for effective governance"
          icon={undefined}
        />
        <div className="grid md:grid-cols-3 gap-8">
          {governmentBranches.map((branch, index) => (
            <BranchCard key={index} branch={branch} />
          ))}
        </div>
      </Section>

      {/* Key Departments */}
<Section>
  <SectionHeader
    title="Key Departments"
    subtitle="Essential services delivered through various city departments"
    icon={undefined}
  />
  <DepartmentsSection />
</Section>

      {/* Achievements */}
      <Section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white-900 mb-4">
            Recent Achievements
          </h2>
          <p className="text-xl text-white-600">
            Recognition of our commitment to excellence in governance
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/80 transition-all duration-300"
            >
              <CardContent className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="font-semibold text-gray-100">{achievement}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact Information */}
      <Section className="bg-white/70 backdrop-blur-sm">
        <SectionHeader
          title="Get in Touch"
          subtitle="We're here to serve you"
          icon={undefined}
        />
        <div className="grid md:grid-cols-3 gap-8">
          {contacts.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>
      </Section>
    </div>
  );
}
