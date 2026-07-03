import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/opencollective/backers/{slug}.svg';

export class OpenCollectiveBackersMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/opencollective\.com\/([^/?#]+)/);
    if (match) {
      const slug = match[1];

      return {
        baseUrl: `https://opencollective.com/${slug.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{slug}', slug),
        badgeType: 'openCollectiveBackers',
      };
    }
    return null;
  }
}
