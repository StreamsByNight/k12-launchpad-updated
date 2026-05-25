import { getSession } from "../auth/session";
import { DEFAULT_CANVAS_URL } from "../auth/config";
import type { CanvasCalendarEvent } from "./types";

export function getCanvasBase(): string {
  const session = getSession();
  if (session?.canvasBaseUrl) return session.canvasBaseUrl.replace(/\/$/, "");
  return DEFAULT_CANVAS_URL.replace(/\/$/, "") || "https://stridek12academy.com";
}

export function courseHref(courseId: number | string): string {
  return `${getCanvasBase()}/courses/${courseId}`;
}

export function assignmentHref(
  courseId: number | string,
  assignmentId: number | string,
): string {
  return `${getCanvasBase()}/courses/${courseId}/assignments/${assignmentId}`;
}

export function calendarHref(): string {
  return `${getCanvasBase()}/calendar`;
}

export function plannerHref(): string {
  return `${getCanvasBase()}/#todo`;
}

export function resolveHref(
  htmlUrl: string | undefined | null,
  fallback: string,
): string {
  if (htmlUrl && htmlUrl.startsWith("http")) return htmlUrl;
  return fallback;
}

/** Link to the Canvas calendar event page (not the disabled conferences UI). */
export function calendarEventHref(e: CanvasCalendarEvent): string {
  if (e.html_url?.startsWith("http")) return e.html_url;
  if (e.course_id) {
    return `${courseHref(e.course_id)}/calendar_events/${e.id}`;
  }
  return calendarHref();
}
