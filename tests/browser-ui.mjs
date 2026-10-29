// Optional browser regression check. See docs/ui-reference.md for setup.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseUrl = process.env.UI_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch(process.env.UI_BROWSER_PATH
  ? { executablePath: process.env.UI_BROWSER_PATH, headless: true }
  : { channel: 'chrome', headless: true });
const routes = ['/', '/login', '/register', '/forgot-password', '/cart', '/shipping', '/blog', '/admin/dashboard', '/ui-missing-page'];
let checks = 0;
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /hydrat|server rendered/i.test(message.text())) errors.push(message.text());
  });
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      errors.length = 0;
      await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle', timeout: 60000 });
      await page.locator('main').waitFor();
      const observed = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        background: getComputedStyle(document.body).backgroundColor,
        introductionAlignment: document.querySelector('.store-intro')
          ? getComputedStyle(document.querySelector('.store-intro')).textAlign : null,
      }));
      assert.ok(observed.scrollWidth <= observed.viewport + 1, `${route} overflows at ${width}px`);
      assert.deepEqual(errors, [], `${route} has runtime errors at ${width}px`);
      if (route === '/') {
        // Guards the original regression: markup rendered while the new CSS never loaded.
        assert.equal(observed.background, 'rgb(255, 255, 255)');
        assert.equal(observed.introductionAlignment, 'center');
      }
      checks++;
    }
  }
  console.log(`Passed ${checks} browser route/viewport checks.`);
} finally {
  await browser.close();
}
