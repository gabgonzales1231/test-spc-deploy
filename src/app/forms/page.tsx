//spc-website\src\app\forms\page.tsx
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  FileDown, Building2, Search, ChevronDown, ChevronUp,
  ExternalLink, Scale, Store, MapPin, Users, Heart, FileText
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FormCategory =
  | 'business-permits'
  | 'city-planning'
  | 'building-official'
  | 'civil-society'
  | 'senior-citizens';

interface FormDocument {
  id: string;
  title: string;
  file_url?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { id: FormCategory; label: string; icon: React.ElementType }[] = [
  { id: 'business-permits', label: 'Business Permits & Licensing', icon: Store     },
  { id: 'city-planning',    label: 'City Planning & Development',  icon: MapPin    },
  { id: 'building-official',label: 'Building Official',            icon: Building2 },
  { id: 'civil-society',    label: 'Civil Society Organizations',  icon: Users     },
  { id: 'senior-citizens',  label: 'Senior Citizens Affairs',      icon: Heart     },
];

// ─── Placeholder data (replace with real API hook) ────────────────────────────

const PLACEHOLDER_FORMS: Record<FormCategory, Record<number, FormDocument[]>> = {
  'business-permits': {
    2025: [
      { id: 'bp-1', title: 'Business Permit Application Form', file_url: '#' },
      { id: 'bp-2', title: 'Business Permit Renewal Form', file_url: '#' },
      { id: 'bp-3', title: 'Certificate of Business Registration Request', file_url: '#' },
    ],
    2024: [
      { id: 'bp-4', title: 'Business Permit Application Form (2024)', file_url: '#' },
    ],
  },
  'city-planning': {
    2025: [
      { id: 'cp-1', title: 'Zoning Clearance Application', file_url: '#' },
      { id: 'cp-2', title: 'Land Use Conversion Request Form', file_url: '#' },
    ],
    2024: [
      { id: 'cp-3', title: 'Subdivision Development Application', file_url: '#' },
    ],
  },
  'building-official': {
    2025: [
      { id: 'bo-1', title: 'Building Permit Application Form', file_url: '#' },
      { id: 'bo-2', title: 'Electrical Permit Application', file_url: '#' },
      { id: 'bo-3', title: 'Sanitary/Plumbing Permit Form', file_url: '#' },
      { id: 'bo-4', title: 'Certificate of Occupancy Request', file_url: '#' },
    ],
    2024: [
      { id: 'bo-5', title: 'Demolition Permit Application (2024)', file_url: '#' },
    ],
  },
  'civil-society': {
    2025: [
      { id: 'cs-1', title: 'CSO Accreditation Application Form', file_url: '#' },
      { id: 'cs-2', title: 'CSO Renewal of Accreditation', file_url: '#' },
    ],
    2024: [],
  },
  'senior-citizens': {
    2025: [
      { id: 'sc-1', title: 'Senior Citizen ID Application', file_url: '#' },
      { id: 'sc-2', title: 'OSCA Registration Form', file_url: '#' },
      { id: 'sc-3', title: 'Social Pension Program Application', file_url: '#' },
    ],
    2024: [
      { id: 'sc-4', title: 'Senior Citizen Benefits Claim Form (2024)', file_url: '#' },
    ],
  },
};

// ─── Year Accordion ───────────────────────────────────────────────────────────

function YearAccordion({
  year,
  docs,
  isOpen,
  onToggle,
  categoryLabel,
}: {
  year: number;
  docs: FormDocument[];
  isOpen: boolean;
  onToggle: () => void;
  categoryLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 text-left bg-emerald-50 border-b border-emerald-100 hover:bg-emerald-100/60 transition-colors"
      >
        <span className="text-base font-semibold text-gray-700 uppercase tracking-wide">
          {year} {categoryLabel}
        </span>
        {isOpen
          ? <ChevronUp   className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
      </button>

      {isOpen && (
        <div className="bg-white">
          {docs.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400">No forms available.</div>
          ) : (
            docs.map((doc, idx) => (
              <div
                key={doc.id}
                className={`flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-50 group transition-colors hover:bg-emerald-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <FileDown className="mt-0.5 w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {doc.file_url ? (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-800 hover:text-emerald-700 hover:underline underline-offset-2 leading-snug transition-colors inline-flex items-start gap-1"
                    >
                      {doc.title}
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </a>
                  ) : (
                    <span className="text-base text-gray-800 leading-snug">{doc.title}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FormsPage() {
  const [activeCategory, setActiveCategory] = useState<FormCategory>('business-permits');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [openYears,      setOpenYears]      = useState<Record<number, boolean>>({ 2025: true });

  // Swap these lines with a real API hook when ready:
  const categoryData = PLACEHOLDER_FORMS[activeCategory] ?? {};
  const availableYears = Object.keys(categoryData).map(Number).sort((a, b) => b - a);

  const filteredDocs = (year: number) => {
    const docs = categoryData[year] ?? [];
    if (!searchQuery.trim()) return docs;
    return docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const toggleYear = (year: number) =>
    setOpenYears(prev => ({ ...prev, [year]: !prev[year] }));

  const handleCategoryChange = (id: FormCategory) => {
    setActiveCategory(id);
    setOpenYears({ 2025: true });
    setSearchQuery('');
  };

  const activeLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

      {/* Hero */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4 mr-2" />
            Forms Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Downloadable Forms</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Public Forms &amp; Documents – City of San Pablo aligned with major offices
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-3 border-b-2 border-gray-200">
            Downloadable Forms
          </h2>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = id === activeCategory;
              return (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center gap-2
                    ${active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span className="leading-snug">{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileDown className="w-6 h-6 text-emerald-600" />
                  {activeLabel}
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search forms…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-6">
              {availableYears.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <FileDown className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No forms available yet.</p>
                </div>
              ) : (
                availableYears.map(year => (
                  <YearAccordion
                    key={year}
                    year={year}
                    docs={filteredDocs(year)}
                    isOpen={!!openYears[year]}
                    onToggle={() => toggleYear(year)}
                    categoryLabel={activeLabel}
                  />
                ))
              )}

              {searchQuery && availableYears.every(y => filteredDocs(y).length === 0) && (
                <div className="text-center py-16 text-gray-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No forms matched your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Footer cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mt-4 grid md:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Need a Different Form?
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                Can&apos;t find the form you need? Visit or contact the respective office directly for assistance.
              </p>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Contact an Office
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                Contact Information
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                For queries and form-related assistance, contact the City Hall main office.
              </p>
              <div className="text-sm text-gray-600">
                <p>Phone: (049) 562-1234</p>
                <p>City Hall, San Pablo City, Laguna</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}