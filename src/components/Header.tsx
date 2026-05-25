import { LogOut, Pencil, RefreshCw } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

const navTabs = ["My Schedule", "Classes", "Announcements"] as const;

export function Header() {
  const { data, loading, error, source, refresh } = useDashboard();
  const { session, signOut } = useAuth();

  const isDemo = session?.mode === "demo";

  function handleLogout() {
    signOut();
    window.location.href = "/";
  }

  return (
    <header className="mb-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          {!isDemo && (
            <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              {session?.canvasBaseUrl
                ? new URL(session.canvasBaseUrl).hostname
                : "Canvas"}
            </span>
          )}
          {isDemo && (
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              Demo mode
            </span>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {loading ? (
                <span className="inline-block h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
              ) : (
                <>Hi {data?.studentName ?? session?.userName ?? "Student"}!</>
              )}
            </h1>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>

          <div className="flex gap-1">
            {navTabs.map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  i === 0
                    ? "bg-k12-blue text-white"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`rounded-lg px-3 py-1 font-medium ${
              source === "canvas"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isDemo ? "Demo data" : source === "canvas" ? "Your Canvas" : "Loading…"}
          </span>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            aria-label="Refresh dashboard"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-slate-600 transition hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {error && !isDemo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {error}
        </div>
      )}
    </header>
  );
}
