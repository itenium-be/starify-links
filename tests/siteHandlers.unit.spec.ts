import { test, expect } from '@playwright/test';
import { findSiteHandler, unwrapHref } from '../src/sites';

test.describe('findSiteHandler', () => {
  test('matches Google search by regex url', () => {
    expect(findSiteHandler('https://www.google.com/search?q=react')?.id).toBe('google');
  });

  test('matches Google on any TLD', () => {
    expect(findSiteHandler('https://google.fr/search?q=react')?.id).toBe('google');
  });

  test('matches Bing search', () => {
    expect(findSiteHandler('https://www.bing.com/search?q=react')?.id).toBe('bing');
  });

  test('matches DuckDuckGo by string prefix', () => {
    expect(findSiteHandler('https://duckduckgo.com/?q=react')?.id).toBe('duckduckgo');
  });

  test('matches GitHub issue detail pages', () => {
    expect(findSiteHandler('https://github.com/facebook/react/issues/42')?.id).toBe('github-issues');
  });

  test('returns undefined for unhandled sites', () => {
    expect(findSiteHandler('https://example.com/')).toBeUndefined();
  });
});

test.describe('unwrapHref', () => {
  test('decodes a Bing ck/a redirect to the real destination', () => {
    const real = 'https://github.com/facebook/react';
    const b64 = Buffer.from(real).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const wrapped = `https://www.bing.com/ck/a?u=a1${b64}`;
    expect(unwrapHref(wrapped)).toBe(real);
  });

  test('leaves non-redirect hrefs untouched', () => {
    expect(unwrapHref('https://github.com/facebook/react')).toBe('https://github.com/facebook/react');
  });
});
