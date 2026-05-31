import { track } from '@vercel/analytics';

export function trackPageEvent(
  name: string,
  properties?: Record<string, string | number | boolean>,
) {
  track(name, properties);
}
