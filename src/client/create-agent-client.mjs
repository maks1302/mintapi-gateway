import { paidFetch, paidJson } from "./paid-fetch.mjs";

function createUrl(baseUrl, path, query = {}) {
  const url = new URL(path, baseUrl);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

export function createAgentClient({
  baseUrl,
  fetchImpl,
  signer,
  getSigner,
  networkSigners,
  familySigners,
  signerResolversByNetwork,
  signerResolversByFamily,
  defaultSigner,
  defaultSignerResolver,
  preferredNetworks,
  x402Config,
  headers,
} = {}) {
  if (!baseUrl) {
    throw new Error("createAgentClient requires a baseUrl.");
  }

  const paymentOptions = {
    fetchImpl,
    signer,
    getSigner,
    networkSigners,
    familySigners,
    signerResolversByNetwork,
    signerResolversByFamily,
    defaultSigner,
    defaultSignerResolver,
    preferredNetworks,
    x402Config,
  };

  const defaultHeaders = {
    Accept: "application/json",
    ...(headers ?? {}),
  };

  async function request(path, { method = "GET", query, body, requestHeaders, parseAs = "json" } = {}) {
    const url = createUrl(baseUrl, path, query);
    const init = {
      method,
      headers: {
        ...defaultHeaders,
        ...(requestHeaders ?? {}),
      },
    };

    if (body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    if (parseAs === "response") {
      return paidFetch(url, init, paymentOptions);
    }

    if (parseAs === "text") {
      const response = await paidFetch(url, init, paymentOptions);
      return response.text();
    }

    return paidJson(url, init, paymentOptions);
  }

  return {
    request,
    twitter: {
      userInfo({ screenname, rest_id } = {}) {
        return request("/api/twitter/user-info", {
          query: { screenname, rest_id },
        });
      },
      userTimeline({ screenname, rest_id, cursor } = {}) {
        return request("/api/twitter/user-timeline", {
          query: { screenname, rest_id, cursor },
        });
      },
      userMedia({ screenname, rest_id, cursor } = {}) {
        return request("/api/twitter/user-media", {
          query: { screenname, rest_id, cursor },
        });
      },
      following({ screenname, rest_id, cursor } = {}) {
        return request("/api/twitter/following", {
          query: { screenname, rest_id, cursor },
        });
      },
      followers({ screenname, cursor, blue_verified } = {}) {
        return request("/api/twitter/followers", {
          query: { screenname, cursor, blue_verified },
        });
      },
      tweetInfo({ id } = {}) {
        return request("/api/twitter/tweet-info", {
          query: { id },
        });
      },
      tweetThread({ id, cursor } = {}) {
        return request("/api/twitter/tweet-thread", {
          query: { id, cursor },
        });
      },
      latestReplies({ id, cursor } = {}) {
        return request("/api/twitter/latest-replies", {
          query: { id, cursor },
        });
      },
      checkFollow({ user, follows } = {}) {
        return request("/api/twitter/check-follow", {
          query: { user, follows },
        });
      },
      listTimeline({ list_id, cursor } = {}) {
        return request("/api/twitter/list-timeline", {
          query: { list_id, cursor },
        });
      },
      communityInfo({ community_id } = {}) {
        return request("/api/twitter/community-info", {
          query: { community_id },
        });
      },
      communityMembers({ community_id, cursor } = {}) {
        return request("/api/twitter/community-members", {
          query: { community_id, cursor },
        });
      },
      jobsSearch({ query } = {}) {
        return request("/api/twitter/jobs-search", {
          query: { query },
        });
      },
      communitiesPostsSearchLatest({ query, cursor } = {}) {
        return request("/api/twitter/communities-posts-search-latest", {
          query: { query, cursor },
        });
      },
      communitiesPostsSearchTop({ query, cursor } = {}) {
        return request("/api/twitter/communities-posts-search-top", {
          query: { query, cursor },
        });
      },
      communitiesSearch({ query, cursor } = {}) {
        return request("/api/twitter/communities-search", {
          query: { query, cursor },
        });
      },
      profilesByRestIds({ rest_ids } = {}) {
        return request("/api/twitter/profiles-by-rest-ids", {
          query: { rest_ids },
        });
      },
      communityPosts({ community_id, cursor, ranking } = {}) {
        return request("/api/twitter/community-posts", {
          query: { community_id, cursor, ranking },
        });
      },
      listFollowers({ list_id, cursor } = {}) {
        return request("/api/twitter/list-followers", {
          query: { list_id, cursor },
        });
      },
      listMembers({ list_id, cursor } = {}) {
        return request("/api/twitter/list-members", {
          query: { list_id, cursor },
        });
      },
      inspirationPosts({ type, country, period } = {}) {
        return request("/api/twitter/inspiration-posts", {
          query: { type, country, period },
        });
      },
      userLive({ rest_id } = {}) {
        return request("/api/twitter/user-live", {
          query: { rest_id },
        });
      },
      aboutProfile({ screenname } = {}) {
        return request("/api/twitter/about-profile", {
          query: { screenname },
        });
      },
      spacesInfo({ id } = {}) {
        return request("/api/twitter/spaces-info", {
          query: { id },
        });
      },
      affiliates({ screenname, cursor } = {}) {
        return request("/api/twitter/affiliates", {
          query: { screenname, cursor },
        });
      },
      retweets({ id, cursor } = {}) {
        return request("/api/twitter/retweets", {
          query: { id, cursor },
        });
      },
      trends({ country } = {}) {
        return request("/api/twitter/trends", {
          query: { country },
        });
      },
      search({ query, cursor, search_type } = {}) {
        return request("/api/twitter/search", {
          query: { query, cursor, search_type },
        });
      },
      userReplies({ screenname, cursor } = {}) {
        return request("/api/twitter/user-replies", {
          query: { screenname, cursor },
        });
      },
      checkRetweet({ screenname, tweet_id } = {}) {
        return request("/api/twitter/check-retweet", {
          query: { screenname, tweet_id },
        });
      },
    },
    youtube: {
      trending({ geo, type, lang, fields } = {}) {
        return request("/api/youtube/trending", {
          query: { geo, type, lang, fields },
        });
      },
      videoInfo({ id, extend, geo, lang, fields } = {}) {
        return request("/api/youtube/video-info", {
          query: { id, extend, geo, lang, fields },
        });
      },
      subtitles({ id, format, lang } = {}) {
        return request("/api/youtube/subtitles", {
          query: { id, format, lang },
        });
      },
      subtitle({ url, format, targetLang, parseAs } = {}) {
        const resolvedParseAs = parseAs ?? (format === "json3" ? "json" : "text");
        return request("/api/youtube/subtitle", {
          query: { url, format, targetLang },
          parseAs: resolvedParseAs,
        });
      },
      related({ id, token, geo, lang, fields } = {}) {
        return request("/api/youtube/related", {
          query: { id, token, geo, lang, fields },
        });
      },
      updatedMetadata({ id } = {}) {
        return request("/api/youtube/updated-metadata", {
          query: { id },
        });
      },
      transcript({ id, params, lang } = {}) {
        return request("/api/youtube/transcript", {
          query: { id, params, lang },
        });
      },
      screenshot({ id, timeStamp } = {}) {
        return request("/api/youtube/screenshot", {
          query: { id, timeStamp },
        });
      },
      search({ query, token, geo, lang, type, duration, features, upload_date, sort_by, local, fields } = {}) {
        return request("/api/youtube/search", {
          query: { query, token, geo, lang, type, duration, features, upload_date, sort_by, local, fields },
        });
      },
      playlist({ id, token, geo, lang, fields } = {}) {
        return request("/api/youtube/playlist", {
          query: { id, token, geo, lang, fields },
        });
      },
      hashtag({ tag, type, params, token, geo, lang, fields } = {}) {
        return request("/api/youtube/hashtag", {
          query: { tag, type, params, token, geo, lang, fields },
        });
      },
      comments({ id, token, sort_by, geo, lang, fields } = {}) {
        return request("/api/youtube/comments", {
          query: { id, token, sort_by, geo, lang, fields },
        });
      },
      resolve({ url } = {}) {
        return request("/api/youtube/resolve", {
          query: { url },
        });
      },
      download({ id, cgeo, lang, cm, fields } = {}) {
        return request("/api/youtube/dl", {
          query: { id, cgeo, lang, cm, fields },
        });
      },
      hype({ token, geo, lang, fields } = {}) {
        return request("/api/youtube/hype", {
          query: { token, geo, lang, fields },
        });
      },
      suggestQueries({ query, geo, lang } = {}) {
        return request("/api/youtube/suggest-queries", {
          query: { query, geo, lang },
        });
      },
      home({ token, geo, lang, fields } = {}) {
        return request("/api/youtube/home", {
          query: { token, geo, lang, fields },
        });
      },
    },
  };
}
