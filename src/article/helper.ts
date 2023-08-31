const article_viewed_redis_key = 'article_viewed';

export const getRedisArticleViewedCacheKey = (articleId: number) => {
  return `${article_viewed_redis_key}_${articleId}`;
};
