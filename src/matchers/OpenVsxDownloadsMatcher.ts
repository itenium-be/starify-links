import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/open-vsx/dt/{namespace}/{extension}.svg';

export class OpenVsxDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/open-vsx\.org\/extension\/([^/?#]+)\/([^/?#]+)/);
    if (match) {
      const namespace = match[1];
      const extension = match[2];

      return {
        baseUrl: `https://open-vsx.org/extension/${namespace.toLowerCase()}/${extension.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{namespace}', namespace).replace('{extension}', extension),
        badgeType: 'openVsxDownloads',
      };
    }
    return null;
  }
}
