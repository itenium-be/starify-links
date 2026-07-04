import { test, expect } from '@playwright/test';
import { setupGooglePage } from './test-utils';

// A result anchor with a favicon <img> before the title text. Whitespace between
// structural nodes is omitted on purpose: Google ships minified DOM and the code
// walks childNodes by index, which would otherwise land on text nodes.
const result = (href: string) =>
  `<a class="res" href="${href}"><span class="logo"><span><img class="fav" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="></span></span><span>the title</span></a>`;

const REPO = 'https://github.com/facebook/react';

test.describe('Google badge rendering', () => {
  test('replaces the site logo when the expected layout is present', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));

    // badge.el.parentNode.parentNode == .pp, whose childNodes[1].childNodes[1]
    // exists -> the "extraStuff" overlap-fix path (the working layout).
    await setupGooglePage(page,
      `<div class="pp"><span>x</span><div class="mid"><span>a</span><div class="extra">b</div></div><span class="wrap">${result(REPO)}</span></div>`);

    await expect(page.locator('img[src*="shields.io/github/stars/facebook/react"]')).toHaveCount(1);
    // Logo was replaced -> the favicon is gone.
    await expect(page.locator('a.res img.fav')).toHaveCount(0);
    expect(errors.filter(e => /Unexpected layout/i.test(e))).toEqual([]);
  });

  test('falls back to prepending before the text on an unexpected layout', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));

    // No "extraStuff" wrapper (as in "People also ask" answers) -> must not error.
    await setupGooglePage(page, `<div class="outer"><div class="paa">${result(REPO)}</div></div>`);

    const badge = page.locator('img[src*="shields.io/github/stars/facebook/react"]');
    await expect(badge).toHaveCount(1);
    // Fallback keeps the favicon and puts the badge in front of the text.
    await expect(page.locator('a.res img.fav')).toHaveCount(1);
    await expect(page.locator('a.res > :first-child')).toHaveAttribute('src', /shields\.io/);
    expect(errors.filter(e => /Unexpected layout/i.test(e))).toEqual([]);
  });
});
