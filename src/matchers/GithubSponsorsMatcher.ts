import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/github/sponsors/{user}.svg';

export class GithubSponsorsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?github\.com\/sponsors\/([^/?#]+)/i);
    if (match) {
      const user = match[1];

      return {
        baseUrl: `https://github.com/sponsors/${user.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{user}', user),
        badgeType: 'githubSponsors',
      };
    }
    return null;
  }
}
