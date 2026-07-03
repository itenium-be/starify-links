import { BadgeMatcher } from "../types";
import { BlueskyFollowersMatcher } from "./BlueskyFollowersMatcher";
import { BlueskyPostsMatcher } from "./BlueskyPostsMatcher";
import { ChromeWebStoreLastUpdatedMatcher } from "./ChromeWebStoreLastUpdatedMatcher";
import { CratesDownloadsMatcher } from "./CratesDownloadsMatcher";
import { DockerPullsMatcher } from "./DockerPullsMatcher";
import { NpmDownloadsMatcher } from "./NpmDownloadsMatcher";
import { NugetDownloadsMatcher } from "./NugetDownloadsMatcher";
import { PackagistDownloadsMatcher } from "./PackagistDownloadsMatcher";
import { PkgGoDevMatcher } from "./PkgGoDevMatcher";
import { PypiDownloadsMatcher } from "./PypiDownloadsMatcher";
import { SourceForgeDownloadsMatcher } from "./SourceForgeDownloadsMatcher";
import { RubyGemsDownloadsMatcher } from "./RubyGemsDownloadsMatcher";
import { PowerShellGalleryDownloadsMatcher } from "./PowerShellGalleryDownloadsMatcher";
import { ChocolateyDownloadsMatcher } from "./ChocolateyDownloadsMatcher";
import { OpenVsxDownloadsMatcher } from "./OpenVsxDownloadsMatcher";
import { HomebrewDownloadsMatcher } from "./HomebrewDownloadsMatcher";
import { CondaDownloadsMatcher } from "./CondaDownloadsMatcher";
import { HexpmDownloadsMatcher } from "./HexpmDownloadsMatcher";
import { PubDownloadsMatcher } from "./PubDownloadsMatcher";
import { JetBrainsPluginDownloadsMatcher } from "./JetBrainsPluginDownloadsMatcher";
import { FlathubDownloadsMatcher } from "./FlathubDownloadsMatcher";
import { StackExchangeReputationMatcher } from "./StackExchangeReputationMatcher";
import { SteamWorkshopDownloadsMatcher } from "./SteamWorkshopDownloadsMatcher";
import { OpenCollectiveBackersMatcher } from "./OpenCollectiveBackersMatcher";
import { ChromeWebStoreMatcher } from "./ChromeWebStoreMatcher";
import { ChromeWebStoreRatingCountMatcher } from "./ChromeWebStoreRatingCountMatcher";
import { ChromeWebStoreRatingMatcher } from "./ChromeWebStoreRatingMatcher";
import { ChromeWebStoreStarsMatcher } from "./ChromeWebStoreStarsMatcher";
import { FirefoxAddonDownloadsMatcher } from "./FirefoxAddonDownloadsMatcher";
import { FirefoxAddonMatcher } from "./FirefoxAddonMatcher";
import { FirefoxAddonRatingMatcher } from "./FirefoxAddonRatingMatcher";
import { FirefoxAddonStarsMatcher } from "./FirefoxAddonStarsMatcher";
import { GithubFollowersMatcher } from "./GithubFollowersMatcher";
import { GithubForksMatcher } from "./GithubForksMatcher";
import { GithubGistStarsMatcher } from "./GithubGistStarsMatcher";
import { GithubRepositoryMatcher } from "./GithubRepositoryMatcher";
import { GithubUserMatcher } from "./GithubUserMatcher";
import { GithubWatchersMatcher } from "./GithubWatchersMatcher";
import { GitlabForksMatcher } from "./GitlabForksMatcher";
import { GitlabStarsMatcher } from "./GitlabStarsMatcher";
import { HackerNewsKarmaMatcher } from "./HackerNewsKarmaMatcher";
import { HangarStarsMatcher } from "./HangarStarsMatcher";
import { HangarWatchersMatcher } from "./HangarWatchersMatcher";
import { LemmyMatcher } from "./LemmyMatcher";
// import { MastodonFollowMatcher } from "./MastodonFollowMatcher";
import { ModrinthFollowersMatcher } from "./ModrinthFollowersMatcher";
import { NostrBandFollowersMatcher } from "./NostrBandFollowersMatcher";
import { RedditUserKarmaMatcher } from "./RedditUserKarmaMatcher";
import { SubredditSubscribersMatcher } from "./SubredditSubscribersMatcher";
import { ThunderstoreLikesMatcher } from "./ThunderstoreLikesMatcher";
import { TwitchStatusMatcher } from "./TwitchStatusMatcher";
import { TwitterFollowMatcher } from "./TwitterFollowMatcher";
import { TwitterUrlMatcher } from "./TwitterUrlMatcher";
import { WordPressPluginMatcher } from "./WordPressPluginMatcher";
import { WordPressPluginRatingMatcher } from "./WordPressPluginRatingMatcher";
import { WordPressPluginStarsMatcher } from "./WordPressPluginStarsMatcher";
import { WordPressThemeDownloadsMatcher } from "./WordPressThemeDownloadsMatcher";
import { WordPressThemeRatingMatcher } from "./WordPressThemeRatingMatcher";
import { WordPressThemeStarsMatcher } from "./WordPressThemeStarsMatcher";
import { YoutubeChannelSubscribersMatcher } from "./YoutubeChannelSubscribersMatcher";
import { YoutubeChannelViewsMatcher } from "./YoutubeChannelViewsMatcher";
import { YoutubeVideoCommentsMatcher } from "./YoutubeVideoCommentsMatcher";
import { YoutubeVideoLikesMatcher } from "./YoutubeVideoLikesMatcher";
import { YoutubeVideoViewsMatcher } from "./YoutubeVideoViewsMatcher";

export const badgesConfig: BadgeMatcher[] = [
  new GithubRepositoryMatcher(),
  new GithubUserMatcher(),
  new GithubFollowersMatcher(),
  new GithubGistStarsMatcher(),
  new GithubWatchersMatcher(),
  new GithubForksMatcher(),
  new PkgGoDevMatcher(),
  new GitlabStarsMatcher(),
  new GitlabForksMatcher(),
  new SubredditSubscribersMatcher(),
  new RedditUserKarmaMatcher(),
  new BlueskyFollowersMatcher(),
  new BlueskyPostsMatcher(),
  new HackerNewsKarmaMatcher(),
  new TwitchStatusMatcher(),
  new YoutubeVideoViewsMatcher(),
  new YoutubeVideoLikesMatcher(),
  new YoutubeVideoCommentsMatcher(),
  new YoutubeChannelViewsMatcher(),
  new YoutubeChannelSubscribersMatcher(),
  new TwitterUrlMatcher(),
  new TwitterFollowMatcher(),
  new ThunderstoreLikesMatcher(),
  new NostrBandFollowersMatcher(),
  new ModrinthFollowersMatcher(),
  // new MastodonFollowMatcher(),
  new LemmyMatcher(),
  new HangarWatchersMatcher(),
  new HangarStarsMatcher(),
  new WordPressPluginMatcher(),
  new WordPressPluginRatingMatcher(),
  new WordPressPluginStarsMatcher(),
  new WordPressThemeDownloadsMatcher(),
  new WordPressThemeRatingMatcher(),
  new WordPressThemeStarsMatcher(),
  new ChromeWebStoreMatcher(),
  new ChromeWebStoreRatingMatcher(),
  new ChromeWebStoreStarsMatcher(),
  new ChromeWebStoreLastUpdatedMatcher(),
  new ChromeWebStoreRatingCountMatcher(),
  new FirefoxAddonMatcher(),
  new FirefoxAddonRatingMatcher(),
  new FirefoxAddonStarsMatcher(),
  new FirefoxAddonDownloadsMatcher(),
  new NpmDownloadsMatcher(),
  new PypiDownloadsMatcher(),
  new NugetDownloadsMatcher(),
  new CratesDownloadsMatcher(),
  new RubyGemsDownloadsMatcher(),
  new DockerPullsMatcher(),
  new PackagistDownloadsMatcher(),
  new SourceForgeDownloadsMatcher(),
  new PowerShellGalleryDownloadsMatcher(),
  new ChocolateyDownloadsMatcher(),
  new OpenVsxDownloadsMatcher(),
  new HomebrewDownloadsMatcher(),
  new CondaDownloadsMatcher(),
  new HexpmDownloadsMatcher(),
  new PubDownloadsMatcher(),
  new JetBrainsPluginDownloadsMatcher(),
  new FlathubDownloadsMatcher(),
  new StackExchangeReputationMatcher(),
  new SteamWorkshopDownloadsMatcher(),
  new OpenCollectiveBackersMatcher(),
];
