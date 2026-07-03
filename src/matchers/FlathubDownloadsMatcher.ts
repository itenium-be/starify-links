import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/flathub/downloads/{appId}.svg';

export class FlathubDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/flathub\.org\/apps\/(?:details\/)?([^/?#]+)/);
    if (match) {
      const appId = match[1];

      return {
        baseUrl: `https://flathub.org/apps/${appId}`,
        badgeUrl: badgeUrlTemplate.replace('{appId}', appId),
        badgeType: 'flathubDownloads',
      };
    }
    return null;
  }
}
