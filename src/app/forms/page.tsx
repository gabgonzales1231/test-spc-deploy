"use client"
// spc-website/src/app/forms/page.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  FileText, Building2, Search, ChevronDown, ChevronUp,
  ExternalLink, ClipboardList, HardHat, Users, HeartHandshake,
} from 'lucide-react'
import { useGetPublicForms, FormDocument, FormCategory } from '@/hooks/useForms'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { id: FormCategory; label: string; icon: React.ElementType }[] = [
  { id: 'business-permits-licensing',  label: 'Business Permits & Licensing', icon: ClipboardList  },
  { id: 'city-planning-development',   label: 'City Planning & Development',  icon: Building2      },
  { id: 'building-official',           label: 'Building Official',            icon: HardHat        },
  { id: 'civil-society-organizations', label: 'Civil Society Organizations',  icon: Users          },
  { id: 'senior-citizens-affairs',     label: 'Senior Citizens Affairs',      icon: HeartHandshake },
]

// ─── Year Accordion ───────────────────────────────────────────────────────────

function YearAccordion({
  year,
  docs,
  isOpen,
  onToggle,
  categoryLabel,
}: {
  year:          number
  docs:          FormDocument[]
  isOpen:        boolean
  onToggle:      () => void
  categoryLabel: string
}) {
  return (
    <div className="overflow-hidden border border-gray-100 mb-4">
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
            <div className="px-5 py-8 text-center text-gray-400">No forms found.</div>
          ) : (
            docs.map((doc, idx) => (
              <div
                key={doc.id}
                className={`flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-50 group transition-colors hover:bg-emerald-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <FileText className="mt-0.5 w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {doc.pdf_url ? (
                    <a
                      href={doc.pdf_url}
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
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FormsPage() {
  const [activeCategory, setActiveCategory] = useState<FormCategory>('business-permits-licensing')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [openYears,      setOpenYears]      = useState<Record<number, boolean>>({})

  const { execute, data, loading, error } = useGetPublicForms()

  const documents: FormDocument[] = (() => {
    if (!data) return []
    const raw = data as { data?: FormDocument[] } | FormDocument[]
    return Array.isArray(raw) ? raw : (raw.data ?? [])
  })()

  const byYear = documents.reduce<Record<number, FormDocument[]>>((acc, doc) => {
    const y = doc.year ?? (doc.date_issued ? new Date(doc.date_issued).getFullYear() : null)
    if (!y || isNaN(y)) return acc
    if (!acc[y]) acc[y] = []
    acc[y].push(doc)
    return acc
  }, {})

  const availableYears = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  const fetchForms = useCallback(async () => {
    await execute({ category: activeCategory, limit: 200 })
  }, [execute, activeCategory])

  useEffect(() => {
    fetchForms()
    setOpenYears({})
    setSearchQuery('')
  }, [activeCategory, fetchForms])

  useEffect(() => {
    if (availableYears.length > 0) {
      setOpenYears(prev => {
        if (Object.keys(prev).length > 0) return prev
        return { [availableYears[0]]: true }
      })
    }
  }, [availableYears])

  const toggleYear = (year: number) =>
    setOpenYears(prev => ({ ...prev, [year]: !prev[year] }))

  const filteredDocs = (year: number) => {
    const docs = byYear[year] ?? []
    if (!searchQuery.trim()) return docs
    return docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const activeLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

      {/* Hero */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Forms Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Downloadable Forms</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Access and download official government forms from various city departments.
            All forms are available in PDF format for your convenience.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-3 border-b-2 border-gray-200">
            Departments
          </h2>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = id === activeCategory
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`w-full text-left px-4 py-3 text-base font-medium transition-all flex items-center gap-2
                    ${active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span className="leading-snug">{label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  {activeLabel}
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search forms…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-6">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-16 text-red-500">
                  <p className="text-sm">Failed to load forms. Please try again later.</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  {availableYears.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
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
                </>
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
                Need Help?
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                Can't find the form you need? Contact the relevant department directly or visit City Hall for assistance.
              </p>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Contact Us
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                Visit City Hall
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                For form submissions and inquiries, visit the City Hall during office hours, Monday to Friday, 8AM–5PM.
              </p>
              <div className="text-sm text-gray-600">
                <p>Phone: (049) 562-1234</p>
                <p>Email: info@sanpablocity.gov.ph</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}