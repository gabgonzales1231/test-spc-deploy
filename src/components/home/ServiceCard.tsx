// src/components/home/ServiceCard.tsx

import { ArrowRight, Lock, LucideIcon } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  locked?: boolean;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  link,
  locked = false,
}: ServiceCardProps) => {
  const content = (
    <div
      className="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl 
             transition-all transform hover:-translate-y-1 h-full flex flex-col relative overflow-hidden"
    >
      {locked && (
        <div className="absolute inset-0 bg-gray-100/50 backdrop-grayscale z-10 flex items-center justify-center rounded-xl">
          
        </div>
      )}

      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
      </div>

      <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
        {title}
      </h4>

      <p className="text-gray-600 text-sm mb-6 flex-grow">{description}</p>

      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mt-auto pt-3 border-t border-gray-100 group-hover:text-emerald-700 transition-all">
        Access Service
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );

  if (locked) {
    return <div className="cursor-not-allowed h-full">{content}</div>;
  }

  return (
    <Link href={link} className="h-full cursor-pointer">
      {content}
    </Link>
  );
};

export default ServiceCard;