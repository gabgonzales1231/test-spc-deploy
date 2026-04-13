module.exports = {
  ci: {
    collect: {
      chromePath: process.env.CHROME_PATH ||
        'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/news',
        'http://localhost:3000/about-us',
        'http://localhost:3000/disclosure-portal',
      ],
      numberOfRuns: 1,
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 60000,
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu --disable-dev-shm-usage --disable-extensions',
        // disable the new insights that rely on SyntheticEventsManager
        skipAudits: [
          'cls-culprits-insight',
          'document-latency-insight',
          'dom-size-insight',
          'font-display-insight',
          'forced-reflow-insight',
          'image-delivery-insight',
          'interaction-to-next-paint-insight',
          'lcp-discovery-insight',
          'lcp-phases-insight',
          'render-blocking-insight',
          'third-parties-insight',
          'viewport-insight',
          'largest-contentful-paint-element',
          'lcp-lazy-loaded',
          'layout-shifts',
          'non-composited-animations',
          'prioritize-lcp-image',
        ],
      },
    },
    assert: {
      preset: 'lighthouse:no-pbs',
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
}