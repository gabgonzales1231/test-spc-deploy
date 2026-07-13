//src/components/city-government/DepartmentsSection.tsx

"use client";

import React from "react";
import {
  Building2,
  Users,
  Heart,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import InfoCard from "@/components/city-government/InfoCard";
import { Department } from "@/components/city-government/types";

const keyDepartments: Department[] = [
  {
    name: "City Planning & Development Office",
    icon: Building2,
    description: "Urban planning, zoning, and development coordination",
    color: "emerald",
    head: { email: "--", contact: "--" },
  },
  {
    name: "City Health Office",
    icon: Heart,
    description: "Public health services and healthcare programs",
    color: "emerald",
    head: { email: "--", contact: "--" },
  },
  {
    name: "City Social Welfare Office",
    icon: Users,
    description: "Social services and community welfare programs",
    color: "emerald",
    head: { email: "--", contact: "-" },
  },
  {
    name: "City Education Office",
    icon: GraduationCap,
    description: "Educational programs and school administration",
    color: "emerald",
    head: { email: "--", contact: "--" },
  },
  {
    name: "City Engineer's Office",
    icon: Building2,
    description: "Infrastructure development and maintenance",
    color: "emerald",
    head: { email: "--", contact: "--" },
  },
  {
    name: "City Treasurer's Office",
    icon: Briefcase,
    description: "Financial management and revenue collection",
    color: "emerald",
    head: { email: "--", contact: "--" },
  },
];

export default function DepartmentsSection() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {keyDepartments.map((dept, index) => (
        <InfoCard key={index} dept={dept} />
      ))}
    </div>
  );
}