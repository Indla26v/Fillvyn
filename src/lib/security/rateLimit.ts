/**
 * Fixed-window rate limiter kept in server memory.
 * On serverless hosts each instance has its own window, so this is a best-effort
 * guard against bursts from a single client rather than a global quota.
 */

import type { NextRequest } from 'next/server';

interface Window {
  count: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __fillvyn_rate_limits__: Map<string, Window> | undefined;
}

function getBuckets(): Map<string, Window> {
  if (!global.__fillvyn_rate_limits__) {
    global.__fillvyn_rate_limits__ = new Map();
  }
  return global.__fillvyn_rate_limits__;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Records one hit for `key` and returns whether it is still within `limit` per `windowMs`.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSeconds: number } {
  const buckets = getBuckets();
  const now = Date.now();

  // Drop expired windows so the map cannot grow without bound.
  if (buckets.size > 5000) {
    buckets.forEach((value, bucketKey) => {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    });
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
  return { allowed: current.count <= limit, retryAfterSeconds };
}
