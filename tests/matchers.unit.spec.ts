import { test, expect } from '@playwright/test';
import { BadgeMatcher } from '../src/types';
import { ChromeWebStoreMatcher } from '../src/matchers/ChromeWebStoreMatcher';
import { FirefoxAddonMatcher } from '../src/matchers/FirefoxAddonMatcher';
import { GitlabStarsMatcher } from '../src/matchers/GitlabStarsMatcher';
import { HangarStarsMatcher } from '../src/matchers/HangarStarsMatcher';
import { LemmyMatcher } from '../src/matchers/LemmyMatcher';
import { ModrinthFollowersMatcher } from '../src/matchers/ModrinthFollowersMatcher';
import { NostrBandFollowersMatcher } from '../src/matchers/NostrBandFollowersMatcher';
import { ThunderstoreLikesMatcher } from '../src/matchers/ThunderstoreLikesMatcher';
import { YoutubeChannelSubscribersMatcher } from '../src/matchers/YoutubeChannelSubscribersMatcher';
import { GithubGistStarsMatcher } from '../src/matchers/GithubGistStarsMatcher';
import { PackagistDownloadsMatcher } from '../src/matchers/PackagistDownloadsMatcher';
import { SourceForgeDownloadsMatcher } from '../src/matchers/SourceForgeDownloadsMatcher';

const baseUrlOf = (m: BadgeMatcher, href: string) => m.match({ href, el: undefined as any })?.baseUrl;

/**
 * The same entity linked with a different trailing path / query / fragment must
 * dedupe to one badge, i.e. produce an identical baseUrl.
 */
test.describe('Matcher baseUrl canonicalization (dedup)', () => {
  const cases: Array<{ name: string; matcher: BadgeMatcher; variants: string[] }> = [
    { name: 'Chrome Web Store', matcher: new ChromeWebStoreMatcher(), variants: [
      'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm',
      'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm/reviews',
      'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en',
    ]},
    { name: 'Firefox Add-on', matcher: new FirefoxAddonMatcher(), variants: [
      'https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/',
      'https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/reviews/',
    ]},
    { name: 'GitLab', matcher: new GitlabStarsMatcher(), variants: [
      'https://gitlab.com/gitlab-org/gitlab',
      'https://gitlab.com/gitlab-org/gitlab/-/issues',
      'https://gitlab.com/gitlab-org/gitlab?ref_type=heads',
    ]},
    { name: 'Hangar', matcher: new HangarStarsMatcher(), variants: [
      'https://hangar.papermc.io/ViaVersion/ViaVersion',
      'https://hangar.papermc.io/ViaVersion/ViaVersion/versions',
    ]},
    { name: 'Lemmy', matcher: new LemmyMatcher(), variants: [
      'https://lemmy.ml/c/technology',
      'https://lemmy.ml/c/technology?tl=en',
    ]},
    { name: 'Modrinth', matcher: new ModrinthFollowersMatcher(), variants: [
      'https://modrinth.com/mod/sodium',
      'https://modrinth.com/mod/sodium/versions',
    ]},
    { name: 'Nostr', matcher: new NostrBandFollowersMatcher(), variants: [
      'https://nostr.band/npub1qn6wvpmqfnpl3xsu79yvfcgpjz4azdfe5ft220nqjmwqg223fvaq58xsha',
      'https://nostr.band/npub1qn6wvpmqfnpl3xsu79yvfcgpjz4azdfe5ft220nqjmwqg223fvaq58xsha?relay=x',
    ]},
    { name: 'Thunderstore', matcher: new ThunderstoreLikesMatcher(), variants: [
      'https://thunderstore.io/c/lethal-company/p/tinyhoot/ShipLoot/',
      'https://thunderstore.io/p/tinyhoot/ShipLoot/',
    ]},
    { name: 'YouTube channel', matcher: new YoutubeChannelSubscribersMatcher(), variants: [
      'https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ',
      'https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ/videos',
    ]},
    { name: 'Packagist', matcher: new PackagistDownloadsMatcher(), variants: [
      'https://packagist.org/packages/guzzlehttp/guzzle',
      'https://packagist.org/packages/guzzlehttp/guzzle#community',
      'https://packagist.org/packages/guzzlehttp/guzzle?query=1',
    ]},
    { name: 'SourceForge', matcher: new SourceForgeDownloadsMatcher(), variants: [
      'https://sourceforge.net/projects/sevenzip/',
      'https://sourceforge.net/projects/sevenzip/files/',
    ]},
    { name: 'GitHub Gist', matcher: new GithubGistStarsMatcher(), variants: [
      'https://gist.github.com/Laoujin/12f5d2f76d51ee6c0a49',
      'https://gist.github.com/Laoujin/12f5d2f76d51ee6c0a49/revisions',
      'https://gist.github.com/Laoujin/12f5d2f76d51ee6c0a49/',
    ]},
  ];

  for (const { name, matcher, variants } of cases) {
    test(`${name}: variants share one baseUrl`, () => {
      const baseUrls = variants.map(v => baseUrlOf(matcher, v));
      baseUrls.forEach(b => expect(b, `matched: ${JSON.stringify(baseUrls)}`).toBeTruthy());
      expect(new Set(baseUrls).size).toBe(1);
    });
  }

  test('GitLab does not over-capture sub-pages into the badge id', () => {
    const badgeUrl = new GitlabStarsMatcher().match({
      href: 'https://gitlab.com/gitlab-org/gitlab/-/issues', el: undefined as any,
    })?.badgeUrl;
    expect(badgeUrl).toContain('gitlab-org%2Fgitlab.svg');
    expect(badgeUrl).not.toContain('issues');
  });

  test('Lemmy keeps communities and users distinct', () => {
    const m = new LemmyMatcher();
    expect(baseUrlOf(m, 'https://lemmy.ml/c/technology'))
      .not.toBe(baseUrlOf(m, 'https://lemmy.ml/u/technology'));
  });
});
