type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
};

type Bucket = {
  count: number;
  windowStart: number;
};

// Best-effort in-memory limiter for single runtime process.
const buckets = new Map<string, Bucket>();

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const { key, limit, windowMs } = options;

  const existing = buckets.get(key);
  if (!existing || now - existing.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.windowStart + windowMs - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, retryAfterSec: 0 };
}