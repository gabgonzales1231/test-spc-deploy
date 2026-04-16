"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building2, ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetArticles } from "@/hooks/useApi"; // 1. Import the hook

// 2. Define the Article type for the list
interface Article {
  article_id: number;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  category: {
    name: string;
  } | null;
  featured_media: {
    file_path: string;
  } | null;
}

// Helper: Format date string
const formatDate = (dateString: string) => {
  if (!dateString) return "Date not available";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function NewsPage() {
  // 3. Setup hook and state
  const {
    data: articlesResponse,
    loading,
    error,
    execute: fetchArticles,
  } = useGetArticles();
  const [articles, setArticles] = useState<Article[]>([]);

  // 4. Fetch articles on mount
  useEffect(() => {
    // Fetches page 1, 100 articles, (public route only gets 'published')
    fetchArticles({ page: 1, limit: 100 });
  }, [fetchArticles]);

  // 5. Update state when data arrives (CORRECTED)
  useEffect(() => {
    // articlesResponse IS the array (or null), not an object with .data
    if (Array.isArray(articlesResponse)) {
      setArticles(articlesResponse as Article[]);
    }
  }, [articlesResponse]);

  // 6. Handle loading state
  const renderLoadingSkeleton = () =>
    [...Array(6)].map((_, index) => (
      <Card key={index} className="bg-white shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <span className="inline-block bg-gray-200 h-6 w-24 rounded-full animate-pulse" />
            <p className="text-sm bg-gray-200 h-4 w-20 rounded-full animate-pulse"></p>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 mt-2">
            <div>
              <div className="relative rounded-xl w-full h-48 overflow-hidden bg-gray-200 animate-pulse" />
              <div className="pt-4 space-y-2">
                <div className="bg-gray-200 h-6 w-3/4 rounded-full animate-pulse" />
                <div className="bg-gray-200 h-6 w-1/2 rounded-full animate-pulse" />
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 space-y-2">
            <div className="bg-gray-200 h-4 w-full rounded-full animate-pulse" />
            <div className="bg-gray-200 h-4 w-full rounded-full animate-pulse" />
            <div className="bg-gray-200 h-4 w-2/3 rounded-full animate-pulse" />
          </CardDescription>
          <div className="bg-gray-200 h-5 w-24 rounded-full animate-pulse mt-2" />
        </CardHeader>
      </Card>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Local Updates
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            News and Updates
          </h1>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto">
            From upcoming events and community projects to local stories that
            inspire — here’s your hub for the latest updates that bring San
            Pableños together. Stay connected, stay informed!
          </p>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 7. Render dynamic content, loading, or error states */}
            {loading && articles.length === 0 ? (
              renderLoadingSkeleton()
            ) : error ? (
              <div className="col-span-full text-center py-12 bg-red-50 text-red-700 rounded-lg">
                <p>Error loading articles: {error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No news articles found.</p>
              </div>
            ) : (
articles.map((item, index) => {
  const isFirst = index === 0;
  const imageSrc =
    item.featured_media?.file_path ||
    "https://placehold.co/500x300?text=No+Image";

  return (
    <article
      key={item.article_id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 h-full flex flex-col"
    >
      <div className="relative w-full h-52 bg-gray-100 overflow-hidden">

        {/* Blurred background — only render as real image for first card, CSS for the rest */}
        {isFirst ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            priority                          // ← removes lazy, adds fetchpriority=high + preload
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover blur-lg scale-110 opacity-40"
          />
        ) : (
          <div className="absolute inset-0 scale-110 opacity-40 blur-lg bg-gray-300" />
        )}

        {/* Main image */}
        <Image
          src={imageSrc}
          alt={item.title || "News Image"}
          fill
          priority={isFirst}                  // ← priority on first, lazy on rest
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain z-10 transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/500x300?text=No+Image";
          }}
        />

                      {/* Category badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                          {item.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <time className="text-sm text-gray-600 mb-2">
                        {formatDate(item.published_at)}
                      </time>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>

                      <div className="mt-auto">
                        <Link
  href={`/news/${item.slug}`}
  className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-semibold"
  aria-label={`Read more about ${item.title}`}
>
  Read More
  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
</Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}