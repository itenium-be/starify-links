import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/conda/dn/{channel}/{package}.svg';

export class CondaDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/anaconda\.org\/([^/?#]+)\/([^/?#]+)/);
    if (match) {
      const channel = match[1];
      const pkg = match[2];

      return {
        baseUrl: `https://anaconda.org/${channel.toLowerCase()}/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{channel}', channel).replace('{package}', pkg),
        badgeType: 'condaDownloads',
      };
    }
    return null;
  }
}
