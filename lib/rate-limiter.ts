/**
 * Simple in-memory rate limiter
 * Use Redis or similar for production at scale
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const limits = new Map<string, RateLimitEntry>()

const RATE_LIMITS = {
  DEFAULT: { max: 60, windowMs: 60_000 },      // 60 requests per minute
  CONSENSUS: { max: 20, windowMs: 60_000 },    // 20 advice requests per minute
  SEARCH: { max: 30, windowMs: 60_000 },       // 30 searches per minute
}

export function rateLimit(key: string, limitType: keyof typeof RATE_LIMITS = 'DEFAULT'): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const limit = RATE_LIMITS[limitType]
  const entry = limits.get(key)

  if (!entry || now > entry.resetAt) {
    // New window
    limits.set(key, { count: 1, resetAt: now + limit.windowMs })
    return { allowed: true, remaining: limit.max - 1 }
  }

  if (entry.count >= limit.max) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit.max - entry.count }
}

/** Cleanup old entries every 5 minutes */
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  limits.forEach((entry, key) => {
    if (now > entry.resetAt) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(k => limits.delete(k))
}, 5 * 60 * 1000)
