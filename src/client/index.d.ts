export type MintApiNetwork = "base" | "polygon" | "solana";
export type MintApiSignerFamily = "evm" | "svm";
export type MintApiPaymentScheme = "exact" | string;
export type MintApiJson = null | boolean | number | string | MintApiJson[] | { [key: string]: MintApiJson };

export interface MintApiPaymentRequirements {
  network: MintApiNetwork | string;
  scheme?: MintApiPaymentScheme;
  [key: string]: unknown;
}

export interface MintApiPaymentRequest {
  x402Version?: number;
  accepts?: MintApiPaymentRequirements[];
  [key: string]: unknown;
}

export interface MintApiSignerContext {
  network?: MintApiNetwork | string;
  family?: MintApiSignerFamily | null;
  paymentRequirements?: MintApiPaymentRequirements;
  paymentRequest?: MintApiPaymentRequest;
}

export type Awaitable<T> = T | Promise<T>;
export type MintApiSigner = unknown;
export type MintApiSignerResolver = (
  context?: MintApiSignerContext,
) => Awaitable<MintApiSigner | undefined>;

export interface CreateSignerResolverOptions {
  signer?: MintApiSigner;
  getSigner?: MintApiSignerResolver;
  networkSigners?: Partial<Record<string, MintApiSigner>>;
  familySigners?: Partial<Record<MintApiSignerFamily | string, MintApiSigner>>;
  signerResolversByNetwork?: Partial<Record<string, MintApiSignerResolver | MintApiSigner>>;
  signerResolversByFamily?: Partial<
    Record<MintApiSignerFamily | string, MintApiSignerResolver | MintApiSigner>
  >;
  defaultSigner?: MintApiSigner;
  defaultSignerResolver?: MintApiSignerResolver;
}

export interface DefineSignerModuleOptions extends CreateSignerResolverOptions {
  preferredNetworks?: Array<MintApiNetwork | string>;
  signerResolver?: MintApiSignerResolver;
}

export interface MintApiSignerModule {
  kind: "x402-signer-module";
  preferredNetworks: Array<MintApiNetwork | string>;
  signerResolver: MintApiSignerResolver;
}

export interface MintApiClientErrorDetails {
  code?: string;
  cause?: unknown;
  [key: string]: unknown;
}

export class MintApiClientError extends Error {
  code: string;
  [key: string]: unknown;
  constructor(message: string, details?: MintApiClientErrorDetails);
}

export class PaymentChallengeError extends MintApiClientError {}
export class NoSupportedNetworkError extends MintApiClientError {
  preferredNetworks?: Array<MintApiNetwork | string>;
}
export class SignerUnavailableError extends MintApiClientError {
  network?: MintApiNetwork | string;
  family?: MintApiSignerFamily | null;
}
export class PaymentHeaderCreationError extends MintApiClientError {
  network?: MintApiNetwork | string;
  family?: MintApiSignerFamily | null;
}
export class MintApiRequestError extends MintApiClientError {
  status?: number;
  body?: unknown;
}

export interface PaidFetchCallbacks {
  onPaymentRequired?: (
    paymentRequest: MintApiPaymentRequest,
    response: Response,
  ) => void;
  onPaymentRequirementsSelected?: (
    requirements: MintApiPaymentRequirements,
    paymentRequest: MintApiPaymentRequest,
  ) => void;
  onPaymentHeaderCreated?: (
    paymentHeader: string,
    requirements: MintApiPaymentRequirements,
  ) => void;
}

export interface PaidFetchOptions extends CreateSignerResolverOptions, PaidFetchCallbacks {
  fetchImpl?: typeof fetch;
  preferredNetworks?: Array<MintApiNetwork | string>;
  paymentScheme?: MintApiPaymentScheme;
  x402Config?: unknown;
  paymentRequirementsSelector?: (
    accepts: MintApiPaymentRequirements[],
    preferredNetworks: Array<MintApiNetwork | string>,
    paymentScheme: MintApiPaymentScheme,
  ) => MintApiPaymentRequirements;
  paymentHeaderCreator?: (
    signer: MintApiSigner,
    version: number,
    requirements: MintApiPaymentRequirements,
    x402Config?: unknown,
  ) => Awaitable<string>;
}

export interface MintApiRequestOptions {
  method?: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  requestHeaders?: HeadersInit;
  parseAs?: "json" | "text" | "response";
}

export interface CreateAgentClientOptions extends CreateSignerResolverOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  preferredNetworks?: Array<MintApiNetwork | string>;
  x402Config?: unknown;
  headers?: HeadersInit;
}

export interface TwitterUserInfoParams {
  screenname?: string;
  rest_id?: string;
}

export interface CursorParams {
  cursor?: string;
}

export interface TwitterFollowersParams extends CursorParams {
  screenname?: string;
  blue_verified?: string | number;
}

export interface TwitterIdParams {
  id?: string;
}

export interface TwitterCheckFollowParams {
  user?: string;
  follows?: string;
}

export interface TwitterListTimelineParams extends CursorParams {
  list_id?: string;
}

export interface TwitterCommunityParams extends CursorParams {
  community_id?: string;
}

export interface TwitterQueryParams extends CursorParams {
  query?: string;
}

export interface TwitterProfilesByRestIdsParams {
  rest_ids?: string;
}

export interface TwitterCommunityPostsParams extends CursorParams {
  community_id?: string;
  ranking?: string;
}

export interface TwitterInspirationPostsParams {
  type?: string;
  country?: string;
  period?: string;
}

export interface TwitterSearchParams extends CursorParams {
  query?: string;
  search_type?: string;
}

export interface TwitterCheckRetweetParams {
  screenname?: string;
  tweet_id?: string;
}

export interface YoutubeTrendingParams {
  geo?: string;
  type?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeVideoInfoParams {
  id?: string;
  extend?: string | number;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeSubtitlesParams {
  id?: string;
  format?: string;
  lang?: string;
}

export interface YoutubeSubtitleParams {
  url?: string;
  format?: string;
  targetLang?: string;
  parseAs?: "json" | "text" | "response";
}

export interface YoutubeRelatedParams {
  id?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeUpdatedMetadataParams {
  id?: string;
}

export interface YoutubeTranscriptParams {
  id?: string;
  params?: string;
  lang?: string;
}

export interface YoutubeScreenshotParams {
  id?: string;
  timeStamp?: string;
}

export interface YoutubeShortsInfoParams {
  id?: string;
  params?: string;
  extend?: string | number;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeShortsSequenceParams {
  params?: string;
  id?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeShortsSoundAttributionParams {
  params?: string;
  id?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeChannelHomeParams {
  id?: string;
  forUsername?: string;
  token?: string;
  params?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeChannelVideosParams {
  id?: string;
  forUsername?: string;
  sort_by?: string;
  token?: string;
  geo?: string;
  lang?: string;
  local?: string | number;
  fields?: string;
}

export interface YoutubeChannelShortsParams {
  id?: string;
  forUsername?: string;
  sort_by?: string;
  token?: string;
  geo?: string;
  lang?: string;
  local?: string | number;
  fields?: string;
}

export interface YoutubeChannelLivestreamsParams {
  id?: string;
  forUsername?: string;
  sort_by?: string;
  token?: string;
  geo?: string;
  lang?: string;
  local?: string | number;
  fields?: string;
}

export interface YoutubeChannelPlaylistsParams {
  id?: string;
  sort_by?: string;
  token?: string;
  geo?: string;
  lang?: string;
  forUsername?: string;
  fields?: string;
}

export interface YoutubeChannelFeaturedChannelsParams {
  id?: string;
  forUsername?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeChannelAboutParams {
  id?: string;
  geo?: string;
  lang?: string;
  forUsername?: string;
  fields?: string;
}

export interface YoutubeChannelSearchParams {
  id?: string;
  forUsername?: string;
  query?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeChannelStoreParams {
  id?: string;
  forUsername?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeSearchParams {
  query?: string;
  token?: string;
  geo?: string;
  lang?: string;
  type?: string;
  duration?: string;
  features?: string;
  upload_date?: string;
  sort_by?: string;
  local?: string | number;
  fields?: string;
}

export interface YoutubePlaylistParams {
  id?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeHashtagParams {
  tag?: string;
  type?: string;
  params?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeCommentsParams {
  id?: string;
  token?: string;
  sort_by?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeResolveParams {
  url?: string;
}

export interface YoutubeDownloadParams {
  id?: string;
  cgeo?: string;
  lang?: string;
  cm?: string | number;
  fields?: string;
}

export interface YoutubeHypeParams {
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubeSuggestQueriesParams {
  query?: string;
  geo?: string;
  lang?: string;
}

export interface YoutubeHomeParams {
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubePostInfoParams {
  id?: string;
  channelId?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubePostCommentsParams {
  id?: string;
  channelId?: string;
  sort_by?: string;
  token?: string;
  geo?: string;
  lang?: string;
  fields?: string;
}

export interface YoutubePostInfoAttachmentImage {
  url?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export interface YoutubePostInfoAttachment {
  type?: string;
  image?: YoutubePostInfoAttachmentImage[];
  [key: string]: unknown;
}

export interface YoutubePostInfoResponse {
  type?: string;
  postId?: string;
  authorText?: string;
  authorChannelId?: string;
  authorThumbnail?: YoutubeThumbnail[];
  contentText?: string;
  publishedTimeText?: string;
  voteCountText?: string;
  voteStatus?: string;
  replyCount?: string | number | null;
  attachment?: YoutubePostInfoAttachment;
  [key: string]: unknown;
}

export interface TwitterProfileImage {
  url?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export interface TwitterUserProfile {
  id?: string;
  rest_id?: string;
  screen_name?: string;
  name?: string;
  desc?: string;
  avatar?: string;
  profile?: string;
  header_image?: string;
  created_at?: string;
  location?: string;
  url?: string;
  friends?: number;
  followers_count?: number;
  sub_count?: number;
  statuses_count?: number;
  media_count?: number;
  favourites_count?: number;
  listed_count?: number;
  blue_verified?: boolean;
  verified?: boolean;
  is_blue_verified?: boolean;
  profile_image?: string;
  [key: string]: unknown;
}

export interface TwitterMentionEntity {
  id_str?: string;
  name?: string;
  screen_name?: string;
  indices?: number[];
  [key: string]: unknown;
}

export interface TwitterHashtagEntity {
  text?: string;
  indices?: number[];
  [key: string]: unknown;
}

export interface TwitterUrlEntity {
  url?: string;
  expanded_url?: string;
  display_url?: string;
  indices?: number[];
  [key: string]: unknown;
}

export interface TwitterMediaVariant {
  bitrate?: number;
  content_type?: string;
  url?: string;
  [key: string]: unknown;
}

export interface TwitterMediaEntity {
  id_str?: string;
  media_key?: string;
  media_url_https?: string;
  type?: string;
  url?: string;
  display_url?: string;
  expanded_url?: string;
  ext_media_availability?: Record<string, unknown>;
  original_info?: Record<string, unknown>;
  sizes?: Record<string, unknown>;
  video_info?: {
    aspect_ratio?: number[];
    duration_millis?: number;
    variants?: TwitterMediaVariant[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TwitterEntities {
  hashtags?: TwitterHashtagEntity[];
  media?: TwitterMediaEntity[];
  symbols?: Array<Record<string, unknown>>;
  urls?: TwitterUrlEntity[];
  user_mentions?: TwitterMentionEntity[];
  [key: string]: unknown;
}

export interface TwitterTweet {
  tweet_id?: string;
  id?: string;
  conversation_id?: string;
  created_at?: string;
  text?: string;
  lang?: string;
  source?: string;
  display_text_range?: number[];
  bookmarks?: number;
  favorites?: number;
  likes?: number;
  quotes?: number;
  replies?: number;
  retweets?: number;
  views?: number | string;
  media?: TwitterMediaEntity[];
  entities?: TwitterEntities;
  author?: TwitterUserProfile;
  user_info?: TwitterUserProfile;
  quoted?: TwitterTweet;
  quoted_tweet?: TwitterTweet;
  retweeted?: TwitterTweet;
  retweeted_tweet?: TwitterTweet;
  [key: string]: unknown;
}

export interface TwitterTimelineResponse {
  pinned?: TwitterTweet | null;
  timeline?: TwitterTweet[];
  next_cursor?: string;
  prev_cursor?: string;
  status?: string;
  user?: TwitterUserProfile;
  [key: string]: unknown;
}

export interface TwitterUsersPageResponse {
  following?: TwitterUserProfile[];
  followers?: TwitterUserProfile[];
  users?: TwitterUserProfile[];
  next_cursor?: string;
  prev_cursor?: string;
  status?: string;
  [key: string]: unknown;
}

export interface TwitterTrendsResponse {
  trends?: Array<{
    name?: string;
    query?: string;
    url?: string;
    tweet_volume?: number | null;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface TwitterSearchResponse {
  timeline?: TwitterTweet[];
  next_cursor?: string;
  prev_cursor?: string;
  status?: string;
  [key: string]: unknown;
}

export interface YoutubeThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

export interface YoutubeBadge {
  type?: string;
  label?: string;
  [key: string]: unknown;
}

export interface YoutubeAuthorSummary {
  channelId?: string;
  channelTitle?: string;
  channelHandle?: string;
  channelAvatar?: YoutubeThumbnail[];
  channelThumbnail?: YoutubeThumbnail[];
  isVerified?: boolean;
  isVerifiedChannel?: boolean;
  [key: string]: unknown;
}

export interface YoutubeVideoResult extends YoutubeAuthorSummary {
  type?: string;
  videoId?: string;
  title?: string;
  description?: string;
  thumbnail?: YoutubeThumbnail[];
  richThumbnail?: YoutubeThumbnail[];
  viewCount?: number | string;
  viewCountText?: string;
  publishedTimeText?: string;
  publishDate?: string;
  publishedAt?: string;
  lengthText?: string;
  live?: boolean;
  isLive?: boolean;
  badges?: YoutubeBadge[];
  [key: string]: unknown;
}

export interface YoutubeShortsResult extends YoutubeAuthorSummary {
  type?: string;
  videoId?: string;
  title?: string;
  thumbnail?: YoutubeThumbnail[];
  viewCountText?: string;
  params?: string;
  [key: string]: unknown;
}

export interface YoutubeFeedSection {
  type?: string;
  title?: string;
  subtitle?: string;
  data?: YoutubeFeedItem[];
  [key: string]: unknown;
}

export type YoutubeFeedItem = YoutubeVideoResult | YoutubeShortsResult | YoutubeFeedSection;

export interface YoutubeSearchResponse {
  data?: YoutubeVideoResult[];
  continuation?: string;
  estimatedResults?: number | string;
  [key: string]: unknown;
}

export interface YoutubeFeedResponse {
  data?: YoutubeFeedItem[];
  continuation?: string;
  msg?: string;
  [key: string]: unknown;
}

export interface YoutubeChapter {
  title?: string;
  time?: string;
  startTimeSeconds?: number;
  [key: string]: unknown;
}

export interface YoutubeVideoInfoResponse {
  id?: string;
  videoId?: string;
  title?: string;
  lengthSeconds?: string;
  keywords?: string[];
  channelTitle?: string;
  channelId?: string;
  channelHandle?: string;
  description?: string;
  thumbnail?: YoutubeThumbnail[];
  allowRatings?: boolean;
  viewCount?: number | string;
  likeCount?: number | string;
  commentCount?: number | string;
  subscriberCountText?: string;
  isPrivate?: boolean;
  isLiveContent?: boolean;
  isLive?: boolean;
  isFamilySafe?: boolean;
  availableCountries?: string[];
  relatedVideos?: YoutubeVideoResult[];
  chapters?: YoutubeChapter[];
  [key: string]: unknown;
}

export interface YoutubeSubtitleTrack {
  languageName?: string;
  languageCode?: string;
  url?: string;
  isTranslatable?: boolean;
  [key: string]: unknown;
}

export interface YoutubeSubtitlesResponse {
  subtitles?: YoutubeSubtitleTrack[];
  translationLanguages?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface YoutubeSubtitleJsonEventSegment {
  utf8?: string;
  tOffsetMs?: number;
  acAsrConf?: number;
  [key: string]: unknown;
}

export interface YoutubeSubtitleJsonEvent {
  tStartMs?: number;
  dDurationMs?: number;
  id?: number;
  wpWinPosId?: number;
  wsWinStyleId?: number;
  wWinId?: number;
  aAppend?: number;
  segs?: YoutubeSubtitleJsonEventSegment[];
  [key: string]: unknown;
}

export interface YoutubeSubtitleJsonResponse {
  wireMagic?: string;
  pens?: Array<Record<string, unknown>>;
  wsWinStyles?: Array<Record<string, unknown>>;
  wpWinPositions?: Array<Record<string, unknown>>;
  events?: YoutubeSubtitleJsonEvent[];
  [key: string]: unknown;
}

export interface YoutubeComment {
  commentId?: string;
  text?: string;
  contentText?: string;
  authorText?: string;
  authorChannelId?: string;
  authorThumbnail?: YoutubeThumbnail[];
  likeCount?: number | string;
  likeCountText?: string;
  publishedTimeText?: string;
  repliesCount?: number | string;
  [key: string]: unknown;
}

export interface YoutubeCommentsResponse {
  data?: YoutubeComment[];
  continuation?: string;
  [key: string]: unknown;
}

export interface YoutubeResolveResponse {
  webPageType?: string;
  isVanityUrl?: boolean;
  browseId?: string;
  params?: string;
  [key: string]: unknown;
}

export interface YoutubeDownloadFormat {
  url?: string;
  mimeType?: string;
  bitrate?: number;
  qualityLabel?: string;
  audioQuality?: string;
  contentLength?: string;
  approxDurationMs?: string;
  [key: string]: unknown;
}

export interface YoutubeDownloadResponse {
  id?: string;
  videoId?: string;
  title?: string;
  formats?: YoutubeDownloadFormat[];
  adaptiveFormats?: YoutubeDownloadFormat[];
  subtitles?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface YoutubeSuggestQueriesResponse {
  query?: string;
  suggestions?: string[];
  [key: string]: unknown;
}

export interface YoutubeUpdatedMetadataResponse {
  viewCountText?: string;
  viewCount?: string | number;
  isLive?: boolean;
  likeCountText?: string;
  likeCount?: string | number;
  continuation?: string;
  [key: string]: unknown;
}

export interface YoutubeTranscriptLine {
  startMs?: string;
  endMs?: string;
  startTime?: string;
  text?: string;
  [key: string]: unknown;
}

export interface YoutubeTranscriptResponse {
  id?: string;
  transcript?: YoutubeTranscriptLine[];
  [key: string]: unknown;
}

export interface YoutubeScreenshotResponse {
  link?: Record<string, string>;
  status?: string;
  msg?: string;
  [key: string]: unknown;
}

export interface YoutubeShortsInfoResponse {
  videoId?: string;
  title?: string;
  publishedTimeText?: string;
  publishDate?: string;
  publishedAt?: string;
  commentCount?: string | number;
  channelTitle?: string;
  channelId?: string;
  channelHandle?: string;
  channelThumbnail?: YoutubeThumbnail[];
  description?: string;
  thumbnail?: YoutubeThumbnail[];
  soundAttribution?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface YoutubeShortsSequenceResponse {
  continuation?: string;
  data?: YoutubeShortsResult[];
  [key: string]: unknown;
}

export interface YoutubeShortsSoundAttributionResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: YoutubeShortsResult[];
  [key: string]: unknown;
}

export interface YoutubeChannelHomeResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: YoutubeFeedItem[];
  [key: string]: unknown;
}

export interface YoutubeChannelVideosResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: YoutubeVideoResult[];
  [key: string]: unknown;
}

export interface YoutubeChannelShortsResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: YoutubeShortsResult[];
  [key: string]: unknown;
}

export interface YoutubeChannelLivestreamsResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: YoutubeVideoResult[];
  [key: string]: unknown;
}

export interface YoutubeChannelPlaylistsResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface YoutubeChannelFeaturedChannelsResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface YoutubeChannelAboutResponse {
  [key: string]: unknown;
}

export interface YoutubeChannelSearchResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface YoutubeChannelStoreResponse {
  meta?: Record<string, unknown>;
  continuation?: string;
  data?: Record<string, unknown>[];
  msg?: string;
  [key: string]: unknown;
}

export interface TiktokVideoInfoParams {
  url?: string;
  hd?: string;
}

export interface TiktokMusicInfo {
  id?: string;
  title?: string;
  play?: string;
  cover?: string;
  author?: string;
  original?: boolean;
  duration?: number;
  album?: string;
  [key: string]: unknown;
}

export interface TiktokAuthor {
  id?: string;
  unique_id?: string;
  nickname?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface TiktokVideoData {
  aweme_id?: string;
  id?: string;
  region?: string;
  title?: string;
  cover?: string;
  origin_cover?: string;
  duration?: number;
  play?: string;
  wmplay?: string;
  hdplay?: string;
  size?: number;
  wm_size?: number;
  hd_size?: number;
  music?: string;
  music_info?: TiktokMusicInfo;
  play_count?: number;
  digg_count?: number;
  comment_count?: number;
  share_count?: number;
  download_count?: number;
  create_time?: number;
  author?: TiktokAuthor;
  [key: string]: unknown;
}

export interface TiktokVideoInfoResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: TiktokVideoData;
  [key: string]: unknown;
}

export interface TiktokSearchUserParams {
  keywords?: string;
  count?: string;
  cursor?: string;
}

export interface TiktokUserProfile {
  id?: string;
  uniqueId?: string;
  nickname?: string;
  avatarThumb?: string;
  avatarMedium?: string;
  avatarLarger?: string;
  signature?: string;
  verified?: boolean;
  secUid?: string;
  secret?: boolean;
  ftc?: boolean;
  relation?: number;
  openFavorite?: boolean | null;
  commentSetting?: number;
  duetSetting?: number;
  stitchSetting?: number;
  privateAccount?: boolean;
  isADVirtual?: boolean;
  isUnderAge18?: boolean;
  [key: string]: unknown;
}

export interface TiktokUserStats {
  followingCount?: number;
  followerCount?: number;
  heartCount?: number;
  videoCount?: number;
  diggCount?: number;
  heart?: number;
  [key: string]: unknown;
}

export interface TiktokSearchUserItem {
  user?: TiktokUserProfile;
  stats?: TiktokUserStats;
  [key: string]: unknown;
}

export interface TiktokSearchUserResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    user_list?: TiktokSearchUserItem[];
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokUserVideosParams {
  unique_id?: string;
  user_id?: string;
  count?: string;
  cursor?: string;
}

export interface TiktokUserVideosResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    videos: Array<Record<string, unknown>>;
    cursor: string;
    hasMore: boolean;
  };
}

export interface TiktokUserFollowingParams {
  user_id: string;
  count: string;
  time: string;
}

export interface TiktokUserFollowingResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    followings: Array<Record<string, unknown>>;
    total: number;
    time: number;
    hasMore: boolean;
  };
}

export interface TiktokUserFollowersParams {
  user_id: string;
  count?: string;
  time?: string;
}

export interface TiktokUserFollowersResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    followers: Array<Record<string, unknown>>;
    total: number;
    time: number;
    hasMore: boolean;
  };
}

export interface TiktokUserInfoParams {
  unique_id?: string;
  user_id?: string;
}

export interface TiktokUserInfoResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    user: Record<string, unknown>;
    stats: Record<string, unknown>;
  };
}

export interface TiktokMusicInfoParams {
  url: string;
}

export interface TiktokMusicInfoResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    id: string;
    title: string;
    play: string;
    cover: string;
    author: string;
    original: boolean;
    duration: number;
    album: string;
    video_count: number;
  };
}

export interface TiktokMusicVideosParams {
  music_id: string;
  count: string;
  cursor: string;
}

export interface TiktokMusicVideosResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    videos: Array<Record<string, unknown>>;
    cursor: string | number;
    hasMore: boolean | number;
  };
}

export interface TiktokSearchVideosParams {
  keywords: string;
  count?: string;
  cursor?: string;
  region?: string;
  publish_time?: string;
  sort_type?: string;
}

export interface TiktokSearchVideosResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    videos: Array<Record<string, unknown>>;
    cursor: string | number;
    hasMore: boolean | number;
  };
}

export interface TiktokVideoFeedParams {
  region?: string;
  count?: string;
}

export interface TiktokVideoFeedResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: TiktokVideoData[];
  [key: string]: unknown;
}

export interface TiktokCommentListParams {
  url?: string;
  count?: string;
  cursor?: string;
}

export interface TiktokCommentListResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    comments?: Array<Record<string, unknown>>;
    total?: number;
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokCommentRepliesParams {
  comment_id?: string;
  video_id?: string;
  count?: string;
  cursor?: string;
}

export interface TiktokCommentRepliesResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    comments?: Array<Record<string, unknown>>;
    total?: number;
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokChallengeInfoParams {
  challenge_id?: string;
  challenge_name?: string;
}

export interface TiktokChallengeInfoResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    id?: string;
    cha_name?: string;
    desc?: string;
    user_count?: number;
    view_count?: number;
    is_pgcshow?: boolean;
    is_commerce?: boolean;
    is_challenge?: boolean;
    is_strong_music?: boolean;
    type?: number;
    cover?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokChallengeSearchParams {
  keywords?: string;
  count?: string;
  cursor?: string;
}

export interface TiktokChallengeSearchResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    challenge_list?: Array<Record<string, unknown>>;
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokChallengePostsParams {
  challenge_id?: string;
  count?: string;
  cursor?: string;
  region?: string;
}

export interface TiktokChallengePostsResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    videos?: Array<Record<string, unknown>>;
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokPlaylistInfoParams {
  url?: string;
}

export interface TiktokPlaylistInfoResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    id?: string;
    name?: string;
    type?: number;
    creator_unique_id?: string;
    video_count?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokPlaylistPostsParams {
  mix_id?: string;
  count?: string;
  cursor?: string;
}

export interface TiktokPlaylistPostsResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    videos?: Array<Record<string, unknown>>;
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokPhotoSearchParams {
  keywords?: string;
  region?: string;
}

export interface TiktokPhotoSearchResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    videos?: Array<Record<string, unknown>>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokUserPlaylistsResponse {
  code?: number;
  msg?: string;
  processed_time?: number;
  data?: {
    mix_list?: Array<{
      id?: string;
      name?: string;
      type?: number;
      [key: string]: unknown;
    }>;
    cursor?: number | string;
    hasMore?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface TiktokRegionListResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: Record<string, string>;
}

export interface MintApiTiktokClient {
  videoInfo<T = TiktokVideoInfoResponse>(params?: TiktokVideoInfoParams): Promise<T>;
  newVideoInfo<T = TiktokVideoInfoResponse>(params?: TiktokVideoInfoParams): Promise<T>;
  searchUser<T = TiktokSearchUserResponse>(params?: TiktokSearchUserParams): Promise<T>;
  userVideos<T = TiktokUserVideosResponse>(params?: TiktokUserVideosParams): Promise<T>;
  userFavorites<T = TiktokUserVideosResponse>(params?: TiktokUserVideosParams): Promise<T>;
  userFollowing<T = TiktokUserFollowingResponse>(params?: TiktokUserFollowingParams): Promise<T>;
  userFollowers<T = TiktokUserFollowersResponse>(params?: TiktokUserFollowersParams): Promise<T>;
  userInfo<T = TiktokUserInfoResponse>(params?: TiktokUserInfoParams): Promise<T>;
  musicInfo<T = TiktokMusicInfoResponse>(params?: TiktokMusicInfoParams): Promise<T>;
  musicVideos<T = TiktokMusicVideosResponse>(params?: TiktokMusicVideosParams): Promise<T>;
  searchVideos<T = TiktokSearchVideosResponse>(params?: TiktokSearchVideosParams): Promise<T>;
  videoFeed<T = TiktokVideoFeedResponse>(params?: TiktokVideoFeedParams): Promise<T>;
  commentList<T = TiktokCommentListResponse>(params?: TiktokCommentListParams): Promise<T>;
  commentReplies<T = TiktokCommentRepliesResponse>(params?: TiktokCommentRepliesParams): Promise<T>;
  challengeInfo<T = TiktokChallengeInfoResponse>(params?: TiktokChallengeInfoParams): Promise<T>;
  challengeSearch<T = TiktokChallengeSearchResponse>(params?: TiktokChallengeSearchParams): Promise<T>;
  challengePosts<T = TiktokChallengePostsResponse>(params?: TiktokChallengePostsParams): Promise<T>;
  playlistInfo<T = TiktokPlaylistInfoResponse>(params?: TiktokPlaylistInfoParams): Promise<T>;
  playlistPosts<T = TiktokPlaylistPostsResponse>(params?: TiktokPlaylistPostsParams): Promise<T>;
  photoSearch<T = TiktokPhotoSearchResponse>(params?: TiktokPhotoSearchParams): Promise<T>;
  userPlaylists<T = TiktokUserPlaylistsResponse>(params?: TiktokUserVideosParams): Promise<T>;
  regionList<T = TiktokRegionListResponse>(): Promise<T>;
}

export interface MintApiTwitterClient {
  userInfo<T = TwitterUserProfile>(params?: TwitterUserInfoParams): Promise<T>;
  userTimeline<T = TwitterTimelineResponse>(params?: TwitterUserInfoParams & CursorParams): Promise<T>;
  userMedia<T = TwitterTimelineResponse>(params?: TwitterUserInfoParams & CursorParams): Promise<T>;
  following<T = TwitterUsersPageResponse>(params?: TwitterUserInfoParams & CursorParams): Promise<T>;
  followers<T = TwitterUsersPageResponse>(params?: TwitterFollowersParams): Promise<T>;
  tweetInfo<T = TwitterTweet>(params?: TwitterIdParams): Promise<T>;
  tweetThread<T = TwitterTimelineResponse>(params?: TwitterIdParams & CursorParams): Promise<T>;
  latestReplies<T = TwitterTimelineResponse>(params?: TwitterIdParams & CursorParams): Promise<T>;
  checkFollow<T = unknown>(params?: TwitterCheckFollowParams): Promise<T>;
  listTimeline<T = unknown>(params?: TwitterListTimelineParams): Promise<T>;
  communityInfo<T = unknown>(params?: TwitterCommunityParams): Promise<T>;
  communityMembers<T = unknown>(params?: TwitterCommunityParams): Promise<T>;
  jobsSearch<T = unknown>(params?: TwitterQueryParams): Promise<T>;
  communitiesPostsSearchLatest<T = unknown>(params?: TwitterQueryParams): Promise<T>;
  communitiesPostsSearchTop<T = unknown>(params?: TwitterQueryParams): Promise<T>;
  communitiesSearch<T = unknown>(params?: TwitterQueryParams): Promise<T>;
  profilesByRestIds<T = unknown>(params?: TwitterProfilesByRestIdsParams): Promise<T>;
  communityPosts<T = unknown>(params?: TwitterCommunityPostsParams): Promise<T>;
  listFollowers<T = unknown>(params?: TwitterListTimelineParams): Promise<T>;
  listMembers<T = unknown>(params?: TwitterListTimelineParams): Promise<T>;
  inspirationPosts<T = unknown>(params?: TwitterInspirationPostsParams): Promise<T>;
  userLive<T = unknown>(params?: { rest_id?: string }): Promise<T>;
  aboutProfile<T = unknown>(params?: { screenname?: string }): Promise<T>;
  spacesInfo<T = unknown>(params?: TwitterIdParams): Promise<T>;
  affiliates<T = unknown>(params?: { screenname?: string; cursor?: string }): Promise<T>;
  retweets<T = unknown>(params?: TwitterIdParams & CursorParams): Promise<T>;
  trends<T = TwitterTrendsResponse>(params?: { country?: string }): Promise<T>;
  search<T = TwitterSearchResponse>(params?: TwitterSearchParams): Promise<T>;
  userReplies<T = TwitterTimelineResponse>(params?: { screenname?: string; cursor?: string }): Promise<T>;
  checkRetweet<T = unknown>(params?: TwitterCheckRetweetParams): Promise<T>;
}

export interface MintApiYoutubeClient {
  trending<T = YoutubeFeedResponse>(params?: YoutubeTrendingParams): Promise<T>;
  videoInfo<T = YoutubeVideoInfoResponse>(params?: YoutubeVideoInfoParams): Promise<T>;
  subtitles<T = YoutubeSubtitlesResponse>(params?: YoutubeSubtitlesParams): Promise<T>;
  subtitle<T = YoutubeSubtitleJsonResponse>(params: YoutubeSubtitleParams & { parseAs: "json" }): Promise<T>;
  subtitle(params: YoutubeSubtitleParams & { parseAs: "text" }): Promise<string>;
  subtitle(params: YoutubeSubtitleParams & { parseAs: "response" }): Promise<Response>;
  subtitle<T = string | YoutubeSubtitleJsonResponse>(params?: YoutubeSubtitleParams): Promise<T>;
  related<T = YoutubeFeedResponse>(params?: YoutubeRelatedParams): Promise<T>;
  updatedMetadata<T = YoutubeUpdatedMetadataResponse>(params?: YoutubeUpdatedMetadataParams): Promise<T>;
  transcript<T = YoutubeTranscriptResponse>(params?: YoutubeTranscriptParams): Promise<T>;
  screenshot<T = YoutubeScreenshotResponse>(params?: YoutubeScreenshotParams): Promise<T>;
  shortsInfo<T = YoutubeShortsInfoResponse>(params?: YoutubeShortsInfoParams): Promise<T>;
  shortsSequence<T = YoutubeShortsSequenceResponse>(params?: YoutubeShortsSequenceParams): Promise<T>;
  shortsSoundAttribution<T = YoutubeShortsSoundAttributionResponse>(params?: YoutubeShortsSoundAttributionParams): Promise<T>;
  channelHome<T = YoutubeChannelHomeResponse>(params?: YoutubeChannelHomeParams): Promise<T>;
  channelVideos<T = YoutubeChannelVideosResponse>(params?: YoutubeChannelVideosParams): Promise<T>;
  channelShorts<T = YoutubeChannelShortsResponse>(params?: YoutubeChannelShortsParams): Promise<T>;
  channelLivestreams<T = YoutubeChannelLivestreamsResponse>(params?: YoutubeChannelLivestreamsParams): Promise<T>;
  channelPlaylists<T = YoutubeChannelPlaylistsResponse>(params?: YoutubeChannelPlaylistsParams): Promise<T>;
  channelFeaturedChannels<T = YoutubeChannelFeaturedChannelsResponse>(
    params?: YoutubeChannelFeaturedChannelsParams,
  ): Promise<T>;
  channelAbout<T = YoutubeChannelAboutResponse>(params?: YoutubeChannelAboutParams): Promise<T>;
  channelSearch<T = YoutubeChannelSearchResponse>(params?: YoutubeChannelSearchParams): Promise<T>;
  channelStore<T = YoutubeChannelStoreResponse>(params?: YoutubeChannelStoreParams): Promise<T>;
  search<T = YoutubeSearchResponse>(params?: YoutubeSearchParams): Promise<T>;
  playlist<T = YoutubeFeedResponse>(params?: YoutubePlaylistParams): Promise<T>;
  hashtag<T = YoutubeFeedResponse>(params?: YoutubeHashtagParams): Promise<T>;
  comments<T = YoutubeCommentsResponse>(params?: YoutubeCommentsParams): Promise<T>;
  resolve<T = YoutubeResolveResponse>(params?: YoutubeResolveParams): Promise<T>;
  download<T = YoutubeDownloadResponse>(params?: YoutubeDownloadParams): Promise<T>;
  hype<T = YoutubeFeedResponse>(params?: YoutubeHypeParams): Promise<T>;
  suggestQueries<T = YoutubeSuggestQueriesResponse>(params?: YoutubeSuggestQueriesParams): Promise<T>;
  home<T = YoutubeFeedResponse>(params?: YoutubeHomeParams): Promise<T>;
  postInfo<T = YoutubePostInfoResponse>(params?: YoutubePostInfoParams): Promise<T>;
  postComments<T = YoutubeCommentsResponse>(params?: YoutubePostCommentsParams): Promise<T>;
}

export interface InstagramUsernameFromIdParams {
  id?: string;
  fields?: string;
}

export interface InstagramUsernameFromIdResponse {
  status?: boolean;
  username?: string;
  user_id?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramUserIdFromUsernameParams {
  username?: string;
  fields?: string;
}

export interface InstagramUserIdFromUsernameResponse {
  status?: boolean;
  username?: string;
  user_id?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramMediaShortcodeFromIdParams {
  id?: string;
  fields?: string;
}

export interface InstagramMediaShortcodeFromIdResponse {
  status?: boolean;
  shortcode?: string;
  media_id?: string;
  [key: string]: unknown;
}

export interface InstagramMediaIdFromUrlParams {
  url?: string;
  fields?: string;
}

export interface InstagramMediaIdFromUrlResponse {
  status?: boolean;
  shortcode?: string;
  media_id?: string;
  [key: string]: unknown;
}

export interface InstagramUserInfoByUsernameParams {
  username?: string;
  fields?: string;
}

export interface InstagramUserInfoByUsernameResponse {
  status?: boolean;
  username?: string;
  full_name?: string;
  biography?: string;
  id?: string;
  edge_followed_by?: { count?: number };
  edge_follow?: { count?: number };
  profile_pic_url?: string;
  is_private?: boolean;
  is_verified?: boolean;
  category_name?: string;
  [key: string]: unknown;
}

export interface InstagramUserInfoByUsernameV2Params {
  username?: string;
  fields?: string;
}

export interface InstagramUserInfoByUsernameV2Response {
  status?: boolean;
  fbid_v2?: string;
  username?: string;
  full_name?: string;
  biography?: string;
  id?: string;
  follower_count?: number;
  following_count?: number;
  profile_pic_url?: string;
  hd_profile_pic_url_info?: { url?: string };
  is_private?: boolean;
  is_verified?: boolean;
  category?: string;
  is_business?: boolean;
  account_type?: number;
  bio_links?: Array<Record<string, unknown>>;
  linked_fb_info?: Record<string, unknown>;
  external_url?: string;
  [key: string]: unknown;
}

export interface InstagramUserInfoByUserIdParams {
  id?: string;
  fields?: string;
}

export interface InstagramUserInfoByUserIdResponse {
  status?: boolean;
  username?: string;
  full_name?: string;
  biography?: string;
  id?: string;
  edge_followed_by?: { count?: number };
  edge_follow?: { count?: number };
  profile_pic_url?: string;
  profile_pic_url_hd?: string;
  is_private?: boolean;
  is_verified?: boolean;
  category_name?: string;
  is_business_account?: boolean;
  is_professional_account?: boolean;
  external_url?: string;
  bio_links?: Array<Record<string, unknown>>;
  edge_owner_to_timeline_media?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface InstagramUserInfoByUserIdV2Params {
  id?: string;
  fields?: string;
}

export interface InstagramUserInfoByUserIdV2Response {
  status?: boolean;
  fbid_v2?: string;
  username?: string;
  full_name?: string;
  biography?: string;
  id?: string;
  follower_count?: number;
  following_count?: number;
  profile_pic_url?: string;
  hd_profile_pic_url_info?: { url?: string };
  is_private?: boolean;
  is_verified?: boolean;
  category?: string;
  is_business?: boolean;
  account_type?: number;
  bio_links?: Array<Record<string, unknown>>;
  linked_fb_info?: Record<string, unknown>;
  external_url?: string;
  [key: string]: unknown;
}

export interface InstagramWebProfileInfoByUsernameParams {
  username?: string;
  fields?: string;
}

export interface InstagramWebProfileInfoByUsernameResponse {
  status?: boolean;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MintApiInstagramClient {
  usernameFromId<T = InstagramUsernameFromIdResponse>(params?: InstagramUsernameFromIdParams): Promise<T>;
  userIdFromUsername<T = InstagramUserIdFromUsernameResponse>(params?: InstagramUserIdFromUsernameParams): Promise<T>;
  mediaShortcodeFromId<T = InstagramMediaShortcodeFromIdResponse>(params?: InstagramMediaShortcodeFromIdParams): Promise<T>;
  mediaIdFromUrl<T = InstagramMediaIdFromUrlResponse>(params?: InstagramMediaIdFromUrlParams): Promise<T>;
  userInfoByUsername<T = InstagramUserInfoByUsernameResponse>(params?: InstagramUserInfoByUsernameParams): Promise<T>;
  userInfoByUsernameV2<T = InstagramUserInfoByUsernameV2Response>(params?: InstagramUserInfoByUsernameV2Params): Promise<T>;
  userInfoByUserId<T = InstagramUserInfoByUserIdResponse>(params?: InstagramUserInfoByUserIdParams): Promise<T>;
  userInfoByUserIdV2<T = InstagramUserInfoByUserIdV2Response>(params?: InstagramUserInfoByUserIdV2Params): Promise<T>;
  webProfileInfoByUsername<T = InstagramWebProfileInfoByUsernameResponse>(params?: InstagramWebProfileInfoByUsernameParams): Promise<T>;
  mediaListByUserId<T = InstagramMediaListByUserIdResponse>(params?: InstagramMediaListByUserIdParams): Promise<T>;
  mediaListByUserIdV2<T = InstagramMediaListByUserIdV2Response>(params?: InstagramMediaListByUserIdV2Params): Promise<T>;
  reelsByUserId<T = InstagramReelsByUserIdResponse>(params?: InstagramReelsByUserIdParams): Promise<T>;
  repostsByUserId<T = InstagramRepostsByUserIdResponse>(params?: InstagramRepostsByUserIdParams): Promise<T>;
  taggedMediaByUserId<T = InstagramTaggedMediaByUserIdResponse>(params?: InstagramTaggedMediaByUserIdParams): Promise<T>;
  relatedProfilesByUserId<T = InstagramRelatedProfilesByUserIdResponse>(params?: InstagramRelatedProfilesByUserIdParams): Promise<T>;
  globalSearchByKeyword<T = InstagramGlobalSearchByKeywordResponse>(params?: InstagramGlobalSearchByKeywordParams): Promise<T>;
  searchUsers<T = InstagramSearchUsersResponse>(params?: InstagramSearchUsersParams): Promise<T>;
  mediaInfoByUrl<T = InstagramMediaInfoByUrlResponse>(params?: InstagramMediaInfoByUrlParams): Promise<T>;
  mediaInfoById<T = InstagramMediaInfoByIdResponse>(params?: InstagramMediaInfoByIdParams): Promise<T>;
  downloadLinkByUrl<T = InstagramDownloadLinkByUrlResponse>(params?: InstagramDownloadLinkByUrlParams): Promise<T>;
  musicInfoByMusicId<T = InstagramMusicInfoByMusicIdResponse>(params?: InstagramMusicInfoByMusicIdParams): Promise<T>;
  mediaByHashtag<T = InstagramMediaByHashtagResponse>(params?: InstagramMediaByHashtagParams): Promise<T>;
  mediaByExploreSectionId<T = InstagramMediaByExploreSectionIdResponse>(
    params?: InstagramMediaByExploreSectionIdParams,
  ): Promise<T>;
  exploreSectionsList<T = InstagramExploreSectionsListResponse>(params?: InstagramExploreSectionsListParams): Promise<T>;
  citiesByCountryCode<T = InstagramCitiesByCountryCodeResponse>(params?: InstagramCitiesByCountryCodeParams): Promise<T>;
  locationsByCityId<T = InstagramLocationsByCityIdResponse>(params?: InstagramLocationsByCityIdParams): Promise<T>;
  mediaByLocationId<T = InstagramMediaByLocationIdResponse>(params?: InstagramMediaByLocationIdParams): Promise<T>;
  locationInfoByLocationId<T = InstagramLocationInfoByLocationIdResponse>(
    params?: InstagramLocationInfoByLocationIdParams,
  ): Promise<T>;
  searchHashtags<T = InstagramSearchHashtagsResponse>(params?: InstagramSearchHashtagsParams): Promise<T>;
  searchLocations<T = InstagramSearchLocationsResponse>(params?: InstagramSearchLocationsParams): Promise<T>;
}

export interface InstagramReelsByUserIdParams {
  id?: string;
  count?: string;
  maxId?: string;
  fields?: string;
}

export interface InstagramReelsByUserIdResponse {
  items?: Array<Record<string, unknown>>;
  paging_info?: {
    max_id?: string;
    more_available?: boolean;
  };
  status?: string;
  [key: string]: unknown;
}

export interface InstagramRepostsByUserIdParams {
  id?: string;
  maxId?: string;
  fields?: string;
}

export interface InstagramRepostsByUserIdResponse {
  items?: Array<Record<string, unknown>>;
  paging_info?: {
    max_id?: string;
    more_available?: boolean;
  };
  status?: string;
  [key: string]: unknown;
}

export interface InstagramTaggedMediaByUserIdParams {
  id?: string;
  count?: string;
  endCursor?: string;
  fields?: string;
}

export interface InstagramTaggedMediaByUserIdResponse {
  data?: {
    user?: {
      edge_user_to_photos_of_you?: {
        count?: number;
        page_info?: {
          has_next_page?: boolean;
          end_cursor?: string;
        };
        edges?: Array<Record<string, unknown>>;
      };
    };
  };
  status?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramRelatedProfilesByUserIdParams {
  id?: string;
  fields?: string;
}

export interface InstagramRelatedProfilesByUserIdResponse {
  data?: {
    viewer?: Array<Record<string, unknown>>;
    user?: {
      edge_related_profiles?: {
        edges?: Array<Record<string, unknown>>;
      };
    };
  };
  [key: string]: unknown;
}

export interface InstagramGlobalSearchByKeywordParams {
  query?: string;
  fields?: string;
}

export interface InstagramGlobalSearchByKeywordResponse {
  status?: string;
  hashtags?: Array<{
    position?: number;
    hashtag?: {
      name?: string;
      media_count?: number;
      id?: string | number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
  places?: Array<{
    position?: number;
    place?: Record<string, unknown>;
    [key: string]: unknown;
  }>;
  users?: Array<{
    position?: number;
    user?: {
      username?: string;
      full_name?: string;
      is_verified?: boolean;
      pk?: string | number;
      profile_pic_url?: string;
      id?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramSearchUsersParams {
  query?: string;
  fields?: string;
}

export interface InstagramSearchUsersResponse {
  status?: string;
  users?: Array<{
    position?: number;
    user?: Record<string, unknown>;
  }>;
  [key: string]: unknown;
}

export interface InstagramSearchHashtagsParams {
  query?: string;
  fields?: string;
}

export interface InstagramLocationInfoByLocationIdParams {
  id?: string;
  fields?: string;
}

export interface InstagramLocationInfoByLocationIdResponse {
  location_info?: {
    name?: string;
    phone?: string;
    category?: string;
    media_count?: number;
    price_range?: number;
    lat?: number;
    lng?: number;
    slug?: string;
    location_id?: string;
    location_address?: string;
    location_city?: string;
    location_zip?: string;
    ig_business?: {
      profile?: unknown;
      [key: string]: unknown;
    };
    hours?: {
      status?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramSearchHashtagsResponse {
  status?: string;
  hashtags?: Array<{
    position?: number;
    hashtag?: {
      name?: string;
      media_count?: number;
      id?: string | number;
    };
  }>;
  [key: string]: unknown;
}

export interface InstagramSearchLocationsParams {
  query?: string;
  fields?: string;
}

export interface InstagramSearchLocationsResponse {
  status?: string;
  places?: Array<{
    position?: number;
    place?: {
      location?: {
        pk?: number;
        name?: string;
        facebook_places_id?: number;
      };
      subtitle?: string;
      title?: string;
    };
  }>;
  [key: string]: unknown;
}

export interface InstagramMediaInfoByUrlParams {
  url?: string;
  fields?: string;
}

export interface InstagramMediaInfoByUrlResponse {
  status?: boolean;
  id?: string;
  shortcode?: string;
  __typename?: string;
  thumbnail_src?: string;
  display_url?: string;
  dimensions?: {
    height?: number;
    width?: number;
  };
  is_video?: boolean;
  owner?: Record<string, unknown>;
  edge_media_to_caption?: {
    edges?: Array<Record<string, unknown>>;
  };
  edge_media_to_parent_comment?: {
    count?: number;
    page_info?: {
      has_next_page?: boolean;
      end_cursor?: string;
    };
    edges?: Array<Record<string, unknown>>;
  };
  edge_sidecar_to_children?: {
    edges?: Array<Record<string, unknown>>;
  };
  [key: string]: unknown;
}

export interface InstagramMediaInfoByIdParams {
  id?: string;
  fields?: string;
}

export type InstagramMediaInfoByIdResponse = InstagramMediaInfoByUrlResponse;

export interface InstagramDownloadLinkByUrlParams {
  url?: string;
  fields?: string;
}

export interface InstagramDownloadLinkByUrlResponse {
  data?: {
    full_name?: string;
    username?: string;
    medias?: Array<{
      type?: string;
      link?: string;
      img?: string;
    }>;
    comment_count?: number | null;
    like_count?: number;
    taken_at_timestamp?: number;
    caption?: string;
  };
  status?: boolean;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramMusicInfoByMusicIdParams {
  id?: string;
  maxId?: string;
  fields?: string;
}

export interface InstagramMusicInfoByMusicIdResponse {
  items?: Array<{ media?: Record<string, unknown> }>;
  audio_ranking_info?: {
    best_audio_cluster_id?: string;
  };
  is_music_page_restricted?: boolean;
  available_tabs?: string[];
  media_count?: {
    clips_count?: number;
    photos_count?: number;
  };
  paging_info?: {
    max_id?: string;
    more_available?: boolean;
  };
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramMediaByHashtagParams {
  query?: string;
  endCursor?: string;
  fields?: string;
}

export interface InstagramMediaByExploreSectionIdParams {
  id?: string;
  count?: string | number;
  maxId?: string | number;
  fields?: string;
}

export interface InstagramMediaByExploreSectionIdResponse {
  section_name?: string;
  max_id?: string;
  more_available?: boolean;
  items?: Array<Record<string, unknown> | null>;
  subsections?: Array<{
    section_id?: string | number;
    name?: string;
    [key: string]: unknown;
  }>;
  status?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramExploreSectionsListParams {
  fields?: string;
}

export interface InstagramExploreSectionsListResponse {
  sections?: Array<{
    section_id?: string | number;
    name?: string;
    subsections?: Array<{
      section_id?: string | number;
      name?: string;
      medias?: Array<Record<string, unknown>>;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  }>;
  status?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramCitiesByCountryCodeParams {
  countryCode?: string;
  page?: string | number;
  fields?: string;
}

export interface InstagramCitiesByCountryCodeResponse {
  country_info?: {
    id?: string;
    name?: string;
    slug?: string;
    [key: string]: unknown;
  };
  city_list?: Array<{
    id?: string;
    name?: string;
    slug?: string;
    [key: string]: unknown;
  }>;
  next_page?: number;
  status?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramLocationsByCityIdParams {
  cityId?: string;
  page?: string | number;
  fields?: string;
}

export interface InstagramLocationsByCityIdResponse {
  country_info?: {
    id?: string;
    name?: string;
    slug?: string;
    [key: string]: unknown;
  };
  city_info?: {
    id?: string;
    name?: string;
    slug?: string;
    [key: string]: unknown;
  };
  location_list?: Array<{
    id?: string;
    name?: string;
    slug?: string;
    [key: string]: unknown;
  }>;
  next_page?: number;
  status?: string;
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramMediaByLocationIdParams {
  id?: string;
  tab?: "ranked" | "recent";
  endCursor?: string;
  fields?: string;
}

export interface InstagramMediaByLocationIdResponse {
  edges?: Array<{
    node?: Record<string, unknown>;
    cursor?: string | null;
  }>;
  page_info?: {
    end_cursor?: string;
    has_next_page?: boolean;
    [key: string]: unknown;
  };
  attempts?: string;
  [key: string]: unknown;
}

export interface InstagramMediaByHashtagResponse {
  data?: {
    hashtag?: {
      id?: string;
      name?: string;
      allow_following?: boolean;
      is_following?: boolean;
      is_top_media_only?: boolean;
      profile_pic_url?: string;
      edge_hashtag_to_media?: {
        count?: number;
        page_info?: {
          has_next_page?: boolean;
          end_cursor?: string;
        };
        edges?: Array<Record<string, unknown>>;
      };
    };
  };
  status?: string;
  [key: string]: unknown;
}

export interface InstagramMediaListByUserIdV2Params {
  id?: string;
  count?: string;
  endCursor?: string;
  fields?: string;
}

export interface InstagramMediaListByUserIdV2Response {
  data?: {
    user?: {
      edge_owner_to_timeline_media?: {
        count?: number;
        page_info?: {
          has_next_page?: boolean;
          end_cursor?: string;
        };
        edges?: Array<Record<string, unknown>>;
      };
    };
  };
  status?: string;
  [key: string]: unknown;
}

export interface InstagramMediaListByUserIdParams {
  id?: string;
  count?: string;
  allowRestrictedMedia?: string;
  maxId?: string;
  fields?: string;
}

export interface InstagramMediaListByUserIdResponse {
  more_available?: boolean;
  items?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface GoogleMapsSearchParams {
  query?: string;
  limit?: string | number;
  lat?: string | number;
  lng?: string | number;
  zoom?: string | number;
  language?: string;
  region?: string;
  subtypes?: string;
  verified?: string | boolean;
  business_status?: string;
  extract_emails_and_contacts?: string | boolean;
  fields?: string;
}

export interface GoogleMapsAreaSearchParams {
  query?: string;
  lat?: string | number;
  lng?: string | number;
  zoom?: string | number;
  limit?: string | number;
  language?: string;
  region?: string;
  subtypes?: string;
  extract_emails_and_contacts?: string | boolean;
  fields?: string;
}

export interface GoogleMapsAreaSearchBoundingBoxParams {
  query?: string;
  bottom_left?: string;
  top_right?: string;
  limit?: string | number;
  language?: string;
  region?: string;
  subtypes?: string;
  extract_emails_and_contacts?: string | boolean;
  fields?: string;
}

export interface GoogleMapsAreaSearchRadiusParams {
  query?: string;
  lat?: string | number;
  lng?: string | number;
  radius?: string | number;
  limit?: string | number;
  language?: string;
  region?: string;
  subtypes?: string;
  extract_emails_and_contacts?: string | boolean;
  fields?: string;
}

export interface GoogleMapsSearchNearbyParams {
  query?: string;
  lat?: string | number;
  lng?: string | number;
  limit?: string | number;
  language?: string;
  region?: string;
  subtypes?: string;
  extract_emails_and_contacts?: string | boolean;
  fields?: string;
}

export interface GoogleMapsBusinessDetailsParams {
  business_id?: string;
  extract_emails_and_contacts?: string | boolean;
  extract_share_link?: string | boolean;
  fields?: string;
  region?: string;
  language?: string;
  coordinates?: string;
}

export interface GoogleMapsBusinessReviewsParams {
  business_id?: string;
  limit?: string | number;
  cursor?: string;
  sort_by?: "most_relevant" | "newest" | "highest_ranking" | "lowest_ranking";
  region?: string;
  language?: string;
  fields?: string;
}

export interface GoogleMapsBusinessReviewDetailsParams {
  business_id?: string;
  review_author_id?: string;
  region?: string;
  language?: string;
}

export interface GoogleMapsBusinessPhotosParams {
  business_id?: string;
  limit?: string | number;
  cursor?: string;
  is_video?: string | boolean;
  region?: string;
  fields?: string;
}

export interface GoogleMapsBusinessPhotoDetailsParams {
  business_id?: string;
  photo_id?: string;
}

export interface GoogleMapsBusinessPostsParams {
  business_id?: string;
  cursor?: string;
  region?: string;
  language?: string;
}

export interface GoogleMapsReverseGeocodingParams {
  lat?: string | number;
  lng?: string | number;
  region?: string;
  language?: string;
  fields?: string;
}

export interface GoogleMapsAutocompleteParams {
  query?: string;
  region?: string;
  language?: string;
  coordinates?: string;
}

export interface GoogleMapsBulkSearchParams {
  queries?: string[];
  language?: string;
  region?: string;
  coordinates?: string;
  limit?: number;
  offset?: number;
  zoom?: number;
  dedup?: boolean;
}

export interface YelpSearchParams {
  location?: string;
  search_term?: string;
  limit?: string | number;
  offset?: string | number;
  business_details_type?: string;
}

export interface YelpSearchCategoryParams {
  location?: string;
  search_category?: string;
  limit?: string | number;
  offset?: string | number;
  business_details_type?: string;
}

export interface YelpBusinessDetailsParams {
  business_url?: string;
  business_ids?: string;
}

export interface YelpReviewsParams {
  business_url?: string;
  business_id?: string;
  reviews_per_page?: string | number;
  end_cursor?: string;
  sort_by?: "Yelp_sort" | "Newest_first" | "Oldest_first" | "Highest_rated" | "Lowest_rated" | "Elites";
  rating_filter?: "All_ratings" | "5_stars" | "4_stars" | "3_stars" | "2_stars" | "1_star";
}

export interface YelpGetMenusParams {
  business_id?: string;
}

export interface YelpPopularDishesParams {
  business_id?: string;
}

export interface YelpBusinessUrlToIdParams {
  business_url?: string;
}

export interface ZillowPropertyByAddressParams {
  propertyaddress?: string;
}

export interface ZillowPropertyByZpidParams {
  zpid?: string | number;
}

export interface ZillowPropertyByUrlParams {
  url?: string;
}

export interface FacebookSearchGlobalParams {
  query?: string;
  cursor?: string;
  recent_posts?: string | boolean;
  location_uid?: string;
  start_date?: string;
  end_date?: string;
}

export interface FacebookSearchLocationsParams {
  query?: string;
}

export interface FacebookSearchVideosParams {
  query?: string;
  cursor?: string;
  recent_videos?: string | boolean;
  location_uid?: string;
  start_date?: string;
  end_date?: string;
}

export interface FacebookSearchPostsParams {
  query?: string;
  cursor?: string;
  recent_posts?: string | boolean;
  location_uid?: string;
  start_date?: string;
  end_date?: string;
}

export interface FacebookSearchPlacesParams {
  query?: string;
  cursor?: string;
  location_uid?: string;
}

export interface FacebookSearchPagesParams {
  query?: string;
  cursor?: string;
  location_uid?: string;
}

export interface FacebookSearchEventsParams {
  query?: string;
  cursor?: string;
  location_uid?: string;
  start_date?: string;
  end_date?: string;
}

export interface FacebookSearchPeopleParams {
  query?: string;
  cursor?: string;
}

export interface FacebookPageDetailsParams {
  url?: string;
}

export interface FacebookProfileDetailsByIdParams {
  profile_id?: string;
}

export interface FacebookProfileDetailsByUrlParams {
  url?: string;
}

export interface FacebookProfileIdParams {
  url?: string;
}

export interface FacebookProfilePostsParams {
  profile_id?: string;
  cursor?: string;
  start_date?: string;
  end_date?: string;
}

export interface FacebookPagePostsParams {
  page_id?: string;
  cursor?: string;
  start_date?: string;
  end_date?: string;
}

export interface FacebookPagePhotosParams {
  page_id?: string;
  cursor?: string;
  collection_id?: string;
}

export interface FacebookProfilePhotosParams {
  profile_id?: string;
  cursor?: string;
  collection_id?: string;
}

export interface FacebookPageReviewsParams {
  page_id?: string;
  cursor?: string;
}

export interface FacebookPageReelsParams {
  page_id?: string;
  reels_page_id?: string;
  cursor?: string;
}

export interface FacebookProfileReelsParams {
  reels_profile_id?: string;
  cursor?: string;
}

export interface FacebookPageFutureEventsParams {
  page_id?: string;
  cursor?: string;
  collection_id?: string;
}

export interface FacebookPagePastEventsParams {
  page_id?: string;
  cursor?: string;
  collection_id?: string;
}

export interface FacebookGroupFutureEventsParams {
  group_id?: string;
  cursor?: string;
}

export interface FacebookGroupPostsParams {
  group_id?: string;
  cursor?: string;
  sorting_order?: "CHRONOLOGICAL" | "TOP_POSTS";
}

export interface FacebookGroupDetailsParams {
  url?: string;
}

export interface FacebookGroupIdParams {
  url?: string;
}

export interface FacebookPageVideosParams {
  delegate_page_id?: string;
  cursor?: string;
}

export interface FacebookEventDetailsParams {
  url?: string;
}

export interface FacebookEventDetailsByIdParams {
  event_id?: string;
}

export interface FacebookPostDetailsParams {
  post_id?: string;
  post_url?: string;
}

export interface FacebookPostResharesParams {
  post_id?: string;
  cursor?: string;
}

export interface FacebookPostCommentsParams {
  post_id?: string;
  cursor?: string;
}

export interface FacebookPostCommentsNestedParams {
  post_id?: string;
  comment_id?: string;
  expansion_token?: string;
}

export interface FacebookCommentByIdParams {
  comment_id?: string;
}

export interface FacebookMarketplaceListingDetailsParams {
  listing_id?: string;
}

export interface FacebookMarketplaceSearchParams {
  query?: string;
  lat?: string | number;
  lng?: string | number;
  cursor?: string;
  price_min?: string | number;
  price_max?: string | number;
  radius_km?: string | number;
  condition?: string;
  category?: string;
}

export interface FacebookGameLivesParams {
  game_id?: string;
  cursor?: string;
  sort_order?: "VIEWERS" | "SUGGESTED";
}

export interface FacebookBrowseGamesParams {
  query?: string;
  cursor?: string;
  sort_order?: "VIEWERS" | "SUGGESTED";
}

export interface YelpBusiness {
  id?: string;
  name?: string;
  alias?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  zip?: string;
  country?: string;
  state?: string;
  phone?: string;
  localized_phone?: string;
  review_count?: number;
  avg_rating?: number;
  unrounded_avg_rating?: number;
  price?: number;
  localized_price?: string;
  is_closed?: boolean;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  photo_count?: number;
  categories?: Array<{
    name?: string;
    category_filter?: string;
    is_restaurant?: boolean;
  }>;
  [key: string]: unknown;
}

export interface YelpSearchResponse {
  total?: number;
  searched_Location?: string;
  searched_Term?: string;
  limit?: string | number;
  offset?: string | number;
  business_search_result?: YelpBusiness[];
  ad_business_search_result?: YelpBusiness[];
  region?: {
    center?: {
      longitude?: number;
      latitude?: number;
    };
    span?: {
      longitude_delta?: number;
      latitude_delta?: number;
    };
  };
  [key: string]: unknown;
}

export interface YelpSearchCategoryResponse {
  total?: number;
  searched_Location?: string;
  searched_category?: string;
  limit?: string | number;
  offset?: string | number;
  business_search_result?: YelpBusiness[];
  ad_business_search_result?: YelpBusiness[];
  region?: {
    center?: {
      longitude?: number;
      latitude?: number;
    };
    span?: {
      longitude_delta?: number;
      latitude_delta?: number;
    };
  };
  [key: string]: unknown;
}

export interface YelpBusinessDetailsResponse {
  message?: string;
  searched_url?: string | null;
  searched_ids?: string | null;
  business_details?: YelpBusiness | Record<string, unknown> | Array<YelpBusiness | Record<string, unknown>>;
  [key: string]: unknown;
}

export interface ZillowPropertyDetails {
  zpid?: number | string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  price?: number | string | null;
  bedrooms?: number | string | null;
  bathrooms?: number | string | null;
  livingArea?: string | number | null;
  homeType?: string | null;
  resoFacts?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ZillowPropertyByAddressResponse {
  message?: string;
  source?: string;
  zillowURL?: string;
  propertyDetails?: ZillowPropertyDetails;
  [key: string]: unknown;
}

export interface YelpReviewsResponse {
  input_url?: string;
  tt?: number;
  status?: string;
  end_cursor?: string | null;
  has_next_page?: boolean;
  rating?: number;
  review_count?: number;
  rating_filter_selected?: string;
  review_counts_by_rating?: Record<string, number>;
  review_counts_by_language?: Array<{ language?: string; count?: number }>;
  reviews?: Array<{
    encid?: string;
    reviewCreatedAt?: string;
    rating?: number;
    text?: {
      full?: string;
      language?: string;
      [key: string]: unknown;
    };
    author?: {
      encid?: string;
      displayName?: string;
      displayLocation?: string;
      reviewCount?: number;
      friendCount?: number;
      businessPhotoCount?: number;
      [key: string]: unknown;
    };
    review_photos?: string[];
    bizUserPublicReply?: {
      text?: string;
      displayName?: string;
      role?: string;
      profilePhoto?: string;
      replyCreatedAt?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface YelpGetMenusResponse {
  searched_id?: string;
  response_code?: number;
  status?: string;
  message?: string;
  menus?: Array<{
    "Food Name"?: string;
    Category?: string;
    Details?: string;
    Price?: string;
    Photo?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface YelpPopularDishesResponse {
  business_id?: string;
  status?: string;
  status_code?: number;
  data?: {
    popular_dishes?: Array<{
      identifier?: string;
      review_count?: number;
      photo_count?: number;
      display_name?: string;
      photo_url?: string;
      description?: string | null;
      price?: string | null;
      grubhub_menu_item_id?: string | null;
      [key: string]: unknown;
    }>;
    type?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface YelpBusinessUrlToIdResponse {
  business_id?: string;
  alias?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  avg_rating?: number;
  searched_url?: string;
  [key: string]: unknown;
}

export interface FacebookSearchGlobalResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookSearchLocationsResponse {
  results?: Array<{
    label?: string;
    uid?: string;
    city_id?: number;
    timezone?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface FacebookSearchVideosResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookSearchPostsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookSearchPlacesResponse {
  results?: Array<{
    type?: string;
    profile_url?: string;
    url?: string;
    name?: string;
    facebook_id?: string;
    is_verified?: boolean;
    image?: {
      uri?: string;
      width?: number;
      height?: number;
      scale?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookSearchPagesResponse {
  results?: Array<{
    type?: string;
    profile_url?: string | null;
    url?: string | null;
    name?: string;
    facebook_id?: string;
    is_verified?: boolean;
    image?: {
      uri?: string;
      width?: number;
      height?: number;
      scale?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookSearchEventsResponse {
  results?: Array<{
    type?: string;
    event_id?: string;
    title?: string;
    url?: string;
    [key: string]: unknown;
  }>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookSearchPeopleResponse {
  results?: Array<{
    type?: string;
    profile_id?: string;
    url?: string;
    name?: string;
    is_verified?: boolean;
    profile_picture?: {
      uri?: string;
      width?: number;
      height?: number;
      scale?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPageDetailsResponse {
  results?: {
    name?: string;
    type?: string;
    page_id?: string;
    url?: string;
    image?: string;
    intro?: string | null;
    likes?: number | null;
    followers?: number | null;
    following?: number | null;
    categories?: string[];
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    rating?: number | null;
    services?: string[] | null;
    price_range?: string | null;
    website?: string | null;
    cover_image?: string | null;
    verified?: boolean;
    other_accounts?: Array<Record<string, unknown>>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface FacebookProfileDetailsByIdResponse {
  profile?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookProfileDetailsByUrlResponse {
  profile?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookProfileIdResponse {
  profile_id?: string;
  [key: string]: unknown;
}

export interface FacebookProfilePostsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPagePostsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPagePhotosResponse {
  results?: Array<{
    type?: string;
    id?: string;
    uri?: string;
    [key: string]: unknown;
  }>;
  cursor?: string;
  collection_id?: string;
  [key: string]: unknown;
}

export interface FacebookProfilePhotosResponse {
  results?: Array<{
    type?: string;
    id?: string;
    uri?: string;
    [key: string]: unknown;
  }>;
  cursor?: string;
  collection_id?: string;
  [key: string]: unknown;
}

export interface FacebookPageReviewsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPageReelsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookProfileReelsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPageFutureEventsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  collection_id?: string;
  [key: string]: unknown;
}

export interface FacebookPagePastEventsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  collection_id?: string;
  [key: string]: unknown;
}

export interface FacebookGroupFutureEventsResponse {
  events?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookGroupPostsResponse {
  posts?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookGroupDetailsResponse {
  group_details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookGroupIdResponse {
  group_id?: string;
  [key: string]: unknown;
}

export interface FacebookPageVideosResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookEventDetailsResponse {
  event?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookEventDetailsByIdResponse {
  event?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookPostDetailsResponse {
  results?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookPostResharesResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPostCommentsResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookPostCommentsNestedResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookCommentByIdResponse {
  result?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookMarketplaceListingDetailsResponse {
  results?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface FacebookMarketplaceSearchResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookGameLivesResponse {
  results?: Array<Record<string, unknown>>;
  cursor?: string;
  [key: string]: unknown;
}

export interface FacebookBrowseGamesResponse {
  games?: Array<Record<string, unknown>>;
  cursor?: string | null;
  [key: string]: unknown;
}

export interface GoogleMapsSearchContactProfile {
  url?: string;
  username?: string;
  [key: string]: unknown;
}

export interface GoogleMapsSearchBusiness {
  business_id?: string;
  google_id?: string;
  place_id?: string;
  google_mid?: string;
  phone_number?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  full_address?: string;
  review_count?: number;
  rating?: number;
  timezone?: string;
  opening_status?: string | null;
  working_hours?: Record<string, unknown>;
  website?: string;
  tld?: string;
  verified?: boolean;
  place_link?: string;
  cid?: string;
  reviews_link?: string;
  owner_id?: string;
  owner_link?: string;
  owner_name?: string;
  booking_link?: string | null;
  reservations_link?: string | null;
  business_status?: string;
  type?: string;
  subtypes?: string[];
  subtype_gcids?: string[];
  photos_sample?: Array<{
    photo_id?: string;
    photo_url?: string;
    photo_url_large?: string;
    video_thumbnail_url?: string | null;
    latitude?: number;
    longitude?: number;
    type?: string;
    photo_datetime_utc?: string;
    photo_timestamp?: number;
    [key: string]: unknown;
  }>;
  reviews_per_rating?: Record<string, number>;
  photo_count?: number;
  about?: {
    summary?: string | null;
    details?: string | null;
    [key: string]: unknown;
  };
  address?: string;
  order_link?: string | null;
  price_level?: string | null;
  district?: string;
  street_address?: string;
  city?: string;
  zipcode?: string;
  state?: string;
  country?: string;
  hotel_location_rating?: number | null;
  hotel_amenities?: Record<string, boolean>;
  hotel_stars?: number;
  hotel_review_summary?: string | null;
  hotel_price_for_dates?: string | null;
  hotel_booking_options?: Array<Record<string, unknown>> | null;
  hotel_results_from_web?: Array<Record<string, unknown>> | null;
  share_link?: string;
  emails_and_contacts?: {
    emails?: string[];
    phones?: string[];
    facebook?: GoogleMapsSearchContactProfile[];
    instagram?: GoogleMapsSearchContactProfile[];
    linkedin?: GoogleMapsSearchContactProfile[];
    x?: GoogleMapsSearchContactProfile[];
    youtube?: GoogleMapsSearchContactProfile[];
    tiktok?: GoogleMapsSearchContactProfile[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GoogleMapsSearchResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    query?: string;
    language?: string;
    region?: string;
    lat?: number;
    lng?: number;
    zoom?: number;
    limit?: number;
    offset?: number;
    extract_emails_and_contacts?: boolean;
    [key: string]: unknown;
  };
  data?: GoogleMapsSearchBusiness[];
  [key: string]: unknown;
}

export interface GoogleMapsBusinessDetailsResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    business_id?: string;
    language?: string;
    region?: string;
    coordinates?: string;
    extract_emails_and_contacts?: boolean;
    extract_share_link?: boolean;
    [key: string]: unknown;
  };
  data?: GoogleMapsSearchBusiness[];
  [key: string]: unknown;
}

export interface GoogleMapsBusinessReview {
  review_id?: string;
  review_text?: string;
  rating?: number;
  review_datetime_utc?: string;
  review_timestamp?: number;
  review_time?: string;
  review_link?: string;
  review_photos?: string[] | null;
  review_language?: string;
  review_text_translated_language?: string;
  like_count?: number;
  author_id?: string;
  author_link?: string;
  author_name?: string;
  author_photo_url?: string;
  author_review_count?: number;
  author_photo_count?: number;
  owner_response_datetime_utc?: string | null;
  owner_response_timestamp?: number | null;
  owner_response_time?: string | null;
  owner_response_text?: string | null;
  owner_response_language?: string | null;
  author_reviews_link?: string;
  author_local_guide_level?: number;
  author_is_local_guide?: boolean;
  review_form?: Record<string, string | number | boolean>;
  review_source?: string;
  review_source_logo?: string;
  [key: string]: unknown;
}

export interface GoogleMapsBusinessReviewsResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    business_id?: string;
    language?: string;
    region?: string;
    limit?: number;
    sort_by?: string;
    translate_reviews?: boolean;
    [key: string]: unknown;
  };
  data?: {
    reviews?: GoogleMapsBusinessReview[];
    cursor?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GoogleMapsBusinessReviewDetailsResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    business_id?: string;
    review_author_id?: string;
    language?: string;
    region?: string;
    coordinates?: string;
    [key: string]: unknown;
  };
  data?: GoogleMapsBusinessReview[];
  [key: string]: unknown;
}

export interface GoogleMapsBusinessPhoto {
  photo_id?: string;
  photo_url?: string;
  photo_url_large?: string | null;
  video_thumbnail_url?: string | null;
  latitude?: number;
  longitude?: number;
  type?: string;
  photo_datetime_utc?: string;
  photo_timestamp?: number;
  [key: string]: unknown;
}

export interface GoogleMapsBusinessPhotosResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    business_id?: string;
    language?: string;
    region?: string;
    limit?: number;
    is_video?: boolean;
    [key: string]: unknown;
  };
  data?: GoogleMapsBusinessPhoto[];
  cursor?: string;
  [key: string]: unknown;
}

export interface GoogleMapsBusinessPhotoDetail {
  photo_id?: string;
  caption?: string;
  width?: number;
  height?: number;
  owner_id?: string;
  owner_name?: string;
  owner_photo?: string;
  owner_profile_link?: string;
  [key: string]: unknown;
}

export interface GoogleMapsBusinessPhotoDetailsResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    business_id?: string;
    photo_id?: string;
    language?: string;
    region?: string;
    coordinates?: string;
    [key: string]: unknown;
  };
  data?: GoogleMapsBusinessPhotoDetail[];
  [key: string]: unknown;
}

export interface GoogleMapsBusinessPost {
  post_id?: string;
  post_link?: string;
  post_datetime_utc?: string;
  post_timestamp?: number;
  post_text?: string;
  post_links?: Array<{
    url?: string;
    caption?: string;
    [key: string]: unknown;
  }>;
  post_photos?: string[];
  [key: string]: unknown;
}

export interface GoogleMapsBusinessPostsResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    business_id?: string;
    language?: string;
    region?: string;
    [key: string]: unknown;
  };
  data?: {
    posts?: GoogleMapsBusinessPost[];
    cursor?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GoogleMapsAutocompleteHighlight {
  offset?: number;
  length?: number;
  [key: string]: unknown;
}

export interface GoogleMapsAutocompletePrediction {
  type?: string;
  google_id?: string | null;
  place_id?: string | null;
  description?: string;
  main_text?: string;
  main_text_highlights?: GoogleMapsAutocompleteHighlight[] | null;
  secondary_text?: string | null;
  secondary_text_highlights?: GoogleMapsAutocompleteHighlight[] | null;
  latitude?: number | null;
  longitude?: number | null;
  country?: string | null;
  [key: string]: unknown;
}

export interface GoogleMapsAutocompleteResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    query?: string;
    region?: string;
    language?: string;
    coordinates?: string;
    [key: string]: unknown;
  };
  data?: GoogleMapsAutocompletePrediction[];
  [key: string]: unknown;
}

export interface GoogleMapsBulkSearchResponse {
  status?: string;
  request_id?: string;
  parameters?: {
    queries?: string[];
    language?: string;
    region?: string;
    coordinates?: string;
    limit?: number;
    offset?: number;
    zoom?: number;
    extract_emails_and_contacts?: boolean;
    dedup?: boolean;
    [key: string]: unknown;
  };
  data?: GoogleMapsSearchBusiness[];
  [key: string]: unknown;
}

export interface MintApiGoogleMapsClient {
  search<T = GoogleMapsSearchResponse>(params?: GoogleMapsSearchParams): Promise<T>;
  areaSearch<T = GoogleMapsSearchResponse>(params?: GoogleMapsAreaSearchParams): Promise<T>;
  areaSearchBoundingBox<T = GoogleMapsSearchResponse>(params?: GoogleMapsAreaSearchBoundingBoxParams): Promise<T>;
  areaSearchRadius<T = GoogleMapsSearchResponse>(params?: GoogleMapsAreaSearchRadiusParams): Promise<T>;
  searchNearby<T = GoogleMapsSearchResponse>(params?: GoogleMapsSearchNearbyParams): Promise<T>;
  businessDetails<T = GoogleMapsBusinessDetailsResponse>(params?: GoogleMapsBusinessDetailsParams): Promise<T>;
  businessReviews<T = GoogleMapsBusinessReviewsResponse>(params?: GoogleMapsBusinessReviewsParams): Promise<T>;
  businessReviewDetails<T = GoogleMapsBusinessReviewDetailsResponse>(
    params?: GoogleMapsBusinessReviewDetailsParams,
  ): Promise<T>;
  businessPhotos<T = GoogleMapsBusinessPhotosResponse>(params?: GoogleMapsBusinessPhotosParams): Promise<T>;
  businessPhotoDetails<T = GoogleMapsBusinessPhotoDetailsResponse>(
    params?: GoogleMapsBusinessPhotoDetailsParams,
  ): Promise<T>;
  businessPosts<T = GoogleMapsBusinessPostsResponse>(params?: GoogleMapsBusinessPostsParams): Promise<T>;
  reverseGeocoding<T = GoogleMapsSearchResponse>(params?: GoogleMapsReverseGeocodingParams): Promise<T>;
  autocomplete<T = GoogleMapsAutocompleteResponse>(params?: GoogleMapsAutocompleteParams): Promise<T>;
  bulkSearch<T = GoogleMapsBulkSearchResponse>(params?: GoogleMapsBulkSearchParams): Promise<T>;
}

export interface MintApiYelpClient {
  search<T = YelpSearchResponse>(params?: YelpSearchParams): Promise<T>;
  searchCategory<T = YelpSearchCategoryResponse>(params?: YelpSearchCategoryParams): Promise<T>;
  businessDetails<T = YelpBusinessDetailsResponse>(params?: YelpBusinessDetailsParams): Promise<T>;
  reviews<T = YelpReviewsResponse>(params?: YelpReviewsParams): Promise<T>;
  getMenus<T = YelpGetMenusResponse>(params?: YelpGetMenusParams): Promise<T>;
  popularDishes<T = YelpPopularDishesResponse>(params?: YelpPopularDishesParams): Promise<T>;
  businessUrlToId<T = YelpBusinessUrlToIdResponse>(params?: YelpBusinessUrlToIdParams): Promise<T>;
}

export interface MintApiZillowClient {
  propertyByAddress<T = ZillowPropertyByAddressResponse>(params?: ZillowPropertyByAddressParams): Promise<T>;
  propertyByZpid<T = ZillowPropertyByAddressResponse>(params?: ZillowPropertyByZpidParams): Promise<T>;
  propertyByUrl<T = ZillowPropertyByAddressResponse>(params?: ZillowPropertyByUrlParams): Promise<T>;
}

export interface MintApiFacebookClient {
  searchGlobal<T = FacebookSearchGlobalResponse>(params?: FacebookSearchGlobalParams): Promise<T>;
  searchLocations<T = FacebookSearchLocationsResponse>(params?: FacebookSearchLocationsParams): Promise<T>;
  searchVideos<T = FacebookSearchVideosResponse>(params?: FacebookSearchVideosParams): Promise<T>;
  searchPosts<T = FacebookSearchPostsResponse>(params?: FacebookSearchPostsParams): Promise<T>;
  searchPlaces<T = FacebookSearchPlacesResponse>(params?: FacebookSearchPlacesParams): Promise<T>;
  searchPages<T = FacebookSearchPagesResponse>(params?: FacebookSearchPagesParams): Promise<T>;
  searchEvents<T = FacebookSearchEventsResponse>(params?: FacebookSearchEventsParams): Promise<T>;
  searchPeople<T = FacebookSearchPeopleResponse>(params?: FacebookSearchPeopleParams): Promise<T>;
  pageDetails<T = FacebookPageDetailsResponse>(params?: FacebookPageDetailsParams): Promise<T>;
  profileDetailsById<T = FacebookProfileDetailsByIdResponse>(params?: FacebookProfileDetailsByIdParams): Promise<T>;
  profileDetailsByUrl<T = FacebookProfileDetailsByUrlResponse>(params?: FacebookProfileDetailsByUrlParams): Promise<T>;
  profileId<T = FacebookProfileIdResponse>(params?: FacebookProfileIdParams): Promise<T>;
  profilePosts<T = FacebookProfilePostsResponse>(params?: FacebookProfilePostsParams): Promise<T>;
  pagePosts<T = FacebookPagePostsResponse>(params?: FacebookPagePostsParams): Promise<T>;
  pagePhotos<T = FacebookPagePhotosResponse>(params?: FacebookPagePhotosParams): Promise<T>;
  profilePhotos<T = FacebookProfilePhotosResponse>(params?: FacebookProfilePhotosParams): Promise<T>;
  pageReviews<T = FacebookPageReviewsResponse>(params?: FacebookPageReviewsParams): Promise<T>;
  pageReels<T = FacebookPageReelsResponse>(params?: FacebookPageReelsParams): Promise<T>;
  profileReels<T = FacebookProfileReelsResponse>(params?: FacebookProfileReelsParams): Promise<T>;
  pageFutureEvents<T = FacebookPageFutureEventsResponse>(params?: FacebookPageFutureEventsParams): Promise<T>;
  pagePastEvents<T = FacebookPagePastEventsResponse>(params?: FacebookPagePastEventsParams): Promise<T>;
  groupFutureEvents<T = FacebookGroupFutureEventsResponse>(params?: FacebookGroupFutureEventsParams): Promise<T>;
  groupPosts<T = FacebookGroupPostsResponse>(params?: FacebookGroupPostsParams): Promise<T>;
  groupDetails<T = FacebookGroupDetailsResponse>(params?: FacebookGroupDetailsParams): Promise<T>;
  groupId<T = FacebookGroupIdResponse>(params?: FacebookGroupIdParams): Promise<T>;
  pageVideos<T = FacebookPageVideosResponse>(params?: FacebookPageVideosParams): Promise<T>;
  eventDetails<T = FacebookEventDetailsResponse>(params?: FacebookEventDetailsParams): Promise<T>;
  eventDetailsById<T = FacebookEventDetailsByIdResponse>(params?: FacebookEventDetailsByIdParams): Promise<T>;
  postDetails<T = FacebookPostDetailsResponse>(params?: FacebookPostDetailsParams): Promise<T>;
  postReshares<T = FacebookPostResharesResponse>(params?: FacebookPostResharesParams): Promise<T>;
  postComments<T = FacebookPostCommentsResponse>(params?: FacebookPostCommentsParams): Promise<T>;
  postCommentsNested<T = FacebookPostCommentsNestedResponse>(params?: FacebookPostCommentsNestedParams): Promise<T>;
  commentById<T = FacebookCommentByIdResponse>(params?: FacebookCommentByIdParams): Promise<T>;
  marketplaceListingDetails<T = FacebookMarketplaceListingDetailsResponse>(
    params?: FacebookMarketplaceListingDetailsParams,
  ): Promise<T>;
  marketplaceSearch<T = FacebookMarketplaceSearchResponse>(params?: FacebookMarketplaceSearchParams): Promise<T>;
  gameLives<T = FacebookGameLivesResponse>(params?: FacebookGameLivesParams): Promise<T>;
  browseGames<T = FacebookBrowseGamesResponse>(params?: FacebookBrowseGamesParams): Promise<T>;
}

export interface MintApiAgentClient {
  request<T = unknown>(path: string, options?: Omit<MintApiRequestOptions, "parseAs"> & { parseAs?: "json" }): Promise<T>;
  request(path: string, options: Omit<MintApiRequestOptions, "parseAs"> & { parseAs: "text" }): Promise<string>;
  request(path: string, options: Omit<MintApiRequestOptions, "parseAs"> & { parseAs: "response" }): Promise<Response>;
  twitter: MintApiTwitterClient;
  youtube: MintApiYoutubeClient;
  tiktok: MintApiTiktokClient;
  instagram: MintApiInstagramClient;
  googleMaps: MintApiGoogleMapsClient;
  yelp: MintApiYelpClient;
  zillow: MintApiZillowClient;
  facebook: MintApiFacebookClient;
}

export function paidFetch(
  input: string | URL | Request,
  init?: RequestInit,
  options?: PaidFetchOptions,
): Promise<Response>;

export function paidJson<T = unknown>(
  input: string | URL | Request,
  init?: RequestInit,
  options?: PaidFetchOptions,
): Promise<T>;

export function createAgentClient(options: CreateAgentClientOptions): MintApiAgentClient;
export function getSignerFamily(network?: string | null): MintApiSignerFamily | null;
export function createSignerResolver(options?: CreateSignerResolverOptions): MintApiSignerResolver;
export function defineSignerModule(options?: DefineSignerModuleOptions): MintApiSignerModule;
export function resolveSignerModule(moduleExports: unknown): MintApiSignerModule;
export function loadSignerModule(
  modulePath: string,
  options?: { cwd?: string },
): Promise<MintApiSignerModule>;
