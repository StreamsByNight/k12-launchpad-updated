import type {
  DashboardData,
  LiveClassConnect,
  ConferenceRecording,
} from "../../types/dashboard";
import {
  assignmentHref,
  courseHref,
  calendarHref,
  calendarEventHref,
  plannerHref,
  resolveHref,
  getCanvasBase,
} from "./links";
import {
  formatConferenceTime,
  isBigBlueButton,
  isLiveConference,
  sortConferences,
} from "./conferences";
import type {
  CanvasCalendarEvent,
  CanvasConference,
  CanvasCourse,
  CanvasPlannerItem,
  CanvasTodo,
  CanvasUser,
} from "./types";

function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTimeRange(start: string | null, end: string | null): string {
  if (!start) return "";
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const startStr = new Date(start).toLocaleTimeString("en-US", opts);
  if (!end) return startStr;
  const endStr = new Date(end).toLocaleTimeString("en-US", opts);
  return `${startStr} - ${endStr}`;
}

function isToday(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isFuture(iso: string | null | undefined): boolean {
  if (!iso) return true;
  return new Date(iso) >= new Date();
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function relativeDate(iso: string | null | undefined): string {
  if (!iso) return "Scheduled";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.round(
    (d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function truncate(text: string, max = 40): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 3)}...` : t;
}

function formatLastActivity(iso: string | null | undefined): string {
  if (!iso) return "No recent activity";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Last login: today";
  if (days === 1) return "Last login: yesterday";
  return `Last login: ${days} days ago`;
}

function isClassConnectEvent(e: CanvasCalendarEvent): boolean {
  if (e.web_conference) return true;
  return /class\s*connect|live\s*session|zoom|teams|webex|conference|homeroom\s*live|bigbluebutton|bbb/i.test(
    e.title + (e.location_name ?? ""),
  );
}

function isLiveCalendarEvent(e: CanvasCalendarEvent): boolean {
  if (!e.start_at) return false;
  const start = new Date(e.start_at);
  const end = e.end_at
    ? new Date(e.end_at)
    : new Date(start.getTime() + 60 * 60 * 1000);
  const now = new Date();
  return start <= now && now <= end;
}

function eventHref(e: CanvasCalendarEvent): string {
  return calendarEventHref(e);
}

function titlesMatch(a: string, b: string): boolean {
  const na = a.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nb = b.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (na.length < 4 || nb.length < 4) return false;
  return na.includes(nb.slice(0, 12)) || nb.includes(na.slice(0, 12));
}

function matchConferenceToEvent(
  conf: CanvasConference,
  events: CanvasCalendarEvent[],
): CanvasCalendarEvent | null {
  for (const e of events) {
    if (!isClassConnectEvent(e)) continue;
    if (!titlesMatch(conf.title, e.title)) continue;
    if (conf.started_at && e.start_at && !isSameDay(conf.started_at, e.start_at)) {
      continue;
    }
    return e;
  }
  return null;
}

function mapConferenceRecordings(
  conf: CanvasConference,
): ConferenceRecording[] {
  return (conf.recordings ?? [])
    .filter((r) => r.playback_url)
    .map((r, i) => ({
      title: r.title ?? `Recording ${i + 1}`,
      href: r.playback_url!,
    }));
}

function pickFeaturedClassConnectEvent(
  events: CanvasCalendarEvent[],
): CanvasCalendarEvent | null {
  const connect = events.filter(isClassConnectEvent);
  if (connect.length === 0) return null;

  const live = connect
    .filter(isLiveCalendarEvent)
    .sort(
      (a, b) =>
        new Date(a.start_at ?? 0).getTime() -
        new Date(b.start_at ?? 0).getTime(),
    );
  if (live.length > 0) return live[0];

  const upcoming = connect
    .filter((e) => e.start_at && isFuture(e.start_at))
    .sort(
      (a, b) =>
        new Date(a.start_at ?? 0).getTime() -
        new Date(b.start_at ?? 0).getTime(),
    );
  if (upcoming.length > 0) return upcoming[0];

  return connect[0];
}

function buildLiveClassConnect(
  event: CanvasCalendarEvent | null,
  matchedConf: CanvasConference | null,
): LiveClassConnect {
  if (!event) return null;

  const href = calendarEventHref(event);
  const live =
    isLiveCalendarEvent(event) ||
    Boolean(matchedConf && isLiveConference(matchedConf));
  const recordings = matchedConf ? mapConferenceRecordings(matchedConf) : [];

  return {
    title: truncate(event.title, 48),
    subtitle: event.context_name ?? "Class Connect",
    courseName: event.context_name,
    href,
    joinHref: href,
    conferenceType: matchedConf?.conference_type ?? "Calendar Event",
    isLive: live,
    time: formatTimeRange(event.start_at, event.end_at),
    hasRecording: recordings.length > 0,
    recordings,
  };
}

function mapCalendarConnectEvent(e: CanvasCalendarEvent) {
  const href = calendarEventHref(e);
  const live = isLiveCalendarEvent(e);
  return {
    id: String(e.id),
    title: truncate(e.title),
    teacher: e.context_name ?? "Instructor",
    time: formatTimeRange(e.start_at, e.end_at),
    date: live ? "Live now" : relativeDate(e.start_at),
    href,
    joinHref: href,
    conferenceType: e.web_conference ? "BigBlueButton" : "Calendar Event",
    isLive: live,
  };
}

function mapConferenceAsCalendarItem(
  conf: CanvasConference,
  events: CanvasCalendarEvent[],
) {
  const matched = matchConferenceToEvent(conf, events);
  const href = matched ? calendarEventHref(matched) : calendarHref();
  const live = matched
    ? isLiveCalendarEvent(matched)
    : isLiveConference(conf);

  return {
    id: `conf-${conf.id}`,
    title: truncate(conf.title),
    teacher: conf.context_name ?? conf.conference_type ?? "Class Connect",
    time: matched
      ? formatTimeRange(matched.start_at, matched.end_at)
      : formatConferenceTime(conf),
    date: live ? "Live now" : relativeDate(conf.started_at),
    href,
    joinHref: href,
    conferenceType: conf.conference_type,
    isLive: live,
  };
}

export function mapCanvasToDashboard(
  user: CanvasUser,
  courses: CanvasCourse[],
  upcomingEvents: CanvasCalendarEvent[],
  assignmentEvents: CanvasCalendarEvent[],
  planner: CanvasPlannerItem[],
  todos: CanvasTodo[],
  allConferences: CanvasConference[] = [],
  liveConferences: CanvasConference[] = [],
): DashboardData {
  const bbbConferences = sortConferences(
    allConferences.filter(isBigBlueButton),
  );

  const allEvents = [...upcomingEvents, ...assignmentEvents];
  const uniqueEvents = Array.from(
    new Map(allEvents.map((e) => [String(e.id), e])).values(),
  ).filter((e) => isFuture(e.start_at) || isFuture(e.end_at) || isLiveCalendarEvent(e));

  const classConnectEvents = uniqueEvents.filter(isClassConnectEvent);
  const featuredEvent = pickFeaturedClassConnectEvent(classConnectEvents);

  const matchedConf =
    featuredEvent &&
    [...liveConferences, ...bbbConferences].find(
      (c) => matchConferenceToEvent(c, classConnectEvents) === featuredEvent,
    );

  const todayEvents = uniqueEvents.filter((e) => isToday(e.start_at));

  const lessonsToday = todayEvents.filter(
    (e) =>
      !isClassConnectEvent(e) &&
      (e.type === "event" || e.type !== "assignment"),
  );

  const classConnectToday = classConnectEvents
    .filter((e) => isToday(e.start_at) || isLiveCalendarEvent(e))
    .map((e) => ({
      id: String(e.id),
      title: truncate(e.title),
      href: calendarEventHref(e),
    }));

  const assignmentsToday = todayEvents.filter((e) => e.type === "assignment");

  const calendarUpcoming = classConnectEvents
    .filter((e) => !isToday(e.start_at) || isLiveCalendarEvent(e))
    .sort(
      (a, b) =>
        new Date(a.start_at ?? 0).getTime() -
        new Date(b.start_at ?? 0).getTime(),
    )
    .map(mapCalendarConnectEvent);

  const conferenceUpcoming = bbbConferences
    .filter((c) => !c.ended_at)
    .map((c) => mapConferenceAsCalendarItem(c, classConnectEvents));

  const seen = new Set<string>();
  const upcomingClassConnect = [...calendarUpcoming, ...conferenceUpcoming]
    .filter((item) => {
      const key = item.href || item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 10);

  const plannerLessons = planner
    .filter(
      (p) =>
        p.plannable_type === "assignment" ||
        p.plannable_type === "discussion_topic" ||
        p.plannable_type === "quiz",
    )
    .filter((p) => p.plannable.due_at && isFuture(p.plannable.due_at))
    .sort(
      (a, b) =>
        new Date(a.plannable.due_at!).getTime() -
        new Date(b.plannable.due_at!).getTime(),
    )
    .slice(0, 10)
    .map((p) => ({
      id: String(p.plannable.id),
      title: truncate(`${p.context_name}: ${p.plannable.title}`),
      due: formatShortDate(p.plannable.due_at),
      href: resolveHref(
        p.html_url ?? p.plannable.html_url,
        p.plannable.course_id
          ? assignmentHref(p.plannable.course_id, p.plannable.id)
          : plannerHref(),
      ),
    }));

  const upcomingAssignments = todos
    .filter((t) => t.assignment && t.type === "submitting")
    .slice(0, 10)
    .map((t) => {
      const a = t.assignment!;
      const overdue =
        a.due_at && new Date(a.due_at) < new Date() ? "Overdue" : null;
      return {
        id: String(a.id),
        title: truncate(`${t.context_name ?? ""}: ${a.name}`.trim()),
        badge: overdue,
        href: resolveHref(
          t.html_url ?? a.html_url,
          a.course_id
            ? assignmentHref(a.course_id, a.id)
            : plannerHref(),
        ),
      };
    });

  const coursesMapped = courses.map((c) => {
    const nextPlanner = planner.find(
      (p) =>
        p.plannable.course_id === c.id &&
        p.plannable.due_at &&
        isFuture(p.plannable.due_at),
    );
    const lastActivity = c.enrollments?.[0]?.last_activity_at;

    return {
      id: String(c.id),
      name: truncate(c.name, 44),
      href: courseHref(c.id),
      lastLogin: formatLastActivity(lastActivity),
      nextActivity: nextPlanner
        ? truncate(nextPlanner.plannable.title, 28)
        : "View course",
      nextActivityHref: nextPlanner
        ? resolveHref(
            nextPlanner.html_url ?? nextPlanner.plannable.html_url,
            assignmentHref(c.id, nextPlanner.plannable.id),
          )
        : courseHref(c.id),
    };
  });

  const liveClassConnect = buildLiveClassConnect(
    featuredEvent,
    matchedConf ?? null,
  );

  const canvasHome = getCanvasBase();

  return {
    studentName: user.short_name || user.name,
    timeZone: user.time_zone,
    todaysFocus: {
      lessons: lessonsToday.map((e) => ({
        id: String(e.id),
        title: truncate(`${e.context_name ?? ""} ${e.title}`.trim()),
        href: eventHref(e),
      })),
      classConnect: classConnectToday,
      assignments: assignmentsToday.map((e) => ({
        id: String(e.id),
        title: truncate(`${e.context_name ?? ""}: ${e.title}`.trim()),
        href: eventHref(e),
      })),
    },
    upcomingLessons: plannerLessons,
    upcomingClassConnect,
    upcomingAssignments,
    quickLinks: [
      {
        id: "library",
        title: "K12 Library",
        variant: "library" as const,
        href: "https://www.k12.com/resources/",
      },
      {
        id: "zone",
        title: "K12 Zone",
        variant: "zone" as const,
        href: canvasHome,
      },
    ],
    courses: coursesMapped,
    liveClassConnect,
  };
}
