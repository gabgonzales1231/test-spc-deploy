import { Metadata } from "next";
import HomePageClient from "@/components/client/HomePageClient";

// SEO Metadata Configuration
export const metadata: Metadata = {
  title: 'San Pablo City - Official Government Website | Laguna, Philippines',
  description: 'Official website of City of San Pablo, Laguna, Philippines. Access city services, news, ordinances, events, and eGov services. Your gateway to efficient local government services.',
  keywords: [
    'San Pablo City',
    'San Pablo Laguna',
    'City of San Pablo',
    'San Pablo City Hall',
    'Laguna Philippines',
    'City of Seven Lakes',
    'eGov Philippines',
    'San Pablo services',
    'San Pablo news',
    'San Pablo ordinances',
    'San Pablo events',
    'local government Philippines'
  ],
  authors: [{ name: 'City of San Pablo' }],
  creator: 'City of San Pablo',
  publisher: 'City of San Pablo',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://sanpablocity.gov.ph',
    siteName: 'City of San Pablo',
    title: 'San Pablo City - Official Government Website',
    description: 'Official website of City of San Pablo, Laguna, Philippines. Access city services, news, and eGov services online.',
    images: [
      {
        url: 'https://sanpablocity.gov.ph/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'City of San Pablo',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'San Pablo City - Official Government Website',
    description: 'Official website of City of San Pablo, Laguna, Philippines. Access city services, news, and eGov services.',
    images: ['https://sanpablocity.gov.ph/twitter-image.jpg'],
    creator: '@SanPabloCity',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Government',
  other: {
    'geo.region': 'PH-LAG',
    'geo.placename': 'San Pablo City',
    'geo.position': '14.0683;121.3256',
  },
}

export default function HomePage() {
  return <HomePageClient />
}