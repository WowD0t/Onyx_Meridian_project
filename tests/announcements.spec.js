const { test, expect } = require('@playwright/test');
test.use({ serviceWorkers: 'block' });
const item = { id: 'ann-test-1', kind: 'warning', severity: 'info', title_ru: 'Тест от бота', body_ru: 'Текст объявления', title_en: 'Bot test', body_en: 'Announcement text', published_at: '2020-01-01T00:00:00Z', expires_at: '2099-01-01T00:00:00Z', date: '2020-01-01', url: '', pinned: false, banner: true, toast: true, browser: true };

test('bot announcement appears in the bulletin; pinning controls the banner and an empty URL adds no link', async ({ page }) => {
  let current = { schema: 3, items: [item] };
  await page.route('**/announcements.json?*', route => route.fulfill({ json: current }));
  await page.goto('/ru-index.html');
  await page.locator('#notification-btn').click();
  const article = page.locator('.notification-item', { hasText: 'Тест от бота' });
  await expect(article).toBeVisible();
  await expect(article.locator('.notification-cta')).toHaveCount(0);
  await expect(page.locator('.om-announce-banner')).toHaveCount(0);
  current = { schema: 3, items: [{ ...item, pinned: true }] };
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('.om-announce-banner')).toContainText('Тест от бота');
  current = { schema: 3, items: [] };
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(article).toHaveCount(0);
  await expect(page.locator('.om-announce-banner')).toHaveCount(0);
});

test('bot toast and browser flags are respected alongside user settings', async ({ page }) => {
  await page.route('**/announcements.json?*', route => route.fulfill({ json: { schema: 3, items: [] } }));
  await page.addInitScript(() => {
    localStorage.setItem('om-notification-prefs-v1', JSON.stringify({ toasts: true, browser: true }));
    window.testNotifications = [];
    function FakeNotification(title) { window.testNotifications.push(title); }
    FakeNotification.permission = 'granted';
    Object.defineProperty(window, 'Notification', { value: FakeNotification, configurable: true });
  });
  await page.goto('/ru-index.html');
  await page.evaluate(() => { window.testToasts = []; window.OMToast.show = o => window.testToasts.push(o.title); });
  await page.evaluate(() => {
    const make = (id, toast, browser) => ({ id, kind: 'warning', source: 'announcement', toast, browser, title: {ru:id,en:id}, body:{ru:'текст',en:'text'}, when:{ru:'',en:''} });
    const items = [make('neither', false, false), make('toast-only', true, false), make('browser-only', false, true)];
    document.dispatchEvent(new CustomEvent('om:announcements', { detail: { items, fresh: items } }));
  });
  expect(await page.evaluate(() => window.testToasts)).toEqual(['toast-only']);
  expect(await page.evaluate(() => window.testNotifications)).toEqual(['browser-only']);
});

test('toast stack evicts cleanly and allows the same notification again', async ({ page }) => {
  await page.goto('/ru-index.html');
  await page.evaluate(() => {
    for (let i = 0; i < 5; i++) window.OMToast.show({ id: 'test-' + i, title: 'Notice ' + i, timeout: 0 });
    window.OMToast.show({ id: 'test-0', title: 'Notice 0 again', timeout: 0 });
  });
  await expect(page.locator('.om-toast-stack .om-toast')).toHaveCount(4);
  await expect(page.locator('.om-toast-stack')).toContainText('Notice 0 again');
  await expect(page.locator('.om-toast-close').first()).toHaveAttribute('aria-label', 'Закрыть уведомление');
});

test('toast progress pauses while a user focuses its controls', async ({ page }) => {
  await page.goto('/ru-index.html');
  await page.evaluate(() => window.OMToast.show({ id: 'pause-test', title: 'Pause test', timeout: 1200 }));
  const toast = page.locator('.om-toast', { hasText: 'Pause test' });
  await toast.locator('.om-toast-close').focus();
  await page.waitForTimeout(1400);
  await expect(toast).toBeVisible();
  await page.locator('#notification-btn').focus();
  await expect(toast).toHaveCount(0, { timeout: 3000 });
});
