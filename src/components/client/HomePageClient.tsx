"use client";
import { ArrowRight, Newspaper } from "lucide-react";

import HomeCarousel from "@/components/home/HomeCarousel";
import NewsCard from "@/components/home/NewsCard";
import Image from "next/image";
import ServiceCard from "@/components/home/ServiceCard";
import { servicesData } from "@/data/service";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import MergedInfoCard from "../home/MergeInfoCard";
import type { Article, Banner } from "@/app/page";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

interface HomePageClientProps {
  articles: Article[];
  banners: Banner[];
}

export default function HomePageClient({ articles, banners }: HomePageClientProps) {
  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <section className="w-full mb-8" aria-label="San Pablo City Hero Banner">
          <div className="text-center -mt-8">
            <HomeCarousel banners={banners} />
          </div>
        </section>

        <MergedInfoCard />

        <section id="news" className="py-8 bg-gradient-to-r from-emerald-50 to-white mt-8" aria-labelledby="news-heading">
          <div className="max-w-7xl mx-auto px-4">
            <header className="text-center mb-16">
              <h2 id="news-heading" className="text-4xl font-bold text-emerald-900 mb-4">News & Updates</h2>
              <p className="text-xl text-emerald-600">Stay informed with the latest developments and initiatives</p>
            </header>
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No news articles found.</p>
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

        <section id="services" className="py-10 bg-gradient-to-b from-white to-emerald-50/30" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto px-4">
            <div>
              <h3 id="services-heading" className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesData.map((service, index) => (
  <ServiceCard key={index} {...service} />
))}
                <Link href="/services" className="group flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">More Services</h4>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">Discover additional services available to you.</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mt-auto pt-3 border-t border-gray-100 group-hover:text-emerald-700 transition-all">
                    Explore
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-4 sm:p-6 shadow-lg mt-12">
              <div className="flex flex-col lg:hidden gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-lg p-1.5 flex-shrink-0">
                    <Image src="/egov.svg" alt="eGov PH Logo" width={48} height={48} />
                  </div>
                  <div className="text-white flex-1">
                    <h3 className="text-sm sm:text-base font-bold">eGov PH Services</h3>
                    <p className="text-emerald-100 text-xs">Powered by DICT</p>
                  </div>
                  <a href="https://e.gov.ph" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all hover:scale-105 text-xs sm:text-sm whitespace-nowrap"
                    aria-label="Visit eGov Website (opens in new tab)">
                    <span>Website</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
                <p className="text-white text-xs sm:text-sm leading-relaxed px-2">Access integrated government services in one platform. Complete transactions anytime, anywhere.</p>
                <nav className="flex flex-col sm:flex-row gap-2 w-full" aria-label="eGov Platform Links">
                  <a href="https://play.google.com/store/apps/details?id=egov.app&hl=en_US" target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                    aria-label="Download on Google Play">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                    <span>Play</span>
                  </a>
                  <a href="https://apps.apple.com/ph/app/egovph/id6447682225" target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                    aria-label="Download on App Store">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05,20.28C16.03,21.23 14.96,20.95 13.95,20.46C12.88,19.96 11.89,19.94 10.76,20.46C9.33,21.13 8.57,20.81 7.67,20.28C3.54,17.54 4.13,12.27 8.75,12.04C9.84,12.1 10.61,12.68 11.26,12.72C12.29,12.5 13.28,11.89 14.38,11.97C15.73,12.08 16.74,12.64 17.42,13.65C14.57,15.35 15.23,19.4 17.05,20.28M12.03,11.93C11.88,9.82 13.63,8.1 15.66,7.93C16,10.29 13.37,12.08 12.03,11.93Z" /></svg>
                    <span>App</span>
                  </a>
                </nav>
              </div>

              <div className="hidden lg:flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="bg-white rounded-lg p-2">
                    <Image src="/egov.svg" alt="eGov PH Logo" width={128} height={128} />
                  </div>
                  <div className="text-white">
                    <h3 className="text-base font-bold">eGov PH Services</h3>
                    <p className="text-emerald-100 text-xs">Powered by DICT</p>
                  </div>
                </div>
                <div className="text-white flex-1 text-center md:text-left">
                  <p className="text-sm leading-relaxed">Access integrated government services in one platform. Complete transactions anytime, anywhere.</p>
                </div>
                <nav className="flex flex-wrap gap-2 justify-end flex-shrink-0" aria-label="eGov Platform Links">
                  <a href="https://e.gov.ph" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all hover:scale-105 text-sm"
                    aria-label="Visit eGov Website"><span>Website</span></a>
                  <a href="https://play.google.com/store/apps/details?id=egov.app&hl=en_US" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-all text-sm font-medium"
                    aria-label="Download on Google Play">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                    <span className="hidden sm:inline text-xs">Play</span>
                  </a>
                  <a href="https://apps.apple.com/ph/app/egovph/id6447682225" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-all text-sm font-medium"
                    aria-label="Download on App Store">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05,20.28C16.03,21.23 14.96,20.95 13.95,20.46C12.88,19.96 11.89,19.94 10.76,20.46C9.33,21.13 8.57,20.81 7.67,20.28C3.54,17.54 4.13,12.27 8.75,12.04C9.84,12.1 10.61,12.68 11.26,12.72C12.29,12.5 13.28,11.89 14.38,11.97C15.73,12.08 16.74,12.64 17.42,13.65C14.57,15.35 15.23,19.4 17.05,20.28M12.03,11.93C11.88,9.82 13.63,8.1 15.66,7.93C16,10.29 13.37,12.08 12.03,11.93Z" /></svg>
                    <span className="hidden sm:inline text-xs">App</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}