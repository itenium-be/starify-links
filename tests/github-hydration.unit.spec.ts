import { test, expect } from '@playwright/test';
import { setupGithubPage } from './test-utils';

test.describe('GitHub badges survive hydration re-render', () => {
  test('badge is still present after the container is re-rendered', async ({ page }) => {
    await setupGithubPage(page, 'github.html');

    await page.evaluate(() => {
      const container = document.querySelector('#test-link')!;
      container.innerHTML = '<a href="https://github.com/microsoft/vscode">VS Code</a>';
    });

    const badge = page.locator('img[src*="shields.io/github/stars/microsoft/vscode"]');
    await expect(badge).toHaveCount(1, { timeout: 5000 });
  });
});
