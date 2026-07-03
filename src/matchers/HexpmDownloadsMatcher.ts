import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/hexpm/dt/{package}.svg';

export class HexpmDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/hex\.pm\/packages\/([^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://hex.pm/packages/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'hexpmDownloads',
      };
    }
    return null;
  }
}
