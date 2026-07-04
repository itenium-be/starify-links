import { test, expect } from '@playwright/test';
import { setupBravePage } from './test-utils';

// Brave Search uses direct hrefs (no redirect) and shows a favicon per result.
// We replace that favicon with the Star badge, like Google/DuckDuckGo/Yahoo.

test.describe('Brave Rendering against html fixtures', () => {
  test('adds a badge for the direct GitHub result', async ({ page }) => {
    await setupBravePage(page, 'brave.html');

    await expect(page.locator('img[src*="github/stars/react/react"]')).toHaveCount(1);
  });

  test('replaces the Brave favicon with the badge', async ({ page }) => {
    await setupBravePage(page, 'brave.html');

    // The favicon block is gone...
    await expect(page.locator('.favicon-wrapper')).toHaveCount(0);
    // ...replaced in place on the site-name row.
    await expect(page.locator('.site-name-wrapper > img[src*="shields.io"]')).toHaveCount(1);
  });
});
