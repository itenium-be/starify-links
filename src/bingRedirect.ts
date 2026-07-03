const bingRedirect = /^https?:\/\/(?:www\.)?bing\.com\/ck\/a\?/i;

export function unwrapBingLink(href: string): string {
  if (!bingRedirect.test(href)) {
    return href;
  }

  try {
    const u = new URL(href).searchParams.get('u');
    if (!u || !u.startsWith('a1')) {
      return href;
    }

    const base64 = u.slice(2).replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(padded);
  } catch {
    return href;
  }
}
