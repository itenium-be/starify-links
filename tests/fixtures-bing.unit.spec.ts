import { test, expect } from '@playwright/test';
import { setupTestPage } from './test-utils';

// Load the /tests/fixtures/bing.html file and run tests against it.
// Bing wraps every outbound link in a https://www.bing.com/ck/a redirect
// where the real destination is base64url-encoded in the `u` parameter.

test.describe('Bing Rendering against html fixtures', () => {
  test('should add badges to Bing redirect-wrapped GitHub links', async ({ page }) => {
    await setupTestPage(page, 'bing.html');

    const reactBadge = page.locator('img[src*="facebook/react.svg"]');
    await expect(reactBadge).toHaveCount(1);

    const vscodeBadge = page.locator('img[src*="microsoft/vscode.svg"]');
    await expect(vscodeBadge).toHaveCount(1);
  });

  test('should not add badges to non-GitHub Bing links', async ({ page }) => {
    await setupTestPage(page, 'bing.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(2);
  });
});
