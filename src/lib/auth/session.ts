import type { UserSession } from "./types";

const STORAGE_KEY = "k12_launchpad_session";

export function getSession(): UserSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserSession;
    if (!parsed.mode) return null;
    if (parsed.mode === "demo") return parsed;
    if (parsed.canvasBaseUrl && parsed.accessToken) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function normalizeCanvasUrl(input: string): string {
  let url = input.trim();
  if (!url) throw new Error("Enter your Canvas URL");
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const parsed = new URL(url);
  return parsed.origin;
}
