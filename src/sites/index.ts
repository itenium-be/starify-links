import { isWhitelisted } from "../directActivation";
import { bing } from "./bing";
import { brave } from "./brave";
import { duckDuckGo } from "./duckDuckGo";
import { githubIssues } from "./githubIssues";
import { google } from "./google";
import { yahoo } from "./yahoo";
import { InsertContext, SiteHandler } from "./types";

export const siteHandlers: SiteHandler[] = [google, bing, yahoo, brave, duckDuckGo, githubIssues];

export function findSiteHandler(currentUrl: string): SiteHandler | undefined {
  return siteHandlers.find(handler => isWhitelisted(handler.url, currentUrl));
}

export function unwrapHref(href: string): string {
  return siteHandlers.reduce((acc, handler) => handler.unwrap ? handler.unwrap(acc) : acc, href);
}

export function defaultInsert({ badge, badgeImg }: InsertContext) {
  badge.el.prepend(badgeImg);
}
