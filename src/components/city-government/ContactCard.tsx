import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Contact } from "./types";
import ContactUsButton from "@/components/city-government/ContactUsButton";

export default function ContactCard({ contact }: { contact: Contact }) {
  const Icon = contact.icon;
  return (
    <Card className="bg-white/80 border border-emerald-200/30 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{contact.title}</h3>
        {contact.lines.map((line, index) => (
          <p key={index} className="text-gray-600">
            {line}
          </p>
        ))}
        <ContactUsButton />
      </CardContent>
    </Card>
  );
}
