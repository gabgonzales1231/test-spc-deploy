import React from "react";

export default function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-12 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
