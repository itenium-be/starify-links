import { test, expect } from '@playwright/test';
import { setupTestPage } from './test-utils';

// Load the /tests/fixtures/google.html file and run tests against it
// directActivation tests for Google are currently .skip() because it
// sees that it's Playwright and shows a captcha.
// See directActivation.e2e.spec.ts for info how we could maybe work around that

test.describe('Google Rendering against html fixtures', () => {
  test('should add badge to Google search results', async ({ page }) => {
    await setupTestPage(page, 'google.html');

    const reactBadge = page.locator('img[src*="facebook/react.svg"]');
    await expect(reactBadge).toHaveCount(1);

    const reactNativeBadge = page.locator('img[src*="facebook/react-native.svg"]');
    await expect(reactNativeBadge).toHaveCount(1);
  });

  test('should add badge to the sublink of create-react-app', async ({ page }) => {
    await setupTestPage(page, 'google.html');

    const reactBadge = page.locator('img[src*="facebook/create-react-app.svg"]');
    await expect(reactBadge).toHaveCount(1);
  });
});
