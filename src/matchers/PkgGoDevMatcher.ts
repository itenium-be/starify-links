import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/github/stars/{userName}/{repoName}.svg';

export class PkgGoDevMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/pkg\.go\.dev\/github\.com\/([^/#?@]+)\/([^/#?@]+)/i);
    if (match) {
      const userName = match[1];
      const repoName = match[2];

      return {
        baseUrl: `https://github.com/${userName.toLowerCase()}/${repoName.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{userName}', userName).replace('{repoName}', repoName),
        badgeType: 'githubRepository',
      };
    }
    return null;
  }
}
