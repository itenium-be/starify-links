import { InsertContext, SiteHandler } from "./types";

function insert({ badge, badgeImg }: InsertContext) {
  badgeImg.style.verticalAlign = 'middle';
  badgeImg.style.marginBottom = '0';
  badge.el.prepend(badgeImg);
}

export const hackerNews: SiteHandler = {
  id: 'hackernews',
  url: 'https://news.ycombinator.com',
  insert,
};
