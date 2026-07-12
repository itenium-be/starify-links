import { test, expect } from '@playwright/test';
import { setupGithubPage } from './test-utils';

test.describe('GitHub badges survive hydration re-render', () => {
  test('badge is still present after the container is re-rendered', async ({ page }) => {
    await setupGithubPage(page, 'github.html');

    await page.evaluate(async () => {
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
      const container = document.querySelector('#test-link')!;
      for (let i = 0; i < 8; i++) {
        container.innerHTML = '<a href="https://github.com/microsoft/vscode">VS Code</a>';
        await wait(100);
      }
    });

    const badge = page.locator('img[src*="shields.io/github/stars/microsoft/vscode"]');
    await expect(badge).toHaveCount(1, { timeout: 6000 });
  });
});
