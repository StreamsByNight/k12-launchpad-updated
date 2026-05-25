import { useState } from "react";
import { Loader2, Radio, Video } from "lucide-react";
import { Card } from "./Card";
import { useDashboard } from "../context/DashboardContext";
import { openCanvasLink } from "../lib/navigation/openCanvasLink";

export function LiveClassConnectCard() {
  const { data, loading } = useDashboard();
  const live = data?.liveClassConnect;
  const [opening, setOpening] = useState(false);

  async function handleJoin() {
    if (!live) return;
    setOpening(true);
    try {
      await openCanvasLink({ href: live.joinHref });
    } finally {
      setOpening(false);
    }
  }

  if (loading) {
    return (
      <Card className="flex h-full min-h-[220px] animate-pulse flex-col p-5">
        <div className="mb-2 h-4 w-32 rounded bg-slate-100" />
        <div className="mb-4 h-6 w-48 rounded bg-slate-100" />
        <div className="flex-1 rounded-xl bg-slate-100" />
      </Card>
    );
  }

  if (!live) {
    return (
      <Card className="flex h-full flex-col items-center justify-center p-5 text-center">
        <Video className="mb-2 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">Live Class Connect</p>
        <p className="mt-2 text-sm text-slate-400">
          No BigBlueButton sessions scheduled
        </p>
      </Card>
    );
  }

  const isBbb = /bigbluebutton|bbb/i.test(live.conferenceType);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-500">Live Class Connect</p>
          {live.isLive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
              <Radio className="h-3 w-3" />
              Live
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900">{live.title}</h3>
        <p className="text-sm text-slate-500">{live.subtitle}</p>
        {live.time && (
          <p className="mt-1 text-xs font-medium text-k12-blue">{live.time}</p>
        )}
        {isBbb && (
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">
            BigBlueButton
          </p>
        )}

        <button
          type="button"
          onClick={handleJoin}
          disabled={opening}
          className="relative my-4 flex flex-1 min-h-[100px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-k12-sky to-k12-sky-deep transition hover:opacity-90 disabled:opacity-70"
        >
          <div className="text-center">
            {opening ? (
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-k12-blue" />
            ) : (
              <Video className="mx-auto h-12 w-12 text-k12-blue" strokeWidth={1.5} />
            )}
            <p className="mt-2 text-xs font-semibold text-k12-blue">
              {live.isLive ? "Open live session in Calendar" : "Open in Calendar"}
            </p>
          </div>
        </button>
      </div>

      <div className="space-y-2 p-5 pt-0">
        <button
          type="button"
          onClick={handleJoin}
          disabled={opening}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-k12-blue py-3 text-sm font-semibold text-white transition hover:bg-k12-blue-hover disabled:opacity-70"
        >
          {opening && <Loader2 className="h-4 w-4 animate-spin" />}
          {live.isLive ? "Open Live Session" : "Open in Calendar"}
        </button>

        {live.recordings.length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2">
            <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Recordings
            </p>
            {live.recordings.slice(0, 2).map((rec) => (
              <a
                key={rec.href}
                href={rec.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-2 py-1.5 text-xs font-medium text-k12-blue hover:bg-white"
              >
                {rec.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
