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
      shortsInfo({ id, params, extend, geo, lang, fields } = {}) {
        return request("/api/youtube/shorts-info", {
          query: { id, params, extend, geo, lang, fields },
        });
      },
      shortsSequence({ params, id, geo, lang, fields } = {}) {
        return request("/api/youtube/shorts-sequence", {
          query: { params, id, geo, lang, fields },
        });
      },
      shortsSoundAttribution({ params, id, token, geo, lang, fields } = {}) {
        return request("/api/youtube/shorts-sound-attribution", {
          query: { params, id, token, geo, lang, fields },
        });
      },
      channelHome({ id, forUsername, token, params, geo, lang, fields } = {}) {
        return request("/api/youtube/channel-home", {
          query: { id, forUsername, token, params, geo, lang, fields },
        });
      },
      channelVideos({ id, forUsername, sort_by, token, geo, lang, local, fields } = {}) {
        return request("/api/youtube/channel-videos", {
          query: { id, forUsername, sort_by, token, geo, lang, local, fields },
        });
      },
      channelShorts({ id, forUsername, sort_by, token, geo, lang, local, fields } = {}) {
        return request("/api/youtube/channel-shorts", {
          query: { id, forUsername, sort_by, token, geo, lang, local, fields },
        });
      },
      channelLivestreams({ id, forUsername, sort_by, token, geo, lang, local, fields } = {}) {
        return request("/api/youtube/channel-livestreams", {
          query: { id, forUsername, sort_by, token, geo, lang, local, fields },
        });
      },
      channelPlaylists({ id, sort_by, token, geo, lang, forUsername, fields } = {}) {
        return request("/api/youtube/channel-playlists", {
          query: { id, sort_by, token, geo, lang, forUsername, fields },
        });
      },
      channelFeaturedChannels({ id, forUsername, token, geo, lang, fields } = {}) {
        return request("/api/youtube/channel-featured-channels", {
          query: { id, forUsername, token, geo, lang, fields },
        });
      },
      channelAbout({ id, geo, lang, forUsername, fields } = {}) {
        return request("/api/youtube/channel-about", {
          query: { id, geo, lang, forUsername, fields },
        });
      },
      channelSearch({ id, forUsername, query, token, geo, lang, fields } = {}) {
        return request("/api/youtube/channel-search", {
          query: { id, forUsername, query, token, geo, lang, fields },
        });
      },
      channelStore({ id, forUsername, token, geo, lang, fields } = {}) {
        return request("/api/youtube/channel-store", {
          query: { id, forUsername, token, geo, lang, fields },
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
      postInfo({ id, channelId, geo, lang, fields } = {}) {
        return request("/api/youtube/post-info", {
          query: { id, channelId, geo, lang, fields },
        });
      },
      postComments({ id, channelId, sort_by, token, geo, lang, fields } = {}) {
        return request("/api/youtube/post-comments", {
          query: { id, channelId, sort_by, token, geo, lang, fields },
        });
      },
    },
    tiktok: {
      videoInfo({ url, hd } = {}) {
        return request("/api/tiktok/video-info", {
          query: { url, hd },
        });
      },
      newVideoInfo({ url, hd } = {}) {
        return request("/api/tiktok/new-video-info", {
          query: { url, hd },
        });
      },
      searchUser({ keywords, count, cursor } = {}) {
        return request("/api/tiktok/search-user", {
          query: { keywords, count, cursor },
        });
      },
      userVideos({ unique_id, user_id, count, cursor } = {}) {
        return request("/api/tiktok/user-videos", {
          query: { unique_id, user_id, count, cursor },
        });
      },
      userFavorites({ unique_id, user_id, count, cursor } = {}) {
        return request("/api/tiktok/user-favorites", {
          query: { unique_id, user_id, count, cursor },
        });
      },
      userFollowing({ user_id, count, time } = {}) {
        return request("/api/tiktok/user-following", {
          query: { user_id, count, time },
        });
      },
      userFollowers({ user_id, count, time } = {}) {
        return request("/api/tiktok/user-followers", {
          query: { user_id, count, time },
        });
      },
      userInfo({ unique_id, user_id } = {}) {
        return request("/api/tiktok/user-info", {
          query: { unique_id, user_id },
        });
      },
      musicInfo({ url } = {}) {
        return request("/api/tiktok/music-info", {
          query: { url },
        });
      },
      musicVideos({ music_id, count, cursor } = {}) {
        return request("/api/tiktok/music-videos", {
          query: { music_id, count, cursor },
        });
      },
      searchVideos({ keywords, count, cursor, region, publish_time, sort_type } = {}) {
        return request("/api/tiktok/search-videos", {
          query: { keywords, count, cursor, region, publish_time, sort_type },
        });
      },
      videoFeed({ region, count } = {}) {
        return request("/api/tiktok/video-feed", {
          query: { region, count },
        });
      },
      commentList({ url, count, cursor } = {}) {
        return request("/api/tiktok/comment-list", {
          query: { url, count, cursor },
        });
      },
      commentReplies({ comment_id, video_id, count, cursor } = {}) {
        return request("/api/tiktok/comment-replies", {
          query: { comment_id, video_id, count, cursor },
        });
      },
      challengeInfo({ challenge_id, challenge_name } = {}) {
        return request("/api/tiktok/challenge-info", {
          query: { challenge_id, challenge_name },
        });
      },
      challengeSearch({ keywords, count, cursor } = {}) {
        return request("/api/tiktok/challenge-search", {
          query: { keywords, count, cursor },
        });
      },
      challengePosts({ challenge_id, count, cursor, region } = {}) {
        return request("/api/tiktok/challenge-posts", {
          query: { challenge_id, count, cursor, region },
        });
      },
      playlistInfo({ url } = {}) {
        return request("/api/tiktok/playlist-info", {
          query: { url },
        });
      },
      playlistPosts({ mix_id, count, cursor } = {}) {
        return request("/api/tiktok/playlist-posts", {
          query: { mix_id, count, cursor },
        });
      },
      photoSearch({ keywords, region } = {}) {
        return request("/api/tiktok/photo-search", {
          query: { keywords, region },
        });
      },
      userPlaylists({ unique_id, user_id, count, cursor } = {}) {
        return request("/api/tiktok/user-playlists", {
          query: { unique_id, user_id, count, cursor },
        });
      },
      regionList() {
        return request("/api/tiktok/region-list", {
          query: {},
        });
      },
    },
    instagram: {
      usernameFromId({ id, fields } = {}) {
        return request("/api/instagram/username-from-id", {
          query: { id, fields },
        });
      },
      userIdFromUsername({ username, fields } = {}) {
        return request("/api/instagram/user-id-from-username", {
          query: { username, fields },
        });
      },
      mediaShortcodeFromId({ id, fields } = {}) {
        return request("/api/instagram/media-shortcode-from-id", {
          query: { id, fields },
        });
      },
      mediaIdFromUrl({ url, fields } = {}) {
        return request("/api/instagram/media-id-from-url", {
          query: { url, fields },
        });
      },
      userInfoByUsername({ username, fields } = {}) {
        return request("/api/instagram/user-info-by-username", {
          query: { username, fields },
        });
      },
      userInfoByUsernameV2({ username, fields } = {}) {
        return request("/api/instagram/user-info-by-username-v2", {
          query: { username, fields },
        });
      },
      userInfoByUserId({ id, fields } = {}) {
        return request("/api/instagram/user-info-by-user-id", {
          query: { id, fields },
        });
      },
      userInfoByUserIdV2({ id, fields } = {}) {
        return request("/api/instagram/user-info-by-user-id-v2", {
          query: { id, fields },
        });
      },
      webProfileInfoByUsername({ username, fields } = {}) {
        return request("/api/instagram/web-profile-info-by-username", {
          query: { username, fields },
        });
      },
      mediaListByUserId({ id, count, allowRestrictedMedia, maxId, fields } = {}) {
        return request("/api/instagram/media-list-by-user-id", {
          query: { id, count, allow_restricted_media: allowRestrictedMedia, max_id: maxId, fields },
        });
      },
      mediaListByUserIdV2({ id, count, endCursor, fields } = {}) {
        return request("/api/instagram/media-list-by-user-id-v2", {
          query: { id, count, end_cursor: endCursor, fields },
        });
      },
      reelsByUserId({ id, count, maxId, fields } = {}) {
        return request("/api/instagram/reels-by-user-id", {
          query: { id, count, max_id: maxId, fields },
        });
      },
      repostsByUserId({ id, maxId, fields } = {}) {
        return request("/api/instagram/reposts-by-user-id", {
          query: { id, max_id: maxId, fields },
        });
      },
      taggedMediaByUserId({ id, count, endCursor, fields } = {}) {
        return request("/api/instagram/tagged-media-by-user-id", {
          query: { id, count, end_cursor: endCursor, fields },
        });
      },
      relatedProfilesByUserId({ id, fields } = {}) {
        return request("/api/instagram/related-profiles-by-user-id", {
          query: { id, fields },
        });
      },
      searchUsers({ query, fields } = {}) {
        return request("/api/instagram/search-users", {
          query: { query, select: "users", fields },
        });
      },
      mediaInfoByUrl({ url, fields } = {}) {
        return request("/api/instagram/media-info-by-url", {
          query: { url, fields },
        });
      },
      mediaInfoById({ id, fields } = {}) {
        return request("/api/instagram/media-info-by-id", {
          query: { id, fields },
        });
      },
      downloadLinkByUrl({ url, fields } = {}) {
        return request("/api/instagram/download-link-by-url", {
          query: { url, fields },
        });
      },
      musicInfoByMusicId({ id, maxId, fields } = {}) {
        return request("/api/instagram/music-info-by-music-id", {
          query: { id, max_id: maxId, fields },
        });
      },
      mediaByHashtag({ query, endCursor, fields } = {}) {
        return request("/api/instagram/media-by-hashtag", {
          query: { query, end_cursor: endCursor, fields },
        });
      },
      searchHashtags({ query, fields } = {}) {
        return request("/api/instagram/search-hashtags", {
          query: { query, select: "hashtags", fields },
        });
      },
    },
  };
}
