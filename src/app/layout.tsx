import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotlinesSidebar from "@/components/home/HotlinesSidebar";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";

import "../styles/global.css";
import DataPrivacyPolicyPopup from "@/components/home/DataPrivacyPolicy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // prevents invisible text during font load (CLS fix)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // prevents invisible text during font load (CLS fix)
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* DataPrivacyPolicyPopup is deferred — renders nothing on first
              paint so it never becomes the LCP element or causes CLS */}
          <DataPrivacyPolicyPopup />
          <Header />
          <HotlinesSidebar />
          <ChatWidgetLoader />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}