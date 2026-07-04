import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/pub/dm/{package}.svg';

export class PubDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/pub\.dev\/packages\/([^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://pub.dev/packages/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'pubDownloads',
      };
    }
    return null;
  }
}
