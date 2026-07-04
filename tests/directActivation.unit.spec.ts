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

  test('activates on Hacker News', () => {
    expect(isWhitelistedUrl('https://news.ycombinator.com/item?id=42')).toBe(true);
  });

  test('activates on Lobsters', () => {
    expect(isWhitelistedUrl('https://lobste.rs/s/abc123/some_story')).toBe(true);
  });

  test('activates on Libraries.io', () => {
    expect(isWhitelistedUrl('https://libraries.io/npm/react')).toBe(true);
  });

  test('does not activate on an unrelated site', () => {
    expect(isWhitelistedUrl('https://example.com/')).toBe(false);
  });
});
