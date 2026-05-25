/** Your school's Canvas URL — students never need to type this if set. */
export const DEFAULT_CANVAS_URL =
  import.meta.env.VITE_CANVAS_BASE_URL?.replace(/\/$/, "") ?? "";

export const OAUTH_CLIENT_ID = import.meta.env.VITE_CANVAS_CLIENT_ID ?? "";

export function isOAuthReady(): boolean {
  return Boolean(OAUTH_CLIENT_ID && DEFAULT_CANVAS_URL);
}
