import { googleUrl } from "../config";
import { InsertContext, SiteHandler } from "./types";

function insert({ badge, badgeImg }: InsertContext) {
  const img = badge.el.getElementsByTagName('img');
  if (!img || !img.length) {
    // Could also be a "sublink" -- which do not have images!
    badge.el.prepend(badgeImg);

  } else {
    // Sometimes Google adds some additional stuff
    // Make sure it does not overlap
    const extraStuff = badge.el.parentNode!.parentNode?.childNodes[1]?.childNodes[1] as HTMLElement;
    if (extraStuff) {
      // Google now displays a GitHub logo
      // --> We replace the logo with the GitHub badge
      const githubLogo = img[0]!.parentNode!.parentNode! as Element;
      githubLogo.replaceWith(badgeImg);
      img[0].style.cssText = 'margin-right: 8px;';
      extraStuff.style.marginLeft = '80px';
    } else {
      badge.el.prepend(badgeImg);
    }
  }
}

export const google: SiteHandler = {
  id: 'google',
  url: googleUrl,
  insert,
};
