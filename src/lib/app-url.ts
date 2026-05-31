/** Authenticated product (login, dashboard, apply flows). */
export const APP_URL = (import.meta.env.VITE_APP_URL ?? 'https://app.staplehire.com').replace(
  /\/$/,
  '',
);

export function appPath(path: string): string {
  return `${APP_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
