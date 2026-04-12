import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sanpablocity.gov.ph'
  const currentDate = new Date()
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/news',
    '/ordinances',
    '/events',
    '/contact',
    '/transparency',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
  
  // Dynamic news pages (fetch from your data source)
  // const newsPages = news.map((item) => ({
  //   url: `${baseUrl}/news/${item.slug}`,
  //   lastModified: new Date(item.date),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))
  
  return [
    ...staticPages,
    // ...newsPages,
  ]
}

// public/manifest.json (for PWA)
// {
//   "name": "San Pablo City Government",
//   "short_name": "San Pablo City",
//   "description": "Official website of San Pablo City Government, Laguna, Philippines",
//   "start_url": "/",
//   "display": "standalone",
//   "background_color": "#ffffff",
//   "theme_color": "#059669",
//   "icons": [
//     {
//       "src": "/icon-192.png",
//       "sizes": "192x192",
//       "type": "image/png"
//     },
//     {
//       "src": "/icon-512.png",
//       "sizes": "512x512",
//       "type": "image/png"
//     }
//   ]
// }