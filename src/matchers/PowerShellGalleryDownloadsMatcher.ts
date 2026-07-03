import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/powershellgallery/dt/{package}.svg';

export class PowerShellGalleryDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/(?:www\.)?powershellgallery\.com\/packages\/([^/?#]+)/);
    if (match) {
      const pkg = match[1];

      return {
        baseUrl: `https://www.powershellgallery.com/packages/${pkg.toLowerCase()}`,
        badgeUrl: badgeUrlTemplate.replace('{package}', pkg),
        badgeType: 'powershellGalleryDownloads',
      };
    }
    return null;
  }
}
