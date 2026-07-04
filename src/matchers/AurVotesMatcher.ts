import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/aur/votes/{package}.svg';

export class AurVotesMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?aur\.archlinux\.org\/packages\/([^/?#]+)/i);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://aur.archlinux.org/packages/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'aurVotes',
      };
    }
    return null;
  }
}
