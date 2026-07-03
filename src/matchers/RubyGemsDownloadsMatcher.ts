import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/gem/dt/{gem}';

export class RubyGemsDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/rubygems\.org\/gems\/([^/?#]+)/);
    if (match) {
      const gem = match[1];

      return {
        baseUrl: link.href.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{gem}', gem),
        badgeType: 'rubyGemsDownloads',
      };
    }
    return null;
  }
}
