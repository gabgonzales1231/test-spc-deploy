"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Path updated from @/components/ to @/app/ to match your actual file location
const PdfViewer = dynamic(() => import("@/app/arta/citizens-charter/viewpdf"), {
  ssr: false,
  loading: () => <p className="text-center py-20 text-gray-500">Loading viewer...</p>,
});

export default function ViewPdfPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-gray-500">Loading...</p>}>
      <PdfViewer />
    </Suspense>
  );
}