import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/nuget/dt/{package}.svg';

export class NugetDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?nuget\.org\/packages\/([^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://www.nuget.org/packages/${pkg}`.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'nugetDownloads',
      };
    }
    return null;
  }
}
