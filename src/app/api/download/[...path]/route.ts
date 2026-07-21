// src/app/api/download/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const CLIENT_COOKIE = "cc_client_id";
const MAX_DOWNLOADS = 3;
const RATE_WINDOW = 30 * 60_000; // 30 minutes

const ALLOWED_BUCKETS = new Set(["documents"]);

// key = `${clientId}:${fileId}` -> tracks downloads per client, per file
const downloadMap = new Map<string, { count: number; resetAt: number }>();

// periodic cleanup so the map doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of downloadMap.entries()) {
    if (now > entry.resetAt) downloadMap.delete(key);
  }
}, 5 * 60_000).unref();

function isDownloadLimited(clientId: string, fileId: string): boolean {
  const key = `${clientId}:${fileId}`;
  const now = Date.now();
  const entry = downloadMap.get(key);

  if (!entry || now > entry.resetAt) {
    downloadMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= MAX_DOWNLOADS) return true;

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
    (referer === "" && host === new URL(allowedHost).host) ||
    process.env.NODE_ENV === "development";

  if (!isInternal) {
    console.log("403 debug:", { referer, origin, host, allowedHost });
    return new NextResponse("Forbidden", { status: 403 });
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

  // identify the client via cookie (create one if missing)
  const existingCookie = req.cookies.get(CLIENT_COOKIE)?.value;
  const clientId = existingCookie || randomUUID();
  const fileId = `${bucket}/${filePath}`;

  if (isDownloadLimited(clientId, fileId)) {
    const res = new NextResponse(
      "Download limit reached for this file. Try again in a bit.",
      { status: 429 }
    );
    if (!existingCookie) {
      res.cookies.set(CLIENT_COOKIE, clientId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }
    return res;
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

  const res = new NextResponse(upstream.body, { status: 200, headers });

  if (!existingCookie) {
    res.cookies.set(CLIENT_COOKIE, clientId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return res;
}