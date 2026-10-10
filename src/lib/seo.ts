/**
 * Normalize the configured site URL into a bare origin.
 * Accepts "example.com", "http(s)://example.com/" etc. and never throws.
 * Returns "" for empty or malformed input.
 */
export function normalizeSiteUrl(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return "";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "";
  }
}

/** Resolved deploy origin, with a local-dev fallback. */
export const SITE_URL = normalizeSiteUrl(import.meta.env.SITE_URL) || "http://localhost:4321";
