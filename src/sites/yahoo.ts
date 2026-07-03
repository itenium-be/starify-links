import { SiteHandler } from "./types";

const yahooSearch = /^https:\/\/([a-z]+\.)?search\.yahoo\.com\/search/;
const yahooRedirect = /^https?:\/\/r\.search\.yahoo\.com\//i;

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
};
