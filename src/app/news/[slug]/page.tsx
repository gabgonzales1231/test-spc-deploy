"use client"; // 1. Must be a client component to use hooks

import { notFound, useParams } from "next/navigation"; // 2. Import hooks
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Markdown } from "@/components/Markdown";
import { useGetArticleBySlug } from "@/hooks/useApi"; // 3. Import the hook
import { useEffect, useState } from "react"; // 4. Import hooks
import { Loader2 } from "lucide-react";

// 5. Define the full Article type
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
  // Handle slug - Next.js already decodes URL params, just ensure it's a string
  const slug = Array.isArray(slugParam)
    ? slugParam[0]
    : typeof slugParam === "string"
    ? slugParam
    : undefined;

  // 7. Setup hook and state
  const {
    data: articleResponse,
    loading,
    error,
    execute: fetchArticle,
    reset,
  } = useGetArticleBySlug();
  const [article, setArticle] = useState<Article | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // Flag to prevent re-fetching
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(slug);

  // Reset state when slug changes
  useEffect(() => {
    if (slug && slug !== currentSlug) {
      setCurrentSlug(slug);
      setHasFetched(false);
      setArticle(null);
      reset();
    }
  }, [slug, currentSlug, reset]);

  // 8. Fetch article when slug is available
  useEffect(() => {
    // Only fetch if we have a slug and haven't tried to fetch yet
    if (slug && !hasFetched) {
      console.log("Fetching article with slug:", slug);
      setHasFetched(true);
      fetchArticle(slug)
        .then((response) => {
          console.log("Fetch response:", response);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    }
  }, [slug, hasFetched, fetchArticle]);

  // 9. Update state when data arrives
  useEffect(() => {
    console.log("Article response received:", articleResponse);
    console.log("Type of articleResponse:", typeof articleResponse);
    console.log("Is array?", Array.isArray(articleResponse));

    if (articleResponse) {
      let articleData = articleResponse;

      // Handle case where response might be wrapped in { success: true, data: {...} }
      if (
        typeof articleResponse === "object" &&
        articleResponse !== null &&
        "data" in articleResponse &&
        typeof (articleResponse as any).data === "object" &&
        (articleResponse as any).data !== null
      ) {
        console.log("Response is wrapped, extracting data property");
        articleData = (articleResponse as any).data;
      }

      console.log("Extracted articleData:", articleData);
      console.log(
        "Has article_id?",
        articleData &&
          typeof articleData === "object" &&
          "article_id" in articleData
      );

      // articleResponse should be the data from the hook (response.data)
      if (
        typeof articleData === "object" &&
        articleData !== null &&
        !Array.isArray(articleData)
      ) {
        // Check if it has article_id to confirm it's an article
        if ("article_id" in articleData) {
          console.log("Setting article with data:", articleData);
          setArticle(articleData as Article);
        } else {
          console.warn(
            "Response is object but missing article_id. Keys:",
            Object.keys(articleData)
          );
        }
      } else {
        console.warn(
          "Response is not a valid article object. Type:",
          typeof articleData,
          "Is array:",
          Array.isArray(articleData)
        );
      }
    } else {
      console.log("articleResponse is falsy:", articleResponse);
    }
  }, [articleResponse]);

  // 10. Handle loading, error, and not found (REVISED LOGIC)

  // Show loader if:
  // 1. We don't have a slug yet (initial render)
  // 2. We have a slug and are actively loading
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

  // Handle errors after loading is complete
  if (!loading && error && hasFetched) {
    console.error("Error fetching article:", error);
    notFound(); // API call failed
  }

  // Handle "not found" after loading is complete
  // Only show not found if we've fetched, finished loading, no error, no articleResponse, and no article
  if (!loading && !error && hasFetched && !articleResponse && !article) {
    // We fetched, finished, had no error, but still no article data.
    console.warn("Article not found for slug:", slug);
    notFound();
  }

  // If we have an article, render it.
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
                    <p className="text-sm text-gray-500">{articleDate}</p>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mt-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-96 overflow-hidden rounded-t-2xl bg-gray-100 flex items-center justify-center">
                    {/* Blurred background */}
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      className="object-cover blur-lg scale-110 opacity-40"
                      priority
                    />

                    {/* Main image */}
                    <Image
                      src={imageSrc}
                      alt={article.title}
                      className="object-contain max-h-full w-auto z-10 rounded-t-2xl"
                      width={1200}
                      height={600}
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

  // Fallback, should be covered by the loader, but good to have.
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
