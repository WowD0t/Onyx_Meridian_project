const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('https://countapi.mileshilliard.com/**', route => route.fulfill({ json: { value: 5 } }));
  await page.route('https://api.cfwidget.com/**', route => route.fulfill({ json: { downloads: { total: 213 } } }));
});

test('system theme follows the device, explicit choice survives navigation', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/ru-index.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'system');
  await page.locator('#theme-btn').click();
  await page.locator('[data-theme-choice="dark"]').click();
  await page.goto('/ru-gloamguise-index.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-btn').click();
  await page.locator('[data-theme-choice="system"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'system');
});

test('statistics, icons and mobile controls render without overflow', async ({ page }) => {
  await page.goto('/ru-index.html');
  await expect(page.locator('[data-dlstats-total]').first()).toHaveText('218');
  const icon = page.locator('.om-feed-ico svg').first();
  await expect(icon).toHaveCSS('fill', 'none');
  await expect(icon).toHaveCSS('stroke', /rgb/);
  await page.locator('#notification-btn').click();
  await expect(page.locator('.notification-search')).toBeVisible();
  const panel = await page.locator('.notification-panel').boundingBox();
  const search = await page.locator('.notification-search').boundingBox();
  expect(search.height).toBeGreaterThanOrEqual(40);
  expect(panel.width).toBeLessThanOrEqual(390);
  expect(panel.y + panel.height).toBeLessThanOrEqual(844);
  await page.goto('/ru-gloamguise-index.html');
  await expect(page.locator('.om-mobile-actionbar a').first()).toHaveAttribute('href', '#download');
  await page.locator('.om-mobile-actionbar a').first().click();
  await expect(page).toHaveURL(/#download$/);
});

test('a missing source does not turn into a misleading total', async ({ page }) => {
  await page.unroute('https://countapi.mileshilliard.com/**');
  await page.route('https://countapi.mileshilliard.com/**', route => route.abort());
  await page.goto('/ru-index.html');
  await expect(page.locator('[data-cf-downloads]').first()).toHaveText('213');
  await expect(page.locator('[data-dlstats-total]').first()).toHaveText('—');
});

test('refresh keeps search and anchor and cached pages open offline', async ({ page, context }) => {
  await page.goto('/ru-index.html?q=test#updates');
  await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 10000 });
  await page.evaluate(() => window.OMUpdateSite());
  await page.waitForURL(/om-refresh=\d+/);
  await expect(page).toHaveURL(/q=test.*#updates$/);
  await expect(page.locator('#theme-btn')).toBeVisible();
  // Wait for the refreshed navigation to be cached before disabling the network.
  await page.waitForFunction(async () => {
    const c = await caches.open('om-site-v31');
    return !!(await c.match(location.href, { ignoreSearch: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#theme-btn')).toBeVisible();
});

test('each direct-download click is recorded without device fingerprinting', async ({ page }) => {
  let hits = 0;
  await page.unroute('https://countapi.mileshilliard.com/**');
  await page.route('https://countapi.mileshilliard.com/**', route => {
    if (route.request().url().includes('/hit/')) hits++;
    return route.fulfill({ json: { value: 5 + hits } });
  });
  await page.goto('/ru-gloamguise-index.html');
  const direct = page.locator('#download-panel a[download]').first();
  await direct.click();
  await expect.poll(() => hits).toBe(1);
  await direct.click();
  await expect.poll(() => hits).toBe(2);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('om-dl-v2-1-5-')))).toEqual([]);
});
