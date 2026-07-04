import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/steam/downloads/{fileId}.svg';

export class SteamWorkshopDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+)/);
    if (match) {
      const fileId = match[1];

      return {
        baseUrl: `https://steamcommunity.com/sharedfiles/filedetails/?id=${fileId}`,
        badgeUrl: badgeUrlTemplate.replace('{fileId}', fileId),
        badgeType: 'steamWorkshopDownloads',
      };
    }
    return null;
  }
}
