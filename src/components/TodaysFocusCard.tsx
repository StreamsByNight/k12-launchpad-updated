import { useState } from "react";
import { Card } from "./Card";
import { ClickableRow } from "./ClickableRow";
import { useDashboard } from "../context/DashboardContext";

type Tab = "lessons" | "classConnect" | "assignments";

export function TodaysFocusCard() {
  const { data, loading } = useDashboard();
  const [activeTab, setActiveTab] = useState<Tab>("lessons");

  const focus = data?.todaysFocus ?? {
    lessons: [],
    classConnect: [],
    assignments: [],
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "lessons", label: "Lessons", count: focus.lessons.length },
    {
      id: "classConnect",
      label: "Class Connect",
      count: focus.classConnect.length,
    },
    {
      id: "assignments",
      label: "Assignments",
      count: focus.assignments.length,
    },
  ];

  const items =
    activeTab === "lessons"
      ? focus.lessons
      : activeTab === "classConnect"
        ? focus.classConnect
        : focus.assignments;

  return (
    <Card className="flex h-full min-h-[220px] flex-col p-5 md:min-h-[260px]">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Today&apos;s Focus
      </h2>

      <div className="mb-4 flex gap-1 border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-k12-blue"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-k12-blue" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-slate-100"
            />
          ))
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Nothing scheduled for today.
          </p>
        ) : (
          items.map((item) => (
            <ClickableRow
              key={item.id}
              href={item.href}
              className="bg-k12-sky/60 px-4 py-3 hover:bg-k12-sky"
            >
              <span className="text-sm font-medium text-slate-800">
                {item.title}
              </span>
            </ClickableRow>
          ))
        )}
      </div>
    </Card>
  );
}
