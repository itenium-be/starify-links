import { getCurrentUrl, shieldsConfig } from "./config";
import { findConfig } from "./directActivation";
import { defaultInsert, findSiteHandler } from "./sites";
import { BadgeInfo } from "./types";

export async function badgeRenderer(badge: BadgeInfo) {
  const currentUrl = getCurrentUrl();
  const urlConfig = await findConfig();

  // Shorten link text
  if (!urlConfig || urlConfig.replaceText !== false) {
    const linkText = (badge.el.innerText || '').trim();
    if (linkText.startsWith('https://github.com/')) {
      badge.el.innerText = linkText.substr(19);
    } else if (linkText.startsWith('github.com/')) {
      badge.el.innerText = linkText.substr(11);
    }
  }

  // Add badge
  const badgeImg = document.createElement('img');
  badgeImg.src = badge.badgeUrl;
  badgeImg.style.cssText = 'margin-right: 8px; margin-bottom: -5px;';
  badgeImg.style.height = '20px';
  badgeImg.onload = () => {
    const existingBadge = !!badge.el.querySelector(`img[src="${badge.badgeUrl}"]`) || badge.el.getAttribute('starified');
    if (existingBadge) {
      return;
    }

    const insert = findSiteHandler(currentUrl)?.insert ?? defaultInsert;
    insert({ badge, badgeImg });
  };
  badgeImg.onerror = (err) => setTimeout(() => {
    // TODO: maybe we need to look at the exact statusCode here before deciding what to do?
    console.error(`Error loading badge type=${badge.badgeType}, URL=${badge.badgeUrl}`, err);
    badgeRenderer(badge);
    shieldsConfig.attempt++;

  }, shieldsConfig.retryMs * shieldsConfig.attempt);
}
