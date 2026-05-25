import { TodaysFocusCard } from "./TodaysFocusCard";
import { TimeWeatherCard } from "./TimeWeatherCard";
import { LiveClassConnectCard } from "./LiveClassConnectCard";
import { UpcomingListCard } from "./UpcomingListCard";
import { QuickLinkCard } from "./QuickLinkCard";
import { useDashboard } from "../context/DashboardContext";

export function BentoGrid() {
  const { data, loading } = useDashboard();

  if (loading && data.courses.length === 0 && data.upcomingLessons.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl bg-white/80"
          />
        ))}
      </div>
    );
  }

  const d = data;

  return (
    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]">
      <div className="lg:col-span-2">
        <TodaysFocusCard />
      </div>
      <div className="lg:col-span-1">
        <TimeWeatherCard />
      </div>
      <div className="lg:col-span-1">
        <LiveClassConnectCard />
      </div>

      <div className="lg:col-span-1">
        <UpcomingListCard
          title="Upcoming Lessons"
          count={d.upcomingLessons.length}
          items={d.upcomingLessons}
          variant="lesson"
          loading={loading}
        />
      </div>
      <div className="lg:col-span-1">
        <UpcomingListCard
          title="Upcoming Class Connect"
          count={d.upcomingClassConnect.length}
          items={d.upcomingClassConnect}
          variant="connect"
          loading={loading}
        />
      </div>
      <div className="lg:col-span-1">
        <UpcomingListCard
          title="Upcoming Assignments"
          count={d.upcomingAssignments.length}
          items={d.upcomingAssignments}
          variant="assignment"
          loading={loading}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:col-span-1">
        {d.quickLinks.map((link) => (
          <QuickLinkCard
            key={link.id}
            title={link.title}
            variant={link.variant}
            href={link.href}
          />
        ))}
      </div>
    </div>
  );
}
