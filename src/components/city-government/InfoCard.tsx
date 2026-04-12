import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import IconBadge from "./IconBadge";
import { Department } from "./types";

export default function InfoCard({ dept }: { dept: Department }) {
  const Icon = dept.icon;
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/30 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <IconBadge icon={Icon} color={dept.color} />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{dept.name}</h4>
            <p className="text-gray-600 text-sm">{dept.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
