import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/sourceforge/dt/{project}.svg';

export class SourceForgeDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?sourceforge\.net\/projects\/([^/?#]+)/);
    if (match) {
      const project = match[1];

      return {
        baseUrl: `https://sourceforge.net/projects/${project.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{project}', project),
        badgeType: 'sourceForgeDownloads',
      };
    }
    return null;
  }
}
