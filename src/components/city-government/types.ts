import React from "react";

export type Stat = {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
};

export type Branch = {
  title: string;
  icon: React.ElementType;
  description: string;
  offices: string[];
};

export type Department = {
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  head?: {
    email: string;
    contact: string;
  };
};

export type Contact = {
  title: string;
  icon: React.ElementType;
  lines: string[];
};

/* -------------------- Sector grouping (new) -------------------- */

export type SectorId =
  | "social"
  | "economic"
  | "infrastructure"
  | "environment"
  | "institutional"
  | "legislative";

export type DepartmentOffice = {
  name: string;
  head: string;
  email: string;
  contactNo?: string | null;
  address: string;
};

export type SectorGroup = {
  id: SectorId;
  label: string;
  icon: React.ElementType;
  offices: DepartmentOffice[];
};