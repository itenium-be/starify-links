import { test, expect } from '@playwright/test';
import { setupTestPage, triggerStarify } from './test-utils';

// Load the dummy html files from /tests/fixtures and run tests against them

test.describe('Badge Rendering against html fixtures', () => {
  test('should add badge to a GitHub link', async ({ page }) => {
    await setupTestPage(page, 'github.html');

    const badges = page.locator('img[src*="shields.io/github/stars"]');
    await expect(badges).toHaveCount(1);

    const vscodeBadge = page.locator('img[src*="microsoft/vscode"]');
    await expect(vscodeBadge).toBeVisible();
  });

  test('should add badge even when the link is weird', async ({ page }) => {
    await setupTestPage(page, 'github-special.html');

    await expect(page.locator('img[src*="microsoft/vscode"]')).toHaveCount(1);
    await expect(page.locator('img[src*="itenium-be/Git-NumberedAdd"]')).toHaveCount(1);
    await expect(page.locator('img[src*="thomhurst/TUnit"]')).toHaveCount(1);
    await expect(page.locator('img[src*="facebook/react"]')).toHaveCount(1);
    await expect(page.locator('img[src*="typescript-cheatsheets/react"]')).toHaveCount(1);
  });

  test('should not add a badge to other links', async ({ page }) => {
    await setupTestPage(page, 'other.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(0);
  });

  test('should not add a badge to blacklisted GitHub links', async ({ page }) => {
    await setupTestPage(page, 'blacklisted.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(0);
  });

  test('should still badge repos owned by the github org', async ({ page }) => {
    await setupTestPage(page, 'github-org-repo.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(1);
  });

  test('should work correctly with GitHub and other links', async ({ page }) => {
    await setupTestPage(page, 'integration.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(2);
  });

  test('should work correctly when the github link ends with repoName.git', async ({ page }) => {
    await setupTestPage(page, 'with-git-extension.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(1);
  });

  test('should not add the same badge twice', async ({ page }) => {
    await setupTestPage(page, 'double.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(1);
  });

  test('should not add the same badge twice even when the links are not exactly the same', async ({ page }) => {
    await setupTestPage(page, 'double-diff.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(1);
  });

  test('should add the 2 badges when the links start with the same string', async ({ page }) => {
    await setupTestPage(page, 'double-diff-real.html');

    const badges = page.locator('img[src*="shields.io"]');
    await expect(badges).toHaveCount(2);
  });

  test('should shorten the URL', async ({ page }) => {
    await setupTestPage(page, 'github-full.html');

    const full = page.getByTestId('full');
    await expect(full).toHaveText('microsoft/vscode');

    const half = page.getByTestId('half');
    await expect(half).toHaveText('itenium-be/Git-NumberedAdd');

    const custom = page.getByTestId('custom');
    await expect(custom).toHaveText('Custom Description');
  });

  test('should not add a badge twice when triggering the extension multiple times', async ({ page }) => {
    await setupTestPage(page, 'github.html');

    const badgesFirst = page.locator('img[src*="shields.io/github/stars"]');
    await expect(badgesFirst).toHaveCount(1);

    await triggerStarify(page);

    const badgesAfter = page.locator('img[src*="shields.io/github/stars"]');
    await expect(badgesAfter).toHaveCount(1);
  });
});
