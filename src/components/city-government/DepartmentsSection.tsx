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
    head: { name: "Engr. Juan Dela Cruz", contact: "(049) 521-0001" },
  },
  {
    name: "City Health Office",
    icon: Heart,
    description: "Public health services and healthcare programs",
    color: "red",
    head: { name: "Dr. Maria Santos", contact: "(049) 521-0002" },
  },
  {
    name: "City Social Welfare Office",
    icon: Users,
    description: "Social services and community welfare programs",
    color: "blue",
    head: { name: "Ms. Ana Reyes", contact: "(049) 521-0003" },
  },
  {
    name: "City Education Office",
    icon: GraduationCap,
    description: "Educational programs and school administration",
    color: "purple",
    head: { name: "Dr. Pedro Lim", contact: "(049) 521-0004" },
  },
  {
    name: "City Engineer's Office",
    icon: Building2,
    description: "Infrastructure development and maintenance",
    color: "orange",
    head: { name: "Engr. Rico Bautista", contact: "(049) 521-0005" },
  },
  {
    name: "City Treasurer's Office",
    icon: Briefcase,
    description: "Financial management and revenue collection",
    color: "green",
    head: { name: "Ms. Luz Fernandez", contact: "(049) 521-0006" },
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