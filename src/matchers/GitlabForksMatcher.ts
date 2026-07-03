import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/gitlab/forks/{projectId}.svg';

export class GitlabForksMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?gitlab\.com\/([^/?#]+(?:\/[^/?#]+)*)/);
    if (match) {
      const projectPath = match[1].split('/-/')[0];
      const projectId = encodeURIComponent(projectPath);

      return {
        baseUrl: `https://gitlab.com/${projectPath.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{projectId}', projectId),
        badgeType: 'gitlabForks',
      };
    }
    return null;
  }
}
