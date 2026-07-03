import { test, expect } from '@playwright/test';
import { activateDirectlyOn, isWhitelisted } from '../src/directActivation';

const isWhitelistedUrl = (url: string) =>
  activateDirectlyOn.some(a => a.enabled && isWhitelisted(a.url, url));

test.describe('activateDirectlyOn whitelist', () => {
  test('activates on Brave Search', () => {
    expect(isWhitelistedUrl('https://search.brave.com/search?q=react')).toBe(true);
  });

  test('activates on Yahoo Search', () => {
    expect(isWhitelistedUrl('https://search.yahoo.com/search?p=react')).toBe(true);
  });

  test('does not activate on an unrelated site', () => {
    expect(isWhitelistedUrl('https://example.com/')).toBe(false);
  });
});
