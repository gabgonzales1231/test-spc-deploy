// src/app/api/download/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

const ALLOWED_BUCKETS = new Set(["disclosure", "forms", "vacancies"]);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const referer = req.headers.get("referer") ?? "";
  const origin = req.headers.get("origin") ?? "";
  const host = req.headers.get("host") ?? "";

  const allowedHost =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_FRONTEND_URL ??
    `https://${host}`;

  const isInternal =
    referer.startsWith(allowedHost) ||
    origin.startsWith(allowedHost) ||
    // Allow empty referer on same-host requests (Vercel/production navigation)
    (referer === "" && host === new URL(allowedHost).host) ||
    process.env.NODE_ENV === "development";

  if (!isInternal) {
    console.log("403 debug:", { referer, origin, host, allowedHost });
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const { path: pathSegments } = await params;

  if (pathSegments.length < 2) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const [bucket, ...rest] = pathSegments;
  const filePath = rest.join("/");

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return new NextResponse("Invalid bucket", { status: 400 });
  }

  if (!filePath.endsWith(".pdf")) {
    return new NextResponse("Only PDF downloads are allowed", { status: 400 });
  }

  if (filePath.includes("..") || filePath.includes("//")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  const storageUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

  let upstream: Response;
  try {
    upstream = await fetch(storageUrl, {
      headers: { Authorization: `Bearer ${supabaseKey}` },
    });
  } catch {
    return new NextResponse("Failed to fetch file", { status: 502 });
  }

  if (!upstream.ok) {
    return new NextResponse("File not found", { status: 404 });
  }

  const contentLength = upstream.headers.get("content-length");
  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${pathSegments.at(-1)}"`,
    "Cache-Control": "private, max-age=3600",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  });

  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(upstream.body, { status: 200, headers });
}