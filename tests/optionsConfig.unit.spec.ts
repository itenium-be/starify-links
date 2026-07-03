import { test, expect } from '@playwright/test';
import { badgeCategories, countEnabled } from '../src/options/optionsConfig';

const gitlab = badgeCategories.find(c => c.name === 'GitLab Badges')!;

test.describe('countEnabled', () => {
  test('counts every badge whose predicate is true', () => {
    expect(countEnabled(gitlab, () => true)).toBe(gitlab.badges.length);
  });

  test('counts none when predicate is always false', () => {
    expect(countEnabled(gitlab, () => false)).toBe(0);
  });

  test('counts only the matching badges', () => {
    expect(countEnabled(gitlab, key => key === 'gitlabStars')).toBe(1);
  });
});
