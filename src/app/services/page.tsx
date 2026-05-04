"use client";

import { useState } from "react";
import {
  Building2,
  FileText,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Landmark,
  Shield,
  Home,
  TreePine,
  Zap,
  Droplet,
  Car,
  Phone,
  ExternalLink,
  ChevronRight,
  Lock,
  VenusAndMars,
} from "lucide-react";

interface ServiceCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string;
  category: string;
  available: boolean;
}
const ServiceCard = ({
  icon: Icon,
  title,
  description,
  link,
  category,
  available = true,
}: ServiceCardProps) => {
  if (!available) {
    return (
      <div
        id={title}
        className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 cursor-not-allowed overflow-hidden opacity-75 hover:opacity-85 transition-opacity"
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
              <Icon className="w-7 sm:w-8 h-7 sm:h-8 text-gray-500" />
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1 min-w-0">
            {/* Header with Title and Lock Icon */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-600 leading-snug">
                {title}
              </h3>
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>

            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full mb-3">
              {category}
            </span>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-4">
              {description}
            </p>

            {/* Coming Soon Label */}
            <div className="hidden sm:flex items-center gap-2 text-gray-500 font-medium">
              <span className="text-sm">Coming Soon</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Coming Soon Badge - Mobile positioned */}
            <div className="mt-4 sm:hidden">
              <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      id={title}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 sm:p-8 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0">
          {/* Header with Title and External Link Icon */}
          <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
              {title}
            </h3>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1" />
          </div>

          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full mb-3">
            {category}
          </span>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2 text-emerald-600 font-medium group-hover:gap-3 transition-all">
            <span className="text-xs sm:text-sm">Access Service</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default function SanPabloServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Government",
    "Public Safety",
    "Health & Welfare",
    "Education",
    "Business",
    "Utilities",
    "Transportation",
  ];

  const services = [
    {
      icon: Landmark,
      title: "Real Property Information System",
      description:
        "Calculate your taxes and view your property information - no account required.",
      link: "https://realpropertytax.sanpablocity.gov.ph",
      category: "Business",
      available: true,
    },
    {
      icon: FileText,
      title: "Business Permits & Licensing",
      description:
        "Apply for business permits, renewals, and licenses. Fast-track processing for new business registrations and renewals.",
      link: "https://bplo.sanpablocity.gov.ph",
      category: "Business",
      available: true,
    },
    {
      icon: Briefcase,
      title: "E-Government Services",
      description:
        "Essentially providing the Filipino access to an online one-stop shop giving a variety of LGU System Automation.",
      link: "https://elgu-city-of-san-pablo-laguna.e.gov.ph",
      category: "Business",
      available: true,
    },
    {
      icon: Droplet,
      title: "San Pablo City Water District",
      description:
        "Providing potable, adequate and affordable water supply in the entire city while remaining to be self reliant and financially viable water district.",
      link: "https://www.spcwd.org.ph",
      category: "Utilities",
      available: true,
    },
    {
      icon: VenusAndMars,
      title: "Gender and Development",
      description:
        "Access to credit, savings, insurance, and other financial products and services among unserved and underserved low-income and marginalized women",
      link: "https://www.sanpablocitygad.com",
      category: "Health & Welfare",
      available: false,
    },
    {
      icon: Users,
      title: "Civil Registry Services",
      description:
        "Birth certificates, marriage licenses, death certificates, and other civil registry documents.",
      link: "#",
      category: "Government",
      available: false,
    },
    {
      icon: Briefcase,
      title: "Employment Services",
      description:
        "Job placement assistance, livelihood programs, and skills training opportunities for residents.",
      link: "#",
      category: "Business",
      available: false,
    },
    {
      icon: Heart,
      title: "Health Services",
      description:
        "Access to city health centers, medical assistance programs, and health insurance enrollment.",
      link: "#",
      category: "Health & Welfare",
      available: false,
    },
    {
      icon: GraduationCap,
      title: "Education Programs",
      description:
        "Scholarship programs, educational assistance, and public school enrollment information.",
      link: "#",
      category: "Education",
      available: false,
    },
    {
      icon: Landmark,
      title: "Tax Services",
      description:
        "Real property tax payments, tax clearances, and assessment services for property owners.",
      link: "#",
      category: "Government",
      available: false,
    },
    {
      icon: Shield,
      title: "Police & Security",
      description:
        "Police assistance, crime reporting, community safety programs, and emergency response.",
      link: "#",
      category: "Public Safety",
      available: false,
    },
    {
      icon: Home,
      title: "Housing & Urban Development",
      description:
        "Housing programs, building permits, zoning clearances, and urban development plans.",
      link: "#",
      category: "Government",
      available: false,
    },
    {
      icon: TreePine,
      title: "Environmental Services",
      description:
        "Waste management, tree planting programs, and environmental protection initiatives.",
      link: "#",
      category: "Government",
      available: false,
    },
    {
      icon: Zap,
      title: "Electrical Services",
      description:
        "Electric service applications, billing inquiries, and power outage reporting.",
      link: "#",
      category: "Utilities",
      available: false,
    },
    {
      icon: Car,
      title: "Transportation Services",
      description:
        "Public transportation information, traffic management, and vehicle registration assistance.",
      link: "#",
      category: "Transportation",
      available: false,
    },
    {
      icon: Heart,
      title: "Social Welfare Programs",
      description:
        "Senior citizen benefits, persons with disability assistance, and social amelioration programs.",
      link: "#",
      category: "Health & Welfare",
      available: false,
    },
    {
      icon: Phone,
      title: "Emergency Hotlines",
      description:
        "24/7 emergency response hotlines, disaster management, and rescue operations.",
      link: "#",
      category: "Public Safety",
      available: false,
    },
    {
      icon: Building2,
      title: "City Planning & Development",
      description:
        "Comprehensive land use plans, infrastructure projects, and community development programs.",
      link: "#",
      category: "Government",
      available: false,
    },
  ];

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Public Services Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            City Services
            <br />& Programs
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Access government services, apply for permits, and connect with city
            programs designed to serve the community of San Pablo City.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                15+
              </div>
              <div className="text-gray-600">Available Services</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Emergency Response</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                100%
              </div>
              <div className="text-gray-600">Committed to Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Need Assistance?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Our dedicated team is here to help you navigate our services and
              answer any questions you may have.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#"
  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-chat")); }}
  className="px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
>
  Contact Us
</a>

 <a href="#"
  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-chat")); }}
  className="px-8 py-4 bg-emerald-500/20 text-white rounded-full font-semibold hover:bg-emerald-500/30 transition-all duration-300 border border-white/30"
>
  View FAQs
</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
