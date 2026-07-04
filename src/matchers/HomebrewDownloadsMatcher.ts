import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/homebrew/installs/dm/{formula}.svg';

export class HomebrewDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/formulae\.brew\.sh\/formula\/([^/?#]+)/);
    if (match) {
      const formula = match[1];

      return {
        baseUrl: `https://formulae.brew.sh/formula/${formula.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{formula}', formula),
        badgeType: 'homebrewDownloads',
      };
    }
    return null;
  }
}
