//spc-website\src\app\publications\page.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Publication {
  publication_id: number;
  filename:    string;
  file_path:   string;
  pdf_url:     string | null;
  uploaded_by: number | null;
  created_at:  string;
  updated_at:  string;
}

interface Vacancy {
  id:         number;
  datePosted: string;
  filename:   string;
  pdfUrl:     string | null;
}

type SortField = "datePosted" | "filename";
type SortDir   = "asc" | "desc";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ITEMS_PER_PAGE = 10;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function toVacancy(pub: Publication): Vacancy {
  return {
    id:         pub.publication_id,
    datePosted: pub.created_at,
    filename:   pub.filename,
    pdfUrl:     pub.pdf_url,
  };
}

function SortIcon({
  field, sortField, sortDir,
}: {
  field: SortField; sortField: SortField; sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-gray-400" />;
  return sortDir === "asc"
    ? <ChevronUp   className="w-3.5 h-3.5 ml-1 text-emerald-600" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-600" />;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function PublicationsPage() {
  const [vacancies,     setVacancies]     = useState<Vacancy[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [page,          setPage]          = useState(1);
  const [sortField,     setSortField]     = useState<SortField>("datePosted");
  const [sortDir,       setSortDir]       = useState<SortDir>("desc");

  const currentYear = new Date().getFullYear();

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("publications")
        .select("publication_id, filename, file_path, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;

      const enriched: Publication[] = (data ?? []).map((pub) => ({
        ...pub,
        pdf_url: supabase.storage
          .from("vacancies")
          .getPublicUrl(pub.file_path).data.publicUrl,
        uploaded_by: null,
        updated_at:  pub.created_at,
      }));

      setVacancies(enriched.map(toVacancy));
    } catch (err) {
      console.error("Failed to fetch publications:", err);
      setError("Unable to load vacancies at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  // ── Filters (Locked to Current Year) ──────────────────────────────────────
  const filtered = useMemo(() => {
    return vacancies.filter((v) => {
      const date = new Date(v.datePosted);
      const isCurrentYear = date.getFullYear() === currentYear;
      const matchMonth = selectedMonth === "all" || MONTHS[date.getMonth()] === selectedMonth;
      return isCurrentYear && matchMonth;
    });
  }, [vacancies, selectedMonth, currentYear]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = sortField === "datePosted" ? a.datePosted : a.filename;
      const valB = sortField === "datePosted" ? b.datePosted : b.filename;
      const cmp  = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated  = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem  = sorted.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem    = Math.min(page * ITEMS_PER_PAGE, sorted.length);

  function handleMonthChange(val: string) { setSelectedMonth(val); setPage(1); }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

      {/* Hero */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Human Resource Management Office
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Publications</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Official job vacancy announcements for the City Government of San Pablo.
            All postings are updated in real time from our records office.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

        {/* Job Vacancies Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                  Job Vacancies
                  {selectedMonth !== "all" && (
                    <span className="ml-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      {selectedMonth} {currentYear}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Viewing vacancies for the year {currentYear}.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-44">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200  focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white appearance-none cursor-pointer"
                    aria-label="Filter by month"
                  >
                    <option value="all">All Months</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                
                
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6">
            {loading ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
                <p className="text-sm">Loading vacancies...</p>
              </div>

            ) : error ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                <p className="font-medium text-gray-600">Failed to load vacancies</p>
                <p className="text-sm mt-1 text-gray-500">{error}</p>
                <button
                  onClick={fetchVacancies}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>

            ) : (
              <>
            
                {/* Desktop Table */}
                <div className="hidden md:block overflow-hidden  border border-gray-100">
                  <table className="w-full text-sm" aria-label="Job vacancies table">
                    <thead>
                      <tr className="bg-emerald-50 border-b border-emerald-100">
                        <th
                          scope="col"
                          className="px-5 py-3 text-center font-semibold text-gray-700 cursor-pointer select-none"
                          onClick={() => handleSort("datePosted")}
                        >
                          <div className="flex items-center justify-start">
                            Date Submitted
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginated.length === 0 ? (
                        <tr>
                          <td className="px-5 py-16 text-center">
                            <EmptyState selectedMonth={selectedMonth} />
                          </td>
                        </tr>
                      ) : (
                        paginated.map((v, i) => (
                          <tr
                            key={v.id}
                            className={`transition-colors hover:bg-emerald-50/50 ${
                              i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                            }`}
                          >
                            <td className="px-5 py-4 text-start">
                              {v.pdfUrl ? (
                                <a  href={v.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-medium underline underline-offset-2 transition-colors"
                                  aria-label={`View PDF submitted on ${formatDate(v.datePosted)}`}
                                >
                                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                  {formatDate(v.datePosted)}
                                </a>
                              ) : (
                                <span className="text-gray-500 block text-center">{formatDate(v.datePosted)}</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {paginated.length === 0 ? (
                    <div className="py-16 text-center">
                      <EmptyState selectedMonth={selectedMonth} />
                    </div>
                  ) : (
                    paginated.map((v) => (
                      <div
                        key={v.id}
                        className="bg-white  p-4 flex justify-center text-center"
                      >
                        {v.pdfUrl ? (
                          <a  href={v.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium underline underline-offset-2 transition-colors text-sm"
                            aria-label={`View PDF submitted on ${formatDate(v.datePosted)}`}
                          >
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            {formatDate(v.datePosted)}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">{formatDate(v.datePosted)}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {sorted.length > 0 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      Page{" "}
                      <span className="font-medium text-gray-700">{page}</span> of{" "}
                      <span className="font-medium text-gray-700">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                            p === page
                              ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                              : "border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-700"
                          }`}
                          aria-label={`Page ${p}`}
                          aria-current={p === page ? "page" : undefined}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              How to Apply
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Interested applicants must submit a complete set of application documents
                  personally to the Human Resource Management Office. Follow the steps below:
                </p>
                <ol className="space-y-3">
                  {[
                    "Download and print the Personal Data Sheet (CS Form 212) from the official CSC website.",
                    "Prepare a letter of application addressed to the City Mayor.",
                    "Attach certified true copies of eligibility, TOR, and relevant certificates.",
                    "Submit all documents to the HRMO at City Hall, Ground Floor, during office hours.",
                    "Wait for a call or email from HRMO for interview scheduling.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">Contact the CHRMO</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Ground Floor, San Pablo City Hall, Maharlika Highway, San Pablo City, Laguna</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>(049) 562-1234 local 210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>chrmo@sanpablocity.gov.ph</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Monday – Friday, 8:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200/30">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
            <p className="text-sm text-gray-600">
              Vacancy listings are updated regularly. Check back often for new postings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState({ selectedMonth }: { selectedMonth: string }) {
  return (
    <div className="flex flex-col items-center text-gray-400">
      <Inbox className="w-12 h-12 mb-3 text-gray-300" />
      {selectedMonth !== "all" ? (
        <>
          <p className="font-medium text-gray-600">No results found</p>
          <p className="text-sm mt-1">No vacancies were posted in &ldquo;{selectedMonth}&rdquo; for {new Date().getFullYear()}.</p>
        </>
      ) : (
        <>
          <p className="font-medium text-gray-600">No vacancies posted yet</p>
          <p className="text-sm mt-1">Check back soon for new job postings for the current year.</p>
        </>
      )}
    </div>
  );
}