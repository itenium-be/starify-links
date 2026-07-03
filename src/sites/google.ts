import { googleUrl } from "../config";
import { InsertContext, SiteHandler } from "./types";

function insert({ badge, badgeImg }: InsertContext) {
  const img = badge.el.getElementsByTagName('img');
  if (!img || !img.length) {
    // Could also be a "sublink" -- which do not have images!
    badge.el.prepend(badgeImg);

  } else {
    // Google now displays a GitHub logo
    // --> We replace the logo with the GitHub badge
    const githubLogo = img[0]!.parentNode!.parentNode! as Element;
    githubLogo.replaceWith(badgeImg);
    img[0].style.cssText = 'margin-right: 8px;';

    // Sometimes Google adds some additional stuff
    // Make sure it does not overlap
    const extraStuff = badge.el.parentNode!.parentNode?.childNodes[1]?.childNodes[1] as HTMLElement;
    if (extraStuff) {
      extraStuff.style.marginLeft = '80px';
    } else {
      // TODO: see https://github.com/itenium-be/starify-links/issues/26
      // We get here when showing google youtube results in "People also ask" section
      // console.log('UNEXPECTED')
      // console.log(badge.el);
      // console.log(badge.el.parentNode!.parentNode?.childNodes[1]);
      console.error(`Unexpected layout for ${badge.badgeUrl}`);
      // console.log('UNEXPECTED')
    }
  }
}

export const google: SiteHandler = {
  id: 'google',
  url: googleUrl,
  insert,
};
