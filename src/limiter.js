import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Sliding Window Log Rate Limiter Middleware
 * @param {Object} options 
 * @param {number} options.windowMs - Time window in milliseconds (e.g. 60000 for 1 min)
 * @param {number} options.maxRequests - Max allowed requests per window
 */
export function rateLimiter({ windowMs = 60000, maxRequests = 10 } = {}) {
  return async (req, res, next) => {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown_ip';
    const key = `ratelimit:${clientIp}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      // Atomic multi-command pipeline
      const multi = redis.multi();

      // 1. Remove timestamps older than the sliding window threshold
      multi.zremrangebyscore(key, 0, windowStart);

      // 2. Count requests in the current window
      multi.zcard(key);

      // 3. Record current request timestamp
      multi.zadd(key, now, `${now}-${Math.random()}`);

      // 4. Set key TTL to match window duration
      multi.pexpire(key, windowMs);

      const results = await multi.exec();
      const currentRequestCount = results[1][1];

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - currentRequestCount));

      if (currentRequestCount >= maxRequests) {
        return res.status(429).json({
          status: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(windowMs / 1000)} seconds.`,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      next();
    } catch (err) {
      // Fail-open strategy to keep the API available if Redis fails
      console.error('Rate Limiter Redis Error:', err.message);
      next();
    }
  };
}
