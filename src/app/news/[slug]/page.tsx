//src/app/news/[slug]/page.tsx

"use client"; 

import { notFound, useParams } from "next/navigation"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Markdown } from "@/components/Markdown";
import { useGetArticleBySlug } from "@/hooks/useApi"; 
import { useEffect, useState } from "react"; 
import { Loader2 } from "lucide-react";

interface Article {
  article_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  published_at: string | null;
  category: {
    name: string;
  } | null;
  featured_media: {
    file_path: string;
  } | null;
}

export default function NewsArticlePage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam)
    ? slugParam[0]
    : typeof slugParam === "string"
    ? slugParam
    : undefined;

  const {
    data: articleResponse,
    loading,
    error,
    execute: fetchArticle,
    reset,
  } = useGetArticleBySlug();
  const [article, setArticle] = useState<Article | null>(null);
  const [hasFetched, setHasFetched] = useState(false); 
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(slug);

  useEffect(() => {
    if (slug && slug !== currentSlug) {
      setCurrentSlug(slug);
      setHasFetched(false);
      setArticle(null);
      reset();
    }
  }, [slug, currentSlug, reset]);

  useEffect(() => {
    if (slug && !hasFetched) {
      setHasFetched(true);
      fetchArticle(slug)
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    }
  }, [slug, hasFetched, fetchArticle]);

  useEffect(() => {
    if (articleResponse) {
      let articleData = articleResponse;

      if (
        typeof articleResponse === "object" &&
        articleResponse !== null &&
        "data" in articleResponse &&
        typeof (articleResponse as any).data === "object" &&
        (articleResponse as any).data !== null
      ) {
        articleData = (articleResponse as any).data;
      }

      if (
        typeof articleData === "object" &&
        articleData !== null &&
        !Array.isArray(articleData)
      ) {
        if ("article_id" in articleData) {
          setArticle(articleData as Article);
        }
      }
    }
  }, [articleResponse]);

  if (!slug || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!loading && error && hasFetched) {
    console.error("Error fetching article:", error);
    notFound(); 
  }

  if (!loading && !error && hasFetched && !articleResponse && !article) {
    console.warn("Article not found for slug:", slug);
    notFound();
  }

  if (article) {
    const articleDate = article.published_at
      ? new Date(article.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not available";

    const imageSrc =
      article.featured_media?.file_path ||
      "https://placehold.co/1200x600?text=No+Image";

    return (
      <div className="min-h-screen bg-gray-50">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-20">
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {article.category?.name || "Uncategorized"}
                    </span>
                    <p className="text-sm text-gray-700">{articleDate}</p>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mt-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Optimized: Solid green background to replace the heavy blur effect */}
                  <div className="relative w-full h-96 overflow-hidden rounded-t-2xl bg-emerald-900/5 flex items-center justify-center p-4">
                    
                    {/* Main image */}
                    <Image
                      src={imageSrc}
                      alt={article.title}
                      className="object-contain max-h-full w-auto z-10"
                      fill 
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      priority
                    />
                  </div>

                  <Markdown className="mt-6">
                    {article.body || "This article has no content."}
                  </Markdown>

                  <Link
                    href="/news"
                    className="text-emerald-600 hover:text-emerald-800 font-medium mt-4 inline-block"
                  >
                    Back to News
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        </div>
      </div>
    </div>
  );
}