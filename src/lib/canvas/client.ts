import { getSession } from "../auth/session";

export function hasCanvasSession(): boolean {
  const session = getSession();
  return session?.mode === "canvas" && Boolean(session.accessToken);
}

export function isDemoSession(): boolean {
  return getSession()?.mode === "demo";
}

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const session = getSession();
  if (!session || session.mode !== "canvas") {
    throw new Error("Not signed in to Canvas");
  }

  const url = new URL(`/api/canvas${path}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Canvas-Base-Url": session.canvasBaseUrl,
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Session expired — please sign in again");
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Canvas API ${response.status}: ${text || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function canvasFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  return apiFetch<T>(path, params);
}

/** Single request with high per_page — for endpoints that don't support page numbers. */
export async function canvasFetchList<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T[]> {
  const data = await apiFetch<T[] | T>(path, { ...params, per_page: "100" });
  return Array.isArray(data) ? data : [];
}

/** Page-based pagination for courses, calendar, etc. */
export async function canvasFetchAll<T>(
  path: string,
  params?: Record<string, string>,
  maxPages = 3,
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    try {
      const batch = await apiFetch<T[]>(path, {
        ...params,
        per_page: "50",
        page: String(page),
      });
      if (!Array.isArray(batch)) break;
      results.push(...batch);
      if (batch.length < 50) break;
      page += 1;
    } catch (err) {
      if (page === 1) throw err;
      break;
    }
  }

  return results;
}
