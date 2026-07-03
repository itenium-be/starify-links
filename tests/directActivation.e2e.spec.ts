import { test, expect, chromium, BrowserContext } from '@playwright/test';
import * as path from 'path';
import { goToWhitelistedPage, getBadgeLocator } from './test-utils';

/** Increase timeout for badge checks to wait for the first retry after a 429 Too Many Requests **/
const BADGE_TIMEOUT = 35_000;

// Test the actual sites for which directActivation.ts is configured

test.describe('directActivation Sites - Should automatically add badges', () => {
  let context: BrowserContext;

  test.beforeAll(async () => {
    const extensionPath = path.join(__dirname, '../dist');

    context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        // '--disable-blink-features=AutomationControlled',
        // '--no-sandbox',
        // '--disable-infobars',
        // '--start-maximized',
        // '--window-size=1280,720',
      ],
      // ignoreDefaultArgs: ['--enable-automation'],
      // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      // To set userAgent: https://www.npmjs.com/package/user-agents
      // Could use playwright-extra and puppeteer-extra-plugin-stealth: https://stackoverflow.com/a/79382046/25184132
    });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.afterEach(async () => {
    for (const page of context.pages().slice(1)) {
      await page.close();
    }
  });

  test('on GitHub', async () => {
    const url = 'https://github.com/itenium-be/starify-links';
    const page = await goToWhitelistedPage(context, url);

    page.on('console', msg => console.log(`[browser] ${msg.text()}`));

    await expect(page.locator('img[src*="shields.io/github/stars"]').first()).toBeVisible({ timeout: BADGE_TIMEOUT });

    const mikeImg = getBadgeLocator(page, 'itenium-be/Mi-Ke');
    await expect(mikeImg).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on GitHub navigating from issues to issues/detail with SPA', async () => {
    const url = 'https://github.com/itenium-be/Mi-Ke/issues?q=%2352';
    const page = await goToWhitelistedPage(context, url);

    const detailsLink = page.getByTestId('issue-pr-title-link');
    await detailsLink.click();
    await page.waitForTimeout(3000);

    const badge = getBadgeLocator(page, 'microsoft/calculator');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on StackOverflow', async () => {
    const url = 'https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'facebook/create-react-app');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test.skip('on Google', async () => {
    const url = 'https://www.google.com/search?q=react+github';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'facebook/react');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test.skip('on Google.fr', async () => {
    const url = 'https://google.fr/search?q=react+github';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'facebook/react');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on nuget it adds two badges', async () => {
    // The first badge is on github.com/name/repo/releases
    // which is a link at the bottom of the page
    const url = 'https://www.nuget.org/packages/Newtonsoft.Json';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'JamesNK/Newtonsoft.Json');
    await expect(badge).toHaveCount(2, { timeout: BADGE_TIMEOUT });
  });

  test('on marketplace.visualstudio.com', async () => {
    const url = 'https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'aaron-bond/better-comments');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on marketplace.visualstudio.com, which has an observer, it also adds badges to other links', async () => {
    const url = 'https://marketplace.visualstudio.com/items?itemName=Prisma.prisma';
    const page = await goToWhitelistedPage(context, url);

    // Note that the github pages now forwards to: avocadowastaken/prettier-plugin-prisma
    const badge = getBadgeLocator(page, 'umidbekk/prettier-plugin-prisma');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on npmjs.com', async () => {
    const url = 'https://www.npmjs.com/package/react';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'facebook/react');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on npmjs.com, with many links to the same github repo', async () => {
    // Including repository-link and homePage-link
    const url = 'https://www.npmjs.com/package/date-holidays';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'commenthol/date-holidays');
    await expect(badge).toHaveCount(3, { timeout: BADGE_TIMEOUT });

    const repoLink = page.locator('#repository-link');
    await expect(repoLink).toHaveText('github.com/commenthol/date-holidays');
  });

  test('on npmjs.com, switch to a different package, adds/updates badges', async () => {
    const url = 'https://www.npmjs.com/package/react';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'facebook/react');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });

    const searchInput = page.getByRole('combobox');
    await searchInput.fill('@itenium/date-holidays-be');
    await page.getByRole('option').filter({ hasText: '@itenium/date-holidays-be' }).first().click();

    const repoLink = page.locator('#repository-link');
    await expect(repoLink).toHaveText('github.com/itenium-be/date-holidays-be');

    const newBadge = getBadgeLocator(page, 'itenium-be/date-holidays-be');
    await expect(newBadge).toHaveCount(2, { timeout: BADGE_TIMEOUT });
  });

  test('on npmjs.com, switch to a different package, removes badges if not a github link', async () => {
    const url = 'https://www.npmjs.com/package/react';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'facebook/react');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });

    const searchInput = page.getByRole('combobox');
    await searchInput.fill('@itenium/date-holidays-be');
    await page.getByRole('option').filter({ hasText: '@itenium/date-holidays-be' }).first().click();

    const repoLink = page.locator('#repository-link');
    await expect(repoLink).toHaveText('github.com/itenium-be/date-holidays-be');

    const newBadge = getBadgeLocator(page, 'itenium-be/date-holidays-be');
    await expect(newBadge).toHaveCount(2, { timeout: BADGE_TIMEOUT });

    const oldBadge = getBadgeLocator(page, 'facebook/react');
    await expect(oldBadge).toHaveCount(0, { timeout: BADGE_TIMEOUT });
  });

  test('on pypi.org', async () => {
    const url = 'https://pypi.org/project/requests/';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'psf/requests');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on rubygems.org', async () => {
    const url = 'https://rubygems.org/gems/rails';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'rails/rails');
    await expect(badge).toHaveCount(4, { timeout: BADGE_TIMEOUT });
  });

  test.skip('on packagist.org', async () => {
    // DISABLED: It actually shows the stars on the page already
    const url = 'https://packagist.org/packages/guzzlehttp/guzzle';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'guzzle/guzzle');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });

  test('on crates.io', async () => {
    const url = 'https://crates.io/crates/serde/1.0.228';
    const page = await goToWhitelistedPage(context, url);

    await expect(getBadgeLocator(page, 'serde-rs/serde')).not.toHaveCount(0, { timeout: BADGE_TIMEOUT });
  });

  test('on pkg.go.dev', async () => {
    const url = 'https://pkg.go.dev/github.com/gin-gonic/gin';
    const page = await goToWhitelistedPage(context, url);

    await expect(getBadgeLocator(page, 'gin-gonic/gin')).not.toHaveCount(0, { timeout: BADGE_TIMEOUT });
  });

  test.skip('on swiftpackageindex.com', async () => {
    // DISABLED: It actually shows the stars on the page already
    const url = 'https://swiftpackageindex.com/Alamofire/Alamofire';
    const page = await goToWhitelistedPage(context, url);

    await expect(getBadgeLocator(page, 'Alamofire/Alamofire')).not.toHaveCount(0, { timeout: BADGE_TIMEOUT });
  });

  test('on DuckDuckGo', async () => {
    const url = 'https://duckduckgo.com/?q=tensorflow+github';
    const page = await goToWhitelistedPage(context, url);

    const badge = getBadgeLocator(page, 'tensorflow/tensorflow');
    await expect(badge).toHaveCount(1, { timeout: BADGE_TIMEOUT });
  });
});
