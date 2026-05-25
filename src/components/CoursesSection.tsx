import { useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card } from "./Card";
import { useDashboard } from "../context/DashboardContext";
import { openCanvasLink } from "../lib/navigation/openCanvasLink";

export function CoursesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, loading } = useDashboard();
  const courses = data?.courses ?? [];
  const [openingId, setOpeningId] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  async function openCourse(href: string, id: string) {
    setOpeningId(id);
    try {
      await openCanvasLink({ href });
    } finally {
      setOpeningId(null);
    }
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Courses</h2>
        <p className="text-sm text-slate-500">
          Explore your {courses.length} courses
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:bg-slate-50"
          aria-label="Scroll courses left"
        >
          <ChevronLeft className="h-5 w-5 text-k12-blue" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 w-[260px] shrink-0 animate-pulse rounded-2xl bg-white"
                />
              ))
            : courses.map((course) => (
                <Card
                  key={course.id}
                  className="flex w-[260px] shrink-0 flex-col p-5"
                >
                  <button
                    type="button"
                    onClick={() => openCourse(course.href, course.id)}
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-k12-sky text-k12-blue transition hover:bg-k12-sky-deep"
                  >
                    <BookOpen className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openCourse(course.href, course.id)}
                    className="mb-2 line-clamp-2 text-left text-sm font-semibold text-slate-900 hover:text-k12-blue"
                  >
                    {course.name}
                  </button>

                  <p className="mb-1 text-xs text-slate-400">{course.lastLogin}</p>
                  <p className="mb-4 text-xs text-slate-500">
                    Next:{" "}
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(
                          course.nextActivityHref ?? course.href,
                          `${course.id}-next`,
                        )
                      }
                      className="font-medium text-k12-blue hover:underline"
                    >
                      {course.nextActivity}
                    </button>
                  </p>

                  <button
                    type="button"
                    disabled={openingId === course.id}
                    onClick={() => openCourse(course.href, course.id)}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-k12-blue bg-white py-2.5 text-sm font-semibold text-k12-blue transition hover:bg-k12-sky disabled:opacity-70"
                  >
                    {openingId === course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Start Course
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </Card>
              ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:bg-slate-50"
          aria-label="Scroll courses right"
        >
          <ChevronRight className="h-5 w-5 text-k12-blue" />
        </button>
      </div>
    </section>
  );
}
