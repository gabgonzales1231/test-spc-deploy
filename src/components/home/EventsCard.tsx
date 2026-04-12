import { Calendar, Clock, MapPin } from "lucide-react";

interface Props {
  title: string;
  date: string;
  time: string;
  location: string;
}

export default function EventCard({ title, date, time, location }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="bg-emerald-100 p-3 rounded-xl">
          <Calendar className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
          <div className="text-sm text-emerald-600 font-medium mt-2">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
