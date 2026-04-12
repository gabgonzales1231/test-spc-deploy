import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Props {
  title: string;
  description: string;
  date: string;
  status: string;
}

export default function OrdinanceCard({ title, description, date, status }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          {status}
        </span>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href="/ordinances"
        className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium text-sm"
      >
        Read Full Text
        <ExternalLink className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );
}
