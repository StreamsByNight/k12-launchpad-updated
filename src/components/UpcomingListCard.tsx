import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "./Card";
import { ClickableRow } from "./ClickableRow";
import { openCanvasLink } from "../lib/navigation/openCanvasLink";
import type {
  UpcomingAssignment,
  UpcomingClassConnect,
  UpcomingLesson,
} from "../types/dashboard";

type Item = UpcomingLesson | UpcomingClassConnect | UpcomingAssignment;

type UpcomingListCardProps = {
  title: string;
  count: number;
  items: Item[];
  variant?: "lesson" | "connect" | "assignment";
  loading?: boolean;
};

export function UpcomingListCard({
  title,
  count,
  items,
  variant = "lesson",
  loading = false,
}: UpcomingListCardProps) {
  const [joiningId, setJoiningId] = useState<string | null>(null);

  return (
    <Card className="flex h-full min-h-[280px] flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full bg-k12-sky px-2.5 py-0.5 text-sm font-semibold text-k12-blue">
          {count}
        </span>
      </div>

      {variant === "lesson" && (
        <div className="mb-3 flex flex-wrap gap-2">
          <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
            <option>Sort by: due date</option>
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
            <option>All categories</option>
          </select>
        </div>
      )}

      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="h-14 animate-pulse rounded-xl bg-slate-100"
              />
            ))
          : items.map((item) => {
              const connect =
                variant === "connect" ? (item as UpcomingClassConnect) : null;
              const lesson =
                variant === "lesson" ? (item as UpcomingLesson) : null;
              const assignment =
                variant === "assignment"
                  ? (item as UpcomingAssignment)
                  : null;

              return (
                <li key={item.id}>
                  {variant === "connect" ? (
                    <div className="group flex items-stretch gap-1 rounded-xl border border-transparent transition hover:border-k12-sky hover:bg-k12-sky/40">
                      <ClickableRow
                        href={item.href}
                        className="min-w-0 flex-1 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {item.title}
                          </p>
                          {connect?.teacher && (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {connect.teacher} · {connect.time}
                            </p>
                          )}
                          {connect?.date && (
                            <p className="mt-0.5 text-xs text-k12-blue">
                              {connect.date}
                            </p>
                          )}
                        </div>
                      </ClickableRow>
                      {connect?.joinHref && (
                        <button
                          type="button"
                          disabled={joiningId === item.id}
                          className={`my-2 mr-2 flex shrink-0 items-center self-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-70 ${
                            connect.isLive
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-k12-blue hover:bg-k12-blue-hover"
                          }`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setJoiningId(item.id);
                            try {
                              await openCanvasLink({ href: connect.joinHref! });
                            } finally {
                              setJoiningId(null);
                            }
                          }}
                        >
                          {joiningId === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : null}
                          {connect.isLive ? "Join live" : "Join"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <ClickableRow
                      href={item.href}
                      className="px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {item.title}
                        </p>
                        {lesson?.due && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Due {lesson.due}
                          </p>
                        )}
                        {assignment?.badge && (
                          <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            {assignment.badge}
                          </span>
                        )}
                      </div>
                    </ClickableRow>
                  )}
                </li>
              );
            })}
      </ul>
    </Card>
  );
}
