import { mockDashboard } from "../../data/mockData";
import {
  isDemoSession,
  hasCanvasSession,
  canvasFetch,
  canvasFetchAll,
  canvasFetchList,
} from "./client";
import type { DashboardData } from "../../types/dashboard";
import { fetchUserConferences } from "./conferences";
import { mapCanvasToDashboard } from "./mappers";
import type {
  CanvasCalendarEvent,
  CanvasConference,
  CanvasCourse,
  CanvasPlannerItem,
  CanvasTodo,
  CanvasUser,
} from "./types";

function dateRange(): { start: string; end: string } {
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const end = new Date();
  end.setDate(end.getDate() + 60);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function fetchDashboardData(): Promise<{
  data: DashboardData;
  source: "mock" | "canvas";
}> {
  if (isDemoSession() || !hasCanvasSession()) {
    return { data: mockDashboard, source: "mock" };
  }

  const { start, end } = dateRange();

  const [
    user,
    courses,
    upcomingEvents,
    assignmentEvents,
    calendarEvents,
    planner,
    todos,
    conferenceResults,
  ] = await Promise.all([
    canvasFetch<CanvasUser>("/users/self"),
    canvasFetchAll<CanvasCourse>("/courses", {
      enrollment_state: "active",
      include: "enrollments",
    }),
    canvasFetch<CanvasCalendarEvent[]>("/users/self/upcoming_events"),
    canvasFetchAll<CanvasCalendarEvent>("/calendar_events", {
      type: "assignment",
      start_date: start,
      end_date: end,
      undated: "false",
    }),
    canvasFetchAll<CanvasCalendarEvent>("/calendar_events", {
      type: "event",
      start_date: start,
      end_date: end,
    }),
    canvasFetchList<CanvasPlannerItem>("/users/self/planner/items"),
    canvasFetch<CanvasTodo[]>("/users/self/todo"),
    Promise.all([
      fetchUserConferences().catch(() => [] as CanvasConference[]),
      fetchUserConferences("live").catch(() => [] as CanvasConference[]),
    ]),
  ]);

  const [allConferences, liveConferences] = conferenceResults;

  return {
    data: mapCanvasToDashboard(
      user,
      courses,
      [...(upcomingEvents ?? []), ...calendarEvents],
      assignmentEvents,
      planner,
      todos,
      allConferences,
      liveConferences,
    ),
    source: "canvas",
  };
}
