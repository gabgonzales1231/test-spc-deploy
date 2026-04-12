// components/StructuredData.tsx
'use client';

import { useEffect, useState } from 'react';

export default function StructuredData() {
  const [currentDate, setCurrentDate] = useState('2025-01-01T00:00:00+08:00');

  useEffect(() => {
    // Set current date only on client side after hydration
    setCurrentDate(new Date().toISOString());
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": "https://sanpablocity.gov.ph/#organization",
    "name": "San Pablo City Government",
    "alternateName": "City of San Pablo",
    "url": "https://sanpablocity.gov.ph",
    "logo": "https://sanpablocity.gov.ph/logo.png",
    "description": "Official government website of San Pablo City, Laguna, Philippines providing city services, news, and information.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "San Pablo City Hall",
      "addressLocality": "San Pablo City",
      "addressRegion": "Laguna",
      "postalCode": "4000",
      "addressCountry": "PH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "14.0683",
      "longitude": "121.3256"
    },
    "telephone": "+63-xx-xxxx-xxxx",
    "email": "info@sanpablocity.gov.ph",
    "sameAs": [
      "https://www.facebook.com/SanPabloCityOfficial",
      "https://twitter.com/SanPabloCity",
    ],
    "parentOrganization": {
      "@type": "GovernmentOrganization",
      "name": "Province of Laguna"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sanpablocity.gov.ph/#website",
    "url": "https://sanpablocity.gov.ph",
    "name": "San Pablo City Government",
    "description": "Official website of San Pablo City Government",
    "publisher": {
      "@id": "https://sanpablocity.gov.ph/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sanpablocity.gov.ph/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-PH"
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://sanpablocity.gov.ph/#webpage",
    "url": "https://sanpablocity.gov.ph",
    "name": "San Pablo City - Official Government Website",
    "description": "Access San Pablo City government services, news, ordinances, and events. Your gateway to efficient local government services.",
    "isPartOf": {
      "@id": "https://sanpablocity.gov.ph/#website"
    },
    "about": {
      "@id": "https://sanpablocity.gov.ph/#organization"
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://sanpablocity.gov.ph/hero-image.jpg",
      "width": 1920,
      "height": 1080
    },
    "datePublished": "2025-01-01T00:00:00+08:00",
    "dateModified": currentDate,
    "inLanguage": "en-PH"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sanpablocity.gov.ph"
      }
    ]
  };

  const governmentServiceSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "San Pablo City eGov Services",
    "description": "Access integrated government services online through the eGov PH platform",
    "provider": {
      "@id": "https://sanpablocity.gov.ph/#organization"
    },
    "serviceType": "Government Digital Services",
    "areaServed": {
      "@type": "City",
      "name": "San Pablo City",
      "containedInPlace": {
        "@type": "State",
        "name": "Laguna"
      }
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://e.gov.ph",
      "servicePhone": "+63-xx-xxxx-xxxx"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServiceSchema) }}
      />
    </>
  );
}