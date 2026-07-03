import { InsertContext, SiteHandler } from "./types";

function insert({ badge, badgeImg }: InsertContext) {
  const firstChild = badge.el.firstChild as Element;
  const isAvatar = badge.badgeType === 'githubUserStars'
    && typeof firstChild?.getAttribute === 'function'
    && firstChild.getAttribute('data-testid') === 'github-avatar';

  if (!isAvatar) {
    badge.el.prepend(badgeImg);
    return;
  }

  // Github issue detail page
  const wrapper = document.createElement('div');
  badge.el.parentNode!.insertBefore(wrapper, badge.el);
  wrapper.appendChild(badge.el);
  wrapper.appendChild(badgeImg);
  badge.el.style.height = 'unset !important';
  badge.el.style.textAlign = 'center';
  badge.el.style.display = 'block';
  badgeImg.style.cssText = 'margin-top: 10px';
  badge.el.setAttribute('starified', '1');
}

export const githubIssues: SiteHandler = {
  id: 'github-issues',
  url: /https:\/\/github.com\/[^/#]+\/[^/#]+\/issues\/\d+/,
  insert,
};
