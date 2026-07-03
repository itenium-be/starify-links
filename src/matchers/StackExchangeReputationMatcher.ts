import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/stackexchange/{site}/r/{userId}.svg';

const hostToSite: Record<string, string> = {
  'stackoverflow.com': 'stackoverflow',
  'superuser.com': 'superuser',
  'serverfault.com': 'serverfault',
  'askubuntu.com': 'askubuntu',
  'mathoverflow.net': 'mathoverflow',
  'stackapps.com': 'stackapps',
};

export class StackExchangeReputationMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?([a-z0-9.-]+)\/users\/(\d+)/i);
    if (match) {
      const host = match[1].toLowerCase();
      const userId = match[2];

      const site = hostToSite[host]
        || (host.endsWith('.stackexchange.com') ? host.slice(0, -'.stackexchange.com'.length) : null);
      if (!site) {
        return null;
      }

      return {
        baseUrl: `https://${site}.stackexchange/users/${userId}`,
        badgeUrl: badgeUrlTemplate.replace('{site}', site).replace('{userId}', userId),
        badgeType: 'stackExchangeReputation',
      };
    }
    return null;
  }
}
