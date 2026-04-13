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
      numberOfRuns: 3,
      startServerCommand: 'npm run dev',       // changed from bun run dev
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 30000,
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