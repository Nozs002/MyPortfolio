/**
 * IP Rate limiter utility for password recovery requests (REQ-RECOVERY-010).
 * Limits password reset requests to a maximum of 3 per 15 minutes per IP.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3;

/**
 * Checks whether an IP address is rate limited.
 * @param ip Client IP address
 * @returns { isLimited: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(ip: string | null): {
  isLimited: boolean;
  remaining: number;
  resetInSeconds: number;
} {
  if (!ip) {
    // Fallback if IP cannot be determined
    return { isLimited: false, remaining: MAX_REQUESTS, resetInSeconds: 0 };
  }

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean expired store entry
  if (record && now > record.resetTime) {
    rateLimitStore.delete(ip);
  }

  const currentRecord = rateLimitStore.get(ip);

  if (!currentRecord) {
    return {
      isLimited: false,
      remaining: MAX_REQUESTS - 1,
      resetInSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (currentRecord.count >= MAX_REQUESTS) {
    const resetInSeconds = Math.ceil((currentRecord.resetTime - now) / 1000);
    return { isLimited: true, remaining: 0, resetInSeconds };
  }

  return {
    isLimited: false,
    remaining: MAX_REQUESTS - currentRecord.count - 1,
    resetInSeconds: Math.ceil((currentRecord.resetTime - now) / 1000),
  };
}

/**
 * Increments request count for an IP address.
 * @param ip Client IP address
 */
export function incrementRateLimit(ip: string | null): void {
  if (!ip) return;

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
  } else {
    record.count += 1;
  }
}
