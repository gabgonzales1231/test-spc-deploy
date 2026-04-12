import React, { ReactElement } from "react";

export default function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: ReactElement | undefined;
}) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-5xl text-green-600">{icon}</div>
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
      </div>
      <p className="text-xl text-gray-600">{subtitle}</p>
    </div>
  );
}