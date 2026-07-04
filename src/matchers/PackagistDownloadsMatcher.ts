import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/packagist/dt/{vendor}/{package}.svg';

export class PackagistDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?packagist\.org\/packages\/([^/?#]+)\/([^/?#]+)/);
    if (match) {
      const vendor = match[1];
      const pkg = match[2];

      return {
        baseUrl: `https://packagist.org/packages/${vendor.toLowerCase()}/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{vendor}', vendor).replace('{package}', pkg),
        badgeType: 'packagistDownloads',
      };
    }
    return null;
  }
}
