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
      </body>
    </html>
  );
}