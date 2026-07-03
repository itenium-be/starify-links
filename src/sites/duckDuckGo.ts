import { InsertContext, SiteHandler } from "./types";

function insert({ badge, badgeImg }: InsertContext) {
  const imgContainer = badge.el.parentNode!.parentNode as Element;
  const img = imgContainer.getElementsByTagName('img');
  if (img && img.length === 1) {
    const imgEl = img[0] as HTMLImageElement;
    if (!imgEl.src.includes('shields.io')) {
      (img[0].parentNode?.parentNode?.parentElement as Element)?.replaceWith(badgeImg);
    }
  }
}

export const duckDuckGo: SiteHandler = {
  id: 'duckduckgo',
  url: 'https://duckduckgo.com',
  insert,
};
