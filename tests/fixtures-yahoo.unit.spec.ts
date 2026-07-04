import { test, expect } from '@playwright/test';
import { setupYahooPage } from './test-utils';

// Yahoo wraps results in r.search.yahoo.com/.../RU=<encoded> redirects and shows
// a favicon on the breadcrumb row. We decode the link and replace that favicon
// with the Star badge, like Google and DuckDuckGo.

test.describe('Yahoo Rendering against html fixtures', () => {
  test('adds a badge for the redirect-wrapped GitHub result', async ({ page }) => {
    await setupYahooPage(page, 'yahoo.html');

    await expect(page.locator('img[src*="github/stars/react/react"]')).toHaveCount(1);
  });

  test('replaces the Yahoo favicon with the badge', async ({ page }) => {
    await setupYahooPage(page, 'yahoo.html');

    // The original favicon is gone...
    await expect(page.locator('img.s-img')).toHaveCount(0);
    // ...replaced in place on the breadcrumb row.
    await expect(page.locator('div.p-abs img[src*="shields.io"]')).toHaveCount(1);
  });
});
