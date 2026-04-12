"use client"

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Scale, 
  Briefcase, 
  Award, 
  DollarSign,
  Calendar,
  Building2,
  Users
} from 'lucide-react';

export default function FullDisclosurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Transparency & Accountability
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Full Disclosure Portal
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            In compliance with the Full Disclosure Policy, we provide transparent access to 
            government documents, financial records, and legislative proceedings.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
          <CardContent className="p-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                <FileText className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                The Full Disclosure Portal is currently under development. We&apos;re working to bring you 
                comprehensive access to government documents, financial records, and legislative proceedings.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                  <Scale className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">City Ordinances</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Resolutions</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Executive Orders</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                  <Award className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Bids & Awards</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-emerald-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Financial Aid</span>
                </div>
              </div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg shadow-lg">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">Expected Launch: Q4 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Document Request
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                Need access to other government documents? Submit a formal request through our Freedom of Information office.
              </p>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Submit Request
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Contact Information
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                For questions or clarifications about any disclosed information, contact our Records Office.
              </p>
              <div className="text-sm text-gray-600">
                <p>Phone: (049) 562-1234 ext. 205</p>
                <p>Email: records@sanpablocity.gov.ph</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200/30">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
            <p className="text-sm text-gray-600">
              Portal under development. Check back soon for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}