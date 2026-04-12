import React from "react";

export default function IconBadge({
  icon: Icon,
  color,
  rounded = "xl",
  size = "12",
}: {
  icon: React.ElementType;
  color: string;
  rounded?: string;
  size?: string;
}) {
  return (
    <div
      className={`w-${size} h-${size} bg-${color}-100 rounded-${rounded} flex items-center justify-center group-hover:bg-${color}-200 transition-colors`}
    >
      <Icon className={`w-6 h-6 text-${color}-600`} />
    </div>
  );
}
