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
  search<T = YoutubeSearchResponse>(params?: YoutubeSearchParams): Promise<T>;
  playlist<T = YoutubeFeedResponse>(params?: YoutubePlaylistParams): Promise<T>;
  hashtag<T = YoutubeFeedResponse>(params?: YoutubeHashtagParams): Promise<T>;
  comments<T = YoutubeCommentsResponse>(params?: YoutubeCommentsParams): Promise<T>;
  resolve<T = YoutubeResolveResponse>(params?: YoutubeResolveParams): Promise<T>;
  download<T = YoutubeDownloadResponse>(params?: YoutubeDownloadParams): Promise<T>;
  hype<T = YoutubeFeedResponse>(params?: YoutubeHypeParams): Promise<T>;
  suggestQueries<T = YoutubeSuggestQueriesResponse>(params?: YoutubeSuggestQueriesParams): Promise<T>;
  home<T = YoutubeFeedResponse>(params?: YoutubeHomeParams): Promise<T>;
}

export interface MintApiAgentClient {
  request<T = unknown>(path: string, options?: Omit<MintApiRequestOptions, "parseAs"> & { parseAs?: "json" }): Promise<T>;
  request(path: string, options: Omit<MintApiRequestOptions, "parseAs"> & { parseAs: "text" }): Promise<string>;
  request(path: string, options: Omit<MintApiRequestOptions, "parseAs"> & { parseAs: "response" }): Promise<Response>;
  twitter: MintApiTwitterClient;
  youtube: MintApiYoutubeClient;
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
