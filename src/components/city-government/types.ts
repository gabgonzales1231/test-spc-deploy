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
};

export type Contact = {
  title: string;
  icon: React.ElementType;
  lines: string[];
};
