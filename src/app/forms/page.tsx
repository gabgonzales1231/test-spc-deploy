"use client"
// spc-website/src/app/forms/page.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  FileText, Building2, Search, ChevronDown, ChevronUp,
  ExternalLink, ClipboardList, HardHat, Users, HeartHandshake, X,
} from 'lucide-react'
import { useGetPublicForms, FormDocument, FormCategory } from '@/hooks/useForms'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { id: FormCategory; label: string; icon: React.ElementType }[] = [
  { id: 'business-permits-licensing',  label: 'Business Permits & Licensing', icon: ClipboardList  },
  { id: 'city-planning-development',   label: 'City Planning & Development',  icon: Building2      },
  { id: 'building-official',           label: 'Building Official',            icon: HardHat        },
  // { id: 'civil-society-organizations', label: 'Civil Society Organizations',  icon: Users          },
  { id: 'senior-citizens-affairs',     label: 'Senior Citizens Affairs',      icon: HeartHandshake },
]

// ─── Year Accordion ───────────────────────────────────────────────────────────

function YearAccordion({
  year, docs, isOpen, onToggle, categoryLabel,
}: {
  year: number
  docs: FormDocument[]
  isOpen: boolean
  onToggle: () => void
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
                    
                    <a href={doc.pdf_url}
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

// ─── Global Search Results ────────────────────────────────────────────────────

function GlobalSearchResults({
  results, loading, query,
}: {
  results: Record<FormCategory, FormDocument[]>
  loading: boolean
  query: string
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const initial: Record<string, boolean> = {}
    CATEGORIES.forEach(c => {
      if ((results[c.id] ?? []).length > 0) initial[c.id] = true
    })
    setOpenSections(initial)
  }, [results])

  const toggle = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))

  const totalCount = CATEGORIES.reduce((sum, c) => sum + (results[c.id]?.length ?? 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No forms matched "<span className="font-medium">{query}</span>"</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {totalCount} result{totalCount !== 1 ? 's' : ''} for "<span className="font-medium text-gray-700">{query}</span>" across all departments
      </p>
      {CATEGORIES.map(({ id, label }) => {
        const docs = results[id] ?? []
        if (docs.length === 0) return null
        return (
          <div key={id} className="mb-6">
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-5 py-3 text-left bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/60 transition-colors"
            >
              <span className="text-base font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                {label}
                <span className="text-xs font-normal bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  {docs.length}
                </span>
              </span>
              {openSections[id]
                ? <ChevronUp   className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            </button>
            {openSections[id] && (
              <div className="border border-t-0 border-gray-100">
                {docs.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 group transition-colors hover:bg-emerald-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                  >
                    <FileText className="mt-0.5 w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {doc.pdf_url ? (
                      
                       <a href={doc.pdf_url}
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
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FormsPage() {
  const [activeCategory, setActiveCategory] = useState<FormCategory>('business-permits-licensing')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [openYears,      setOpenYears]      = useState<Record<number, boolean>>({})

  const { execute, data, loading, error } = useGetPublicForms()

  const hooks = {
    'business-permits-licensing':  useGetPublicForms(),
    'city-planning-development':   useGetPublicForms(),
    'building-official':           useGetPublicForms(),
    'civil-society-organizations': useGetPublicForms(),
    'senior-citizens-affairs':     useGetPublicForms(),
  } as const

  const searchActive = searchQuery.trim().length > 0
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchForms = useCallback(async () => {
    await execute({ category: activeCategory, limit: 200 })
  }, [execute, activeCategory])

  useEffect(() => {
    if (!searchActive) {
      fetchForms()
      setOpenYears({})
    }
  }, [activeCategory, fetchForms, searchActive])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!searchActive) return

    debounceRef.current = setTimeout(async () => {
      await Promise.all(
        CATEGORIES.map(({ id }) => hooks[id].execute({ category: id, limit: 200 }))
      )
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

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

  const globalResults = Object.fromEntries(
    CATEGORIES.map(({ id }) => {
      const raw = hooks[id].data
      const all: FormDocument[] = !raw
        ? []
        : Array.isArray(raw) ? raw : ((raw as { data?: FormDocument[] }).data ?? [])
      const q = searchQuery.toLowerCase()
      return [id, all.filter(d => d.title.toLowerCase().includes(q))]
    })
  ) as Record<FormCategory, FormDocument[]>

  const globalLoading = CATEGORIES.some(({ id }) => hooks[id].loading)
  const activeLabel   = CATEGORIES.find(c => c.id === activeCategory)?.label ?? ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

      {/* Hero */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Forms
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Downloadable Forms</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Access and download official government forms from various city departments.
            All forms are available in PDF format for your convenience.
          </p>
        </div>
      </section>

      {/* ── Global Search Bar ── */}
      <div className="bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end">
          {/*
            Desktop: search bar width matches the content card width only
            (max-w-7xl minus the md:w-64 sidebar and gap-8 gap = 18rem),
            but only when the sidebar is actually showing (i.e. not searching).
            Once a search is active the sidebar is hidden and the card goes
            full width, so the bar expands to match.
          */}
          <div
            className={`relative w-full ${
              searchActive ? 'md:w-full' : 'md:w-[calc(100%-18rem)]'
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search forms across all departments"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar — hidden during global search */}
        {!searchActive && (
          <aside className="md:w-64 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-3 border-b-2 border-gray-200">
              Offices
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
        )}

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
            <CardHeader className="px-6 pt-0 pb-0">
              <div className="pb-0">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  {searchActive ? 'Search Results' : activeLabel}
                </h2>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-0">
              {searchActive ? (
                <GlobalSearchResults
                  results={globalResults}
                  loading={globalLoading}
                  query={searchQuery}
                />
              ) : (
                <>
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
                    availableYears.length === 0 ? (
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
                    )
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
                <p>Phone: --</p>
                <p>Email: info@sanpablocity.gov.ph</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}