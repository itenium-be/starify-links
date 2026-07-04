import { InsertContext, SiteHandler } from "./types";

const yahooSearch = /^https:\/\/([a-z]+\.)?search\.yahoo\.com\/search/;
const yahooRedirect = /^https?:\/\/r\.search\.yahoo\.com\//i;

function insert({ badge, badgeImg }: InsertContext) {
  const favicon = badge.el.querySelector('.algo-favicon');
  if (favicon) {
    favicon.replaceWith(badgeImg);
  } else {
    badge.el.prepend(badgeImg);
  }
}

export function unwrapYahooLink(href: string): string {
  if (!yahooRedirect.test(href)) {
    return href;
  }

  const match = href.match(/\/RU=([^/]+)/);
  if (!match) {
    return href;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return href;
  }
}

export const yahoo: SiteHandler = {
  id: 'yahoo',
  url: yahooSearch,
  unwrap: unwrapYahooLink,
  insert,
};
