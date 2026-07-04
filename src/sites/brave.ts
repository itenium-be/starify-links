import { InsertContext, SiteHandler } from "./types";

const braveSearch = /^https:\/\/search\.brave\.com\/search/;

function insert({ badge, badgeImg }: InsertContext) {
  const favicon = badge.el.querySelector('.favicon-wrapper');
  if (favicon) {
    favicon.replaceWith(badgeImg);
  } else {
    badge.el.prepend(badgeImg);
  }
}

export const brave: SiteHandler = {
  id: 'brave',
  url: braveSearch,
  insert,
};
