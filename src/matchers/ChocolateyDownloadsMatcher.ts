import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/chocolatey/dt/{package}.svg';

export class ChocolateyDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:community\.)?chocolatey\.org\/packages\/([^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://community.chocolatey.org/packages/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'chocolateyDownloads',
      };
    }
    return null;
  }
}
