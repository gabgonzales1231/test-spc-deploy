import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import { officials, Officialnterface } from '@/data/officials';

function OfficialCard({ official }: { official: Officialnterface }) {
  const isMayor = official.position === "City Mayor";

  return (
    <Card
      className={`group relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border border-emerald-200/30 hover:border-emerald-300/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 
      ${isMayor ? "p-8 scale-105 max-w-4xl" : "p-4"}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-300/20 to-transparent rounded-full translate-y-12 -translate-x-12" />

      <CardHeader className="relative p-4 pb-2">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative mb-3">
            <div
              className={`rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1 group-hover:from-emerald-500 group-hover:to-emerald-700 transition-all duration-300 ${
                isMayor ? "w-56 h-56" : "w-48 h-48"
              }`}
            >
              <Image
                src={official.image}
                alt={official.name}
                className="w-full h-full rounded-full object-cover border-2 border-white"
                // w-56 = 224px, w-48 = 192px — provide 2× for retina displays
                width={isMayor ? 224 : 192}
                height={isMayor ? 224 : 192}
                loading="lazy"
              />
            </div>
          </div>

          {/* Name and Position */}
          <h3 className={`font-bold text-gray-900 mb-1 group-hover:text-emerald-900 transition-colors ${isMayor ? "text-xl md:text-2xl" : "text-xl"}`}>
            {official.name}
          </h3>
          <p className={`text-emerald-700 font-semibold mb-1 group-hover:text-emerald-800 ${isMayor ? "text-xl" : "text-base"}`}>
            {official.position}
          </p>
          <div className={`flex items-center text-gray-600 ${isMayor ? "text-lg" : "text-sm"}`}>
            <Users className={`mr-2 text-emerald-600 ${isMayor ? "w-6 h-6" : "w-4 h-4"}`} />
            {official.department}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center px-6 pb-6">
        {/* Description */}
        <p className="text-gray-700 text-sm text-center mb-4 leading-relaxed">
          {official.description}
        </p>

               {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center group/item">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-emerald-200 transition-colors">
              <Mail className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-sm text-gray-900 truncate font-medium">{official.email}</p>
            </div>
          </div>

          <div className="flex items-center group/item">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-emerald-200 transition-colors">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Phone</p>
              <p className="text-sm text-gray-900 font-medium">{official.phone}</p>
            </div>
          </div>
        </div>

        
        
      </CardContent>
    </Card>
  );
}

export default function OfficialsProfileCards() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />

        {/* Header */}
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <MapPin className="w-4 h-4 mr-2" />
            City of San Pablo, Laguna
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Local Officials
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Meet the dedicated leaders serving the City of San Pablo, working together to build a
            better future for our community and constituents.
          </p>
        </div>
      </section>

      {/* Officials Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16">
        {officials.map((official) => (
          <div
            key={official.id}
            className={
              official.position === "City Mayor"
                ? "md:col-span-2 lg:col-span-3 flex justify-center"
                : ""
            }
          >
            <OfficialCard official={official} />
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center py-12">
        <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200/30">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
          <p className="text-sm text-gray-600">
            For official inquiries, please contact the respective offices during business hours
          </p>
        </div>
      </div>
    </div>
  );
}