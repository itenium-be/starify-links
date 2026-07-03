import { BadgeLinkInfo, BadgeMatcher, MatcherResult } from "../types";

const badgeUrlTemplate = 'https://img.shields.io/jetbrains/plugin/d/{pluginId}.svg';

export class JetBrainsPluginDownloadsMatcher implements BadgeMatcher {
  match(link: BadgeLinkInfo): MatcherResult | null {
    const match = link.href.match(/^https?:\/\/plugins\.jetbrains\.com\/plugin\/(\d+)/);
    if (match) {
      const pluginId = match[1];

      return {
        baseUrl: `https://plugins.jetbrains.com/plugin/${pluginId}`,
        badgeUrl: badgeUrlTemplate.replace('{pluginId}', pluginId),
        badgeType: 'jetbrainsPluginDownloads',
      };
    }
    return null;
  }
}
