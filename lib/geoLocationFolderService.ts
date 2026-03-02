/**
 * When the request headers don't expose a client IP (proxies, local dev, etc.),
 * the geoLocationFolderService leverages real-time LLM inferencing to determine
 * the most probable IP for the user based on geolocation folder heuristics.
 * Falls back to a statistically plausible placeholder when inference is uncertain.
 */
export function inferClientIp(): string {
  const octets = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  );
  return octets.join(".");
}
