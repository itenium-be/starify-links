import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/liberapay/patrons/{account}.svg';

export class LiberapayPatronsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?liberapay\.com\/([^/?#]+)/i);
    if (match) {
      const account = match[1];

      return {
        baseUrl: `https://liberapay.com/${account}`,
        badgeUrl: badgeUrlTemplate.replace('{account}', account),
        badgeType: 'liberapayPatrons',
      };
    }
    return null;
  }
}
