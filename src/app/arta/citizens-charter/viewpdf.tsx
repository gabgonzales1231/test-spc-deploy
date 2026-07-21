//src/app/arta/citizens-charter/viewpdf.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import CharterHeader from "@/components/arta/citizens-charter/charter-header";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PdfViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const file = decodeURIComponent(searchParams.get("file") ?? "");
  const fileName = file
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "") ?? "";

  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    setShowTop(scrollTop >= 100);
    setShowBottom(scrollHeight - scrollTop - clientHeight >= 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  const resizeRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setPageWidth(w < 768 ? w * 0.95 : Math.min(w, 800));
    });
    observer.observe(node);
  }, []);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-600">No PDF selected.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pl-4 pr-4">

      {/* Sticky Exit / Back controls */}
      <div className="sticky top-4 z-50 flex items-center justify-between">
        <button
          onClick={() => {
            sessionStorage.removeItem("cc_skip_intro");
            router.push("/arta/citizens-charter");
          }}
          className="bg-white/90 backdrop-blur border border-gray-200 text-gray-700 rounded-lg py-1.5 px-4 text-sm font-semibold shadow hover:shadow-md hover:bg-gray-50 active:scale-95 transition flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Exit
        </button>

        <button
          onClick={() => router.back()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400 rounded-lg py-1.5 px-4 text-sm font-semibold shadow hover:shadow-md active:scale-95 transition"
        >
          Back
        </button>
      </div>

      <h2 className="text-center font-bold mb-4 text-gray-700 truncate px-2">
        {fileName}
      </h2>

      <div ref={resizeRef}>

<div className="fixed bottom-20 right-6 flex flex-col gap-2 z-50">
   {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-7 bg-emerald-500 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

        </button>
      )}

        {showBottom && (
    <button
      onClick={scrollToBottom}
      className="fixed right-7 bg-emerald-500 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>


    </button>
  )}
      </div>

        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="text-center text-gray-500 py-8">Loading PDF...</p>}
          error={<p className="text-center text-red-500 py-8">Failed to load PDF.</p>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="flex justify-center mb-4">
              <Page pageNumber={i + 1} width={pageWidth} className="shadow-lg" />
            </div>
          ))}
        </Document>
      </div>

    </div>
  );
}