import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/pypi/dm/{package}';

export class PypiDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/pypi\.org\/project\/([^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://pypi.org/project/${pkg}`.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'pypiDownloads',
      };
    }
    return null;
  }
}
