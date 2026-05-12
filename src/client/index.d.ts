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

export interface MintApiTwitterClient {
  userInfo<T = unknown>(params?: TwitterUserInfoParams): Promise<T>;
  userTimeline<T = unknown>(params?: TwitterUserInfoParams & CursorParams): Promise<T>;
  userMedia<T = unknown>(params?: TwitterUserInfoParams & CursorParams): Promise<T>;
  following<T = unknown>(params?: TwitterUserInfoParams & CursorParams): Promise<T>;
  followers<T = unknown>(params?: TwitterFollowersParams): Promise<T>;
  tweetInfo<T = unknown>(params?: TwitterIdParams): Promise<T>;
  tweetThread<T = unknown>(params?: TwitterIdParams & CursorParams): Promise<T>;
  latestReplies<T = unknown>(params?: TwitterIdParams & CursorParams): Promise<T>;
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
  trends<T = unknown>(params?: { country?: string }): Promise<T>;
  search<T = unknown>(params?: TwitterSearchParams): Promise<T>;
  userReplies<T = unknown>(params?: { screenname?: string; cursor?: string }): Promise<T>;
  checkRetweet<T = unknown>(params?: TwitterCheckRetweetParams): Promise<T>;
}

export interface MintApiYoutubeClient {
  trending<T = unknown>(params?: YoutubeTrendingParams): Promise<T>;
  search<T = unknown>(params?: YoutubeSearchParams): Promise<T>;
  playlist<T = unknown>(params?: YoutubePlaylistParams): Promise<T>;
  hashtag<T = unknown>(params?: YoutubeHashtagParams): Promise<T>;
  comments<T = unknown>(params?: YoutubeCommentsParams): Promise<T>;
  resolve<T = unknown>(params?: YoutubeResolveParams): Promise<T>;
  download<T = unknown>(params?: YoutubeDownloadParams): Promise<T>;
  hype<T = unknown>(params?: YoutubeHypeParams): Promise<T>;
  suggestQueries<T = unknown>(params?: YoutubeSuggestQueriesParams): Promise<T>;
  home<T = unknown>(params?: YoutubeHomeParams): Promise<T>;
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
