import { test, expect } from '@playwright/test';
import { isSameUrlNavigation } from '../src/navigationFilter';

test('is a same-url navigation when destination equals the current url', () => {
  const event = { destination: { url: 'https://github.com/itenium-be/Mi-Ke' } };
  expect(isSameUrlNavigation(event, 'https://github.com/itenium-be/Mi-Ke')).toBe(true);
});

test('is not a same-url navigation when destination differs from the current url', () => {
  const event = { destination: { url: 'https://github.com/itenium-be/Git-NumberedAdd' } };
  expect(isSameUrlNavigation(event, 'https://github.com/itenium-be/Mi-Ke')).toBe(false);
});

test('is not a same-url navigation when the destination url is unavailable', () => {
  expect(isSameUrlNavigation({}, 'https://github.com/itenium-be/Mi-Ke')).toBe(false);
});
