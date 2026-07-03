import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/npm/dw/{package}.svg';

export class NpmDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?npmjs\.com\/package\/(@[^/?#]+\/[^/?#]+|[^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://www.npmjs.com/package/${pkg}`.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'npmDownloads',
      };
    }
    return null;
  }
}
