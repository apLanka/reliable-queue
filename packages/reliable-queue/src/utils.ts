/**
 * Generate a unique ID for tasks
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate retry delay with optional exponential backoff
 */
export function calculateRetryDelay(
  retryCount: number,
  baseDelay: number,
  exponentialBackoff: boolean = true,
  maxDelay: number = 30000
): number {
  if (!exponentialBackoff) {
    return baseDelay;
  }

  const delay = baseDelay * Math.pow(2, retryCount);
  return Math.min(delay, maxDelay);
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Safe JSON parse that returns null on error
 */
export function safeJsonParse<T>(str: string): T | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Safe JSON stringify that returns empty string on error
 */
export function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
}
