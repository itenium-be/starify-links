import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/docker/pulls/{repo}.svg';

export class DockerPullsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/hub\.docker\.com\/(?:r\/([^/?#]+)\/([^/?#]+)|_\/([^/?#]+))/);
    if (match) {
      const repo = match[3] ? `library/${match[3]}` : `${match[1]}/${match[2]}`;

      return {
        baseUrl: `https://hub.docker.com/${repo}`.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{repo}', repo),
        badgeType: 'dockerPulls',
      };
    }
    return null;
  }
}
