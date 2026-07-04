import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/eclipse-marketplace/dt/{slug}.svg';

export class EclipseMarketplaceDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?marketplace\.eclipse\.org\/content\/([^/?#]+)/i);
    if (match) {
      const slug = match[1];

      return {
        baseUrl: `https://marketplace.eclipse.org/content/${slug.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{slug}', slug),
        badgeType: 'eclipseMarketplaceDownloads',
      };
    }
    return null;
  }
}
