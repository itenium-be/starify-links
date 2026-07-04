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
import { PkgGoDevMatcher } from '../src/matchers/PkgGoDevMatcher';
import { GithubRepositoryMatcher } from '../src/matchers/GithubRepositoryMatcher';
import { PowerShellGalleryDownloadsMatcher } from '../src/matchers/PowerShellGalleryDownloadsMatcher';
import { ChocolateyDownloadsMatcher } from '../src/matchers/ChocolateyDownloadsMatcher';
import { OpenVsxDownloadsMatcher } from '../src/matchers/OpenVsxDownloadsMatcher';
import { HomebrewDownloadsMatcher } from '../src/matchers/HomebrewDownloadsMatcher';
import { CondaDownloadsMatcher } from '../src/matchers/CondaDownloadsMatcher';
import { HexpmDownloadsMatcher } from '../src/matchers/HexpmDownloadsMatcher';
import { PubDownloadsMatcher } from '../src/matchers/PubDownloadsMatcher';
import { JetBrainsPluginDownloadsMatcher } from '../src/matchers/JetBrainsPluginDownloadsMatcher';
import { FlathubDownloadsMatcher } from '../src/matchers/FlathubDownloadsMatcher';
import { StackExchangeReputationMatcher } from '../src/matchers/StackExchangeReputationMatcher';
import { SteamWorkshopDownloadsMatcher } from '../src/matchers/SteamWorkshopDownloadsMatcher';
import { OpenCollectiveBackersMatcher } from '../src/matchers/OpenCollectiveBackersMatcher';

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
    { name: 'PowerShell Gallery', matcher: new PowerShellGalleryDownloadsMatcher(), variants: [
      'https://www.powershellgallery.com/packages/Pester',
      'https://www.powershellgallery.com/packages/Pester/5.5.0',
    ]},
    { name: 'Chocolatey', matcher: new ChocolateyDownloadsMatcher(), variants: [
      'https://community.chocolatey.org/packages/git',
      'https://community.chocolatey.org/packages/git/2.43.0',
    ]},
    { name: 'Open VSX', matcher: new OpenVsxDownloadsMatcher(), variants: [
      'https://open-vsx.org/extension/redhat/java',
      'https://open-vsx.org/extension/redhat/java/reviews',
    ]},
    { name: 'Homebrew', matcher: new HomebrewDownloadsMatcher(), variants: [
      'https://formulae.brew.sh/formula/wget',
      'https://formulae.brew.sh/formula/wget#default',
    ]},
    { name: 'Conda', matcher: new CondaDownloadsMatcher(), variants: [
      'https://anaconda.org/conda-forge/numpy',
      'https://anaconda.org/conda-forge/numpy/files',
    ]},
    { name: 'Hex.pm', matcher: new HexpmDownloadsMatcher(), variants: [
      'https://hex.pm/packages/phoenix',
      'https://hex.pm/packages/phoenix/1.7.0',
    ]},
    { name: 'Pub', matcher: new PubDownloadsMatcher(), variants: [
      'https://pub.dev/packages/provider',
      'https://pub.dev/packages/provider/versions',
    ]},
    { name: 'JetBrains plugin', matcher: new JetBrainsPluginDownloadsMatcher(), variants: [
      'https://plugins.jetbrains.com/plugin/9568-go',
      'https://plugins.jetbrains.com/plugin/9568-go/versions',
    ]},
    { name: 'Flathub', matcher: new FlathubDownloadsMatcher(), variants: [
      'https://flathub.org/apps/org.gimp.GIMP',
      'https://flathub.org/apps/details/org.gimp.GIMP',
    ]},
    { name: 'StackExchange', matcher: new StackExchangeReputationMatcher(), variants: [
      'https://stackoverflow.com/users/22656/jon-skeet',
      'https://stackoverflow.com/users/22656/jon-skeet?tab=profile',
    ]},
    { name: 'Steam Workshop', matcher: new SteamWorkshopDownloadsMatcher(), variants: [
      'https://steamcommunity.com/sharedfiles/filedetails/?id=450814997',
      'https://steamcommunity.com/sharedfiles/filedetails/?id=450814997&searchtext=x',
    ]},
    { name: 'OpenCollective', matcher: new OpenCollectiveBackersMatcher(), variants: [
      'https://opencollective.com/webpack',
      'https://opencollective.com/webpack/updates',
    ]},
    { name: 'pkg.go.dev', matcher: new PkgGoDevMatcher(), variants: [
      'https://pkg.go.dev/github.com/gin-gonic/gin',
      'https://pkg.go.dev/github.com/gin-gonic/gin/binding',
      'https://pkg.go.dev/github.com/gin-gonic/gin@v1.9.1',
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

  test('pkg.go.dev emits the GitHub repo badge and dedupes with a direct github.com link', () => {
    const result = new PkgGoDevMatcher().match({
      href: 'https://pkg.go.dev/github.com/gin-gonic/gin/binding', el: undefined as any,
    });
    expect(result?.badgeType).toBe('githubRepository');
    expect(result?.badgeUrl).toContain('github/stars/gin-gonic/gin.svg');
    expect(result?.baseUrl).toBe(new GithubRepositoryMatcher()
      .match({ href: 'https://github.com/gin-gonic/gin', el: undefined as any })?.baseUrl);
  });

  test('StackExchange maps hosts to sites and ignores unknown hosts', () => {
    const m = new StackExchangeReputationMatcher();
    expect(m.match({ href: 'https://superuser.com/users/1/x', el: undefined as any })?.badgeUrl)
      .toContain('/stackexchange/superuser/r/1.svg');
    expect(m.match({ href: 'https://scifi.stackexchange.com/users/1/x', el: undefined as any })?.badgeUrl)
      .toContain('/stackexchange/scifi/r/1.svg');
    expect(m.match({ href: 'https://example.com/users/1/x', el: undefined as any })).toBeNull();
  });

  test('Lemmy keeps communities and users distinct', () => {
    const m = new LemmyMatcher();
    expect(baseUrlOf(m, 'https://lemmy.ml/c/technology'))
      .not.toBe(baseUrlOf(m, 'https://lemmy.ml/u/technology'));
  });
});
