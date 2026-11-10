const { test, expect } = require('@playwright/test');

test.use({ serviceWorkers: 'block' });

async function fillForm(page, lang = 'ru') {
  await page.goto(`/${lang}-support.html`);
  await page.locator('#topic').selectOption('question');
  await page.locator('#project').selectOption('studio');
  await page.locator('#summary').fill('Test support request');
  await page.locator('#message').fill('This is a test message with enough details for the form.');
  await page.locator('#email').fill('reader@example.com');
  await page.locator('#consent').check();
}

for (const lang of ['ru', 'en']) {
  test(`${lang}: confirmed primary delivery uses the configured Apps Script`, async ({ page }) => {
    let payload;
    await page.route('https://script.google.com/**', async route => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true, id: payload.id }, headers: { 'Access-Control-Allow-Origin': '*' } });
    });
    await fillForm(page, lang);
    await page.locator('#support-submit').click();
    await expect(page.locator('#support-success')).toBeVisible();
    await expect(page.locator('#support-fallback')).toBeHidden();
    expect(payload.email).toBe('reader@example.com');
    expect(payload.consent).toBe(true);
    expect(payload.attachments).toEqual([]);
    expect(payload.id).toBeTruthy();
  });
}

test('explicit primary rejection shows its safe code and fallback requires a click', async ({ page }) => {
  let primary, backup;
  await page.route('https://script.google.com/**', async route => {
    primary = route.request().postDataJSON();
    await route.fulfill({ json: { ok: false, code: 'site-key' }, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  await page.route('https://api.web3forms.com/**', async route => {
    backup = route.request().postDataJSON();
    await route.fulfill({ json: { success: true }, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  await fillForm(page);
  await page.locator('#support-submit').click();
  await expect(page.locator('#support-status')).toContainText('site-key');
  await expect(page.locator('#support-fallback')).toBeVisible();
  expect(backup).toBeUndefined();
  await page.locator('#support-fallback').click();
  await expect(page.locator('#support-status')).toContainText('резервный канал');
  expect(backup.message).toContain(primary.id);
  expect(backup.message).toContain('primary-site-key');
});

test('lost response is not reported as failure or automatically duplicated; retry uses the same id', async ({ page }) => {
  const ids = [];
  let backupCalls = 0;
  await page.route('https://script.google.com/**', async route => {
    ids.push(route.request().postDataJSON().id);
    if (ids.length === 1) return route.abort();
    return route.fulfill({ json: { ok: true, duplicate: true }, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  await page.route('https://api.web3forms.com/**', route => { backupCalls++; return route.abort(); });
  await fillForm(page);
  await page.locator('#support-submit').click();
  await expect(page.locator('#support-status')).toContainText('Письмо могло быть доставлено');
  await expect(page.locator('#support-fallback')).toBeVisible();
  expect(backupCalls).toBe(0);
  await page.locator('#support-submit').click();
  await expect(page.locator('#support-success')).toBeVisible();
  expect(ids).toHaveLength(2);
  expect(ids[1]).toBe(ids[0]);
  expect(backupCalls).toBe(0);
});

test('editing after an uncertain result hides the fallback and creates a new request id', async ({ page }) => {
  const ids = [];
  await page.route('https://script.google.com/**', async route => { ids.push(route.request().postDataJSON().id); await route.abort(); });
  await fillForm(page);
  await page.locator('#support-submit').click();
  await expect(page.locator('#support-fallback')).toBeVisible();
  await page.locator('#message').fill('Edited test message with enough details for the form.');
  await expect(page.locator('#support-fallback')).toBeHidden();
  await page.locator('#support-submit').click();
  await expect(page.locator('#support-fallback')).toBeVisible();
  expect(ids).toHaveLength(2);
  expect(ids[1]).not.toBe(ids[0]);
});

test('support page is usable on narrow screens and the file picker resets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await fillForm(page);
  await expect(page.locator('#topic')).toHaveCSS('height', '48px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const picker = page.locator('.om-filepicker input[type=file]').first();
  await picker.setInputFiles({ name: 'test.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  await expect(page.locator('.om-fileitem')).toHaveCount(1);
  await page.locator('button[type=reset]').click();
  await expect(page.locator('.om-fileitem')).toHaveCount(0);
  await expect(page.locator('#message-count')).toHaveText('0');
});

test('a file is sent directly through the primary channel', async ({ page }) => {
  let payload;
  await page.route('https://script.google.com/**', route => {
    payload = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true }, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  await fillForm(page);
  await page.locator('.om-filepicker input[type=file]').first().setInputFiles({ name: 'report.txt', mimeType: 'text/plain', buffer: Buffer.from('contents') });
  await page.locator('#om-upload-consent').check();
  await page.locator('#support-submit').click();
  await expect(page.locator('#support-success')).toBeVisible();
  expect(payload.attachments).toEqual([{ name: 'report.txt', type: 'text/plain', size: 8, data: 'Y29udGVudHM=' }]);
});
