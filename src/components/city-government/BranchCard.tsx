import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Branch } from "./types";

export default function BranchCard({ branch }: { branch: Branch }) {
  const Icon = branch.icon;
  return (
    <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border border-emerald-200/30 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{branch.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <p className="text-gray-700 mb-4">{branch.description}</p>
        <div className="space-y-2">
          {branch.offices.map((office, index) => (
            <div
              key={index}
              className="flex items-center text-sm text-gray-600"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
              {office}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
