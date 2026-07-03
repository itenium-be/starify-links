import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/crates/d/{crate}.svg';

export class CratesDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/crates\.io\/crates\/([^/?#]+)/);
    if (match) {
      const crate = match[1];

      return {
        baseUrl: `https://crates.io/crates/${crate}`.toLowerCase(),
        badgeUrl: badgeUrlTemplate.replace('{crate}', crate),
        badgeType: 'cratesDownloads',
      };
    }
    return null;
  }
}
