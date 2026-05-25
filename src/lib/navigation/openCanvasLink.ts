import { getSession } from "../auth/session";
import { getCanvasBase } from "../canvas/links";

export type CanvasLinkTarget = {
  href: string;
};

function isOAuthLoopUrl(url: string): boolean {
  try {
    const u = new URL(url, window.location.origin);
    if (!u.pathname.includes("/login/oauth2")) return false;
    const redirect = u.searchParams.get("redirect_uri") ?? "";
    return (
      redirect.includes("localhost") ||
      redirect.includes("127.0.0.1") ||
      redirect.includes(window.location.host)
    );
  } catch {
    return false;
  }
}

function isConferencePageUrl(url: string): boolean {
  try {
    const u = new URL(url, getCanvasBase());
    return /\/conferences(\/|$)/i.test(u.pathname);
  } catch {
    return url.includes("/conferences");
  }
}

function sanitizeHref(href: string): string | null {
  if (!href || href === "#") return null;
  if (href.startsWith("/api/") || href.includes("localhost")) return null;
  if (isOAuthLoopUrl(href)) return null;
  if (isConferencePageUrl(href)) return null;

  try {
    const u = new URL(href);
    const canvasHost = new URL(getCanvasBase()).hostname;
    const allowed =
      u.hostname === canvasHost ||
      u.hostname.endsWith(".instructure.com") ||
      u.pathname.includes("/calendar_events/") ||
      u.pathname.includes("/calendar");
    return allowed ? u.toString() : null;
  } catch {
    if (href.startsWith("/")) {
      const built = `${getCanvasBase()}${href}`;
      return isConferencePageUrl(built) ? null : built;
    }
    return null;
  }
}

export async function openCanvasLink(target: CanvasLinkTarget): Promise<void> {
  const safe = sanitizeHref(target.href);
  if (safe) {
    window.open(safe, "_blank", "noopener,noreferrer");
  }
}
