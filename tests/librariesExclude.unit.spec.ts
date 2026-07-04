import { test, expect } from '@playwright/test';
import * as path from 'path';
import { activateDirectlyOn } from '../src/directActivation';

const librariesExclude = activateDirectlyOn.find(a => a.label === 'Libraries.io')?.exclude;

test.describe('Libraries.io contributors exclusion', () => {
  test('excludes contributor avatar links but keeps the repository link', async ({ page }) => {
    expect(librariesExclude, 'Libraries.io activator should define an exclude selector').toBeTruthy();

    const fixturePath = path.join(__dirname, './fixtures/libraries-io-contributors.html');
    await page.goto(`file://${fixturePath}`);

    const result = await page.evaluate((selector) => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return {
        excluded: anchors.filter(a => a.closest(selector!)).map(a => a.getAttribute('href')),
        kept: anchors.filter(a => !a.closest(selector!)).map(a => a.getAttribute('href')),
      };
    }, librariesExclude);

    expect(result.kept).toContain('https://github.com/webpack/webpack');
    expect(result.excluded).toContain('https://github.com/sokra');
    expect(result.excluded).toContain('https://github.com/alexander-akait');
  });
});
