import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/myget/{feed}/dt/{package}.svg';

export class MyGetDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?myget\.org\/feed\/([^/?#]+)\/package\/[^/?#]+\/([^/?#]+)/i);
    if (match) {
      const feed = match[1];
      const pkg = match[2];

      return {
        baseUrl: `https://www.myget.org/feed/${feed.toLowerCase()}/package/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{feed}', feed).replace('{package}', pkg),
        badgeType: 'myGetDownloads',
      };
    }
    return null;
  }
}
