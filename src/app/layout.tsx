// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotlinesSidebar from "@/components/home/HotlinesSidebar";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";
import DataPrivacyPolicyPopup from "@/components/home/DataPrivacyPolicy";
import AnimationCSS from "@/components/AnimationCSS";
import DisableRightClick from "@/components/DisableRightClick";

import "../styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "City of San Pablo",
  description: "Official website of the City Government of San Pablo, Laguna, Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
<html lang="en" suppressHydrationWarning>
  <head>
   
    <link rel="preconnect" href="https://hvalkmxibjgrwipfuvhw.supabase.co" />
    <link rel="dns-prefetch" href="https://hvalkmxibjgrwipfuvhw.supabase.co" />

    <AnimationCSS />
  </head>
 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DataPrivacyPolicyPopup />
          <Header />
          <HotlinesSidebar />
          <ChatWidgetLoader />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <DisableRightClick />

 <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var current = window.scrollY;
    var target = window.scrollY;
    var ease = 0.08;
    var running = false;

    function tick() {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        running = false;
        return;
      }
      window.scrollTo(0, current);
      requestAnimationFrame(tick);
    }

    window.addEventListener('wheel', function(e) {
      e.preventDefault();
      target += e.deltaY * 1.5;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
      current = window.scrollY;
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }, { passive: false });
  })();
` }} />
      </body>
    </html>
  );
}