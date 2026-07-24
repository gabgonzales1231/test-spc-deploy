"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewsCard from "@/components/home/NewsCard";
import ServiceCard from "@/components/home/ServiceCard";
import { servicesData } from "@/data/service";
import type { Article } from "@/app/page";
import JobVacancies from "@/components/home/JobVacancies"; // NEW IMPORT

const EGOV_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=egov.app";
const EGOV_APP_STORE_URL  = "https://apps.apple.com/us/app/egovph/id6447682225";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

interface HomeBelowFoldProps {
  articles: Article[];
}

export default function HomeBelowFold({ articles }: HomeBelowFoldProps) {
  // ── Scroll to Animate Hook ───────────────────────────────────────────────
  function useFadeUp(threshold = 0.15) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
  }

  // Separate animation nodes for clean layout staggered triggers
  const newsAnimation = useFadeUp(0.1);
  const jobsHeaderAnimation = useFadeUp(0.1);
  const servicesAnimation = useFadeUp(0.12);
  const egovAnimation = useFadeUp(0.15);

  return (
    <>
      {/* NEWS SECTION */}
      <section
        id="news"
        className="py-8 bg-gradient-to-r from-emerald-50 to-white mt-8"
        aria-labelledby="news-heading"
      >
        <div
          ref={newsAnimation.ref}
          className={`max-w-7xl mx-auto px-4 transition-all duration-700 ease-out
            ${newsAnimation.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <header className="text-center mb-16">
            <h2 id="news-heading" className="text-4xl font-bold text-emerald-900 mb-4">
              News & Updates
            </h2>
            <p className="text-xl text-emerald-700 font-medium">
              Stay informed with the latest developments and initiatives
            </p>
          </header>
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-700 text-lg">No news articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.article_id}>
                  <NewsCard
                    id={article.slug}
                    title={article.title}
                    date={formatDate(article.published_at)}
                    imageUrl={article.featured_media?.file_path || "https://placehold.co/500x300?text=No+Image"}
                    excerpt={article.excerpt || ""}
                    category={article.category?.name || "Uncategorized"}
                  />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

       {/* PUBLICATIONS & VACANCIES — Merged Client Component */}

        <div
          ref={jobsHeaderAnimation.ref}
          className={`transition-all duration-700 ease-out
            ${jobsHeaderAnimation.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <header className="text-center mb-1 mt-10">
            <h2 id="services-heading" className="text-4xl font-bold text-emerald-900 mb-4">
              Jobs & eServices
            </h2>
                        <p className="text-xl text-emerald-700 font-medium">
Explore employment opportunities and government digital services.
            </p>

            </header>
        </div>

          
        <JobVacancies />
        

      {/* SERVICES SECTION */}
      <section
        id="services"
        className="py-10 bg-gradient-to-b from-white to-emerald-50/30"
        aria-labelledby="services-heading"
      >
        <div
          ref={servicesAnimation.ref}
          className={`max-w-7xl mx-auto px-4 transition-all duration-700 ease-out
            ${servicesAnimation.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
            <Link
              href="/services"
              className="group flex flex-col p-6 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-md hover:border-emerald-200 transition-all duration-200"
              aria-label="Explore all available city services"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                More Services
              </h4>
              <p className="text-gray-700 text-sm mb-6 flex-grow">
                Discover additional services available to you.
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mt-auto pt-3 border-t border-gray-100 group-hover:text-emerald-800 transition-all">
                Explore
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* E-GOV CALL TO ACTION */}
          <div
            ref={egovAnimation.ref}
            className={`relative mt-12 overflow-hidden rounded-2xl border border-emerald-900/40 shadow-xl transition-all duration-700 ease-out
              ${egovAnimation.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #022c22 65%, #011a15 100%)",
            }}
          >
            {/* Ambient dot-grid texture — evokes a connectivity/network field */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: "radial-gradient(circle, #34d399 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            {/* Soft amber glow, top-right — the single accent this card spends its boldness on */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl"
            />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

                {/* Identity block */}
                <div className="flex items-center gap-4 lg:flex-shrink-0">
                  <div className="relative bg-white rounded-xl p-2.5 shadow-lg shadow-black/20 ring-1 ring-white/10">
                    <Image src="/egov.svg" alt="eGov PH Official Logo" width={56} height={56} />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-[0.18em] text-amber-300 uppercase mb-1">
                      National Digital Platform
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      eGov PH Services
                    </h3>
                    <p className="text-emerald-200/70 text-xs mt-0.5">Powered by DICT</p>
                  </div>
                </div>

                {/* Divider — vertical on desktop, horizontal on mobile */}
                <div className="hidden lg:block w-px self-stretch bg-white/10" />
                <div className="lg:hidden h-px w-full bg-white/10" />

                {/* Message */}
                <p className="text-emerald-50/90 text-sm sm:text-base leading-relaxed lg:flex-1">
                  Access integrated E-Government services —
                  <span className="text-white font-semibold"> all in a single platform.</span>
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-shrink-0 gap-2.5 w-full sm:w-auto">
                  <a
                    href="https://e.gov.ph"
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-300 transition-all hover:scale-[1.03] active:scale-[0.98]"
                    aria-label="Visit the official eGov Philippines website"
                  >
                    <span>Visit Website</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </a>

                  <div className="flex gap-2.5">
                    <a
                      href={EGOV_PLAY_STORE_URL}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white/[0.06] text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-white/15 hover:bg-white/[0.12] hover:border-white/25 transition-all"
                      aria-label="Download eGovPH on Google Play Store"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                      <span className="hidden xs:inline sm:hidden lg:inline">Play Store</span>
                      <span className="xs:hidden sm:inline lg:hidden">Android</span>
                    </a>

                    <a
                      href={EGOV_APP_STORE_URL}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white/[0.06] text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-white/15 hover:bg-white/[0.12] hover:border-white/25 transition-all"
                      aria-label="Download eGovPH on Apple App Store"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05,20.28C16.03,21.23 14.96,20.95 13.95,20.46C12.88,19.96 11.89,19.94 10.76,20.46C9.33,21.13 8.57,20.81 7.67,20.28C3.54,17.54 4.13,12.27 8.75,12.04C9.84,12.1 10.61,12.68 11.26,12.72C12.29,12.5 13.28,11.89 14.38,11.97C15.73,12.08 16.74,12.64 17.42,13.65C14.57,15.35 15.23,19.4 17.05,20.28M12.03,11.93C11.88,9.82 13.63,8.1 15.66,7.93C16,10.29 13.37,12.08 12.03,11.93Z" /></svg>
                      <span className="hidden xs:inline sm:hidden lg:inline">App Store</span>
                      <span className="xs:hidden sm:inline lg:hidden">iOS</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}