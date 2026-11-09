const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:8765',
    viewport: { width: 390, height: 844 },
    ...(process.env.OM_TEST_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.OM_TEST_CHROMIUM_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] } } : {})
  },
  webServer: { command: 'python3 -m http.server 8765 --bind 127.0.0.1', url: 'http://127.0.0.1:8765', reuseExistingServer: false }
});
