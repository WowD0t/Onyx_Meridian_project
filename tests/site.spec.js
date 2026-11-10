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
  await expect(page.locator('[data-dlstats-seg="cf"]').first()).toHaveCSS('width', '0px');
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
    const key = (await caches.keys()).find(name => name.startsWith('om-site-v'));
    if (!key) return false;
    const c = await caches.open(key);
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

test('bulletin supports searching, filters, marking read and settings', async ({ page }) => {
  await page.goto('/ru-index.html');
  await page.locator('#notification-btn').click();
  const panel = page.locator('#notification-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.notification-item')).toHaveCount(3);
  await panel.locator('.notification-search').fill('лицензия');
  await expect(panel.locator('.notification-item')).toHaveCount(1);
  await panel.locator('.notification-search').fill('');
  await panel.locator('.notification-mark').first().click();
  await panel.locator('[data-focus-key="tab-unread"]').click();
  await expect(panel.locator('.notification-item')).toHaveCount(2);
  await panel.locator('[data-focus-key="settings"]').click();
  await expect(panel.locator('.om-notify-settings')).toBeVisible();
  await panel.locator('[data-focus-key="settings"]').click();
  await panel.locator('[data-focus-key="mark-all"]').click();
  await expect(panel.locator('.notification-empty')).toContainText('Непрочитанных');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.locator('#notification-btn')).toBeFocused();
  await page.reload();
  await page.locator('#notification-btn').click();
  await expect(panel.locator('.notification-item.is-read')).toHaveCount(3);
});

test('offline refresh reports failure and never substitutes a different asset version', async ({ page, context }) => {
  await page.goto('/ru-index.html');
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.evaluate(() => window.OMUpdateSite());
  await expect(page.locator('.om-toast').filter({ hasText: 'Не удалось обновить сайт' })).toBeVisible();
  expect(await page.evaluate(async () => {
    try { await fetch('assets-css-style.css?v=missing'); return false; } catch (_) { return true; }
  })).toBe(true);
  await expect(page.locator('#theme-btn')).toBeVisible();
});

test('a newer build is detected even on the first check', async ({ page }) => {
  await page.route('**/build.json?**', route => route.fulfill({ json: { version: '99.0.0' } }));
  await page.goto('/ru-index.html');
  await expect(page.locator('.om-toast').filter({ hasText: '99.0.0' })).toBeVisible();
});

for (const lang of ['ru', 'en']) {
  test(`${lang} media: empty state replaces the unused player and catalogue`, async ({ page }) => {
    await page.goto(`/${lang}-media.html`);
    const root = page.locator('#om-player');
    await expect(root).toHaveAttribute('data-state', 'empty');
    await expect(page.locator('#om-empty-title')).toHaveText(lang === 'ru' ? 'Видео пока нет' : 'No videos yet');
    await expect(page.locator('.om-media-empty-link')).toBeVisible();
    await expect(page.locator('#library-section')).toBeHidden();
    await expect(page.locator('.om-player-side')).toBeHidden();
    await expect(page.locator('.media-actions')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('media load failure is distinct and can be retried', async ({ page }) => {
  let attempts = 0;
  await page.route('**/videos.json?*', route => {
    attempts++;
    return attempts === 1 ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.fulfill({ json: { videos: [] } });
  });
  await page.goto('/ru-media.html');
  await expect(page.locator('#om-player')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#om-empty-title')).toHaveText('Не удалось загрузить медиатеку');
  await expect(page.locator('.om-media-empty-link')).toBeHidden();
  await page.locator('.om-media-retry').click();
  await expect(page.locator('#om-player')).toHaveAttribute('data-state', 'empty');
  // Once the worker takes control, the retry may bypass Playwright routing.
});

test('media with videos supports selection, filtering, search and empty search results', async ({ page }) => {
  await page.route('**/videos.json?*', route => route.fulfill({ json: { videos: [
    { id: 'one', title_ru: 'Первое видео', desc_ru: 'Описание', date: '2025-01-01', tags: ['Обзор'], chapters: [], sources: [{ platform: 'file', url: 'missing.mp4' }] },
    { id: 'two', title_ru: 'Второе видео', date: '2026-01-01', tags: ['Гайд'], chapters: [{ t: 0, ru: 'Начало' }], sources: [{ platform: 'file', url: 'missing.mp4' }] }
  ] } }));
  await page.goto('/ru-media.html');
  await expect(page.locator('#om-player')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('#library-section')).toBeVisible();
  await expect(page.locator('#om-title')).toHaveText('Первое видео');
  await expect(page.locator('#om-chapters').locator('..')).toBeHidden();
  await expect(page.locator('#om-video-library .om-video-card').first()).toContainText('Второе видео');
  await page.locator('#om-video-library .om-video-card').first().click();
  await expect(page.locator('#om-title')).toHaveText('Второе видео');
  await expect(page.locator('#om-chapters')).toContainText('Начало');
  await page.locator('#om-library-filters button', { hasText: 'Гайд' }).click();
  await expect(page.locator('#om-video-library .om-video-card')).toHaveCount(1);
  await page.locator('#om-library-search').fill('нет такого видео');
  await expect(page.locator('.om-library-empty')).toContainText('Ничего не найдено');
  await expect(page.locator('.om-library-empty')).not.toContainText('Видео пока нет');
  const search = await page.locator('#om-library-search').boundingBox();
  expect(search.height).toBeGreaterThanOrEqual(40);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('media uses cached video data when offline', async ({ page, context }) => {
  await page.goto('/ru-media.html');
  await expect(page.locator('#om-player')).toHaveAttribute('data-state', 'empty');
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  // Reload under the controlling worker so videos.json enters the site cache.
  await page.reload();
  await expect(page.locator('#om-player')).toHaveAttribute('data-state', 'empty');
  await page.waitForFunction(async () => {
    const c = await caches.open((await caches.keys()).find(k => k.startsWith('om-site-v')));
    return !!(await c.match(new URL('videos.json', location.href)));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#om-player')).toHaveAttribute('data-state', 'empty');
});
