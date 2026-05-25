import { canvasFetch } from "./client";
import type { CanvasConference } from "./types";

type ConferencesResponse = { conferences?: CanvasConference[] };

export async function fetchUserConferences(
  state?: "live",
): Promise<CanvasConference[]> {
  const params = state ? { state } : undefined;
  const data = await canvasFetch<ConferencesResponse>("/conferences", params);
  return data.conferences ?? [];
}

export function isBigBlueButton(conf: CanvasConference): boolean {
  return /bigbluebutton|bbb/i.test(conf.conference_type ?? "");
}

export function isLiveConference(conf: CanvasConference): boolean {
  if (conf.ended_at) return false;
  if (!conf.started_at) return false;
  return new Date(conf.started_at) <= new Date();
}

export function isUpcomingConference(conf: CanvasConference): boolean {
  if (conf.ended_at) return false;
  if (!conf.started_at) return true;
  return new Date(conf.started_at) > new Date();
}

export function conferenceJoinUrl(conf: CanvasConference): string | null {
  return conf.join_url ?? conf.url ?? null;
}

export function formatConferenceTime(conf: CanvasConference): string {
  if (!conf.started_at) return "Scheduled";
  const start = new Date(conf.started_at);
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const startStr = start.toLocaleTimeString("en-US", opts);
  if (conf.duration) {
    const end = new Date(start.getTime() + conf.duration * 60 * 1000);
    const endStr = end.toLocaleTimeString("en-US", opts);
    return `${startStr} - ${endStr}`;
  }
  return startStr;
}

export function sortConferences(
  list: CanvasConference[],
): CanvasConference[] {
  return [...list].sort((a, b) => {
    const aTime = a.started_at ? new Date(a.started_at).getTime() : Infinity;
    const bTime = b.started_at ? new Date(b.started_at).getTime() : Infinity;
    return aTime - bTime;
  });
}

export function pickFeaturedConference(
  all: CanvasConference[],
  live: CanvasConference[],
): CanvasConference | null {
  const bbb = (list: CanvasConference[]) =>
    list.filter(isBigBlueButton).filter((c) => conferenceJoinUrl(c));

  const liveBbb = bbb(live);
  if (liveBbb.length > 0) return liveBbb[0];

  const upcomingBbb = bbb(all.filter(isUpcomingConference));
  if (upcomingBbb.length > 0) return sortConferences(upcomingBbb)[0];

  const anyBbb = bbb(all.filter((c) => !c.ended_at));
  if (anyBbb.length > 0) return sortConferences(anyBbb)[0];

  const anyWithJoin = all.filter((c) => conferenceJoinUrl(c));
  return anyWithJoin[0] ?? null;
}
