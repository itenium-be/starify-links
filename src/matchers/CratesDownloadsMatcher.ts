import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/crates/d/{crate}';

export class CratesDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/crates\.io\/crates\/([^/?#]+)/);
    if (match) {
      const crate = match[1];

      return {
        baseUrl: link.href.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{crate}', crate),
        badgeType: 'cratesDownloads',
      };
    }
    return null;
  }
}
