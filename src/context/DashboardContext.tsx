import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchDashboardData } from "../lib/canvas/fetchDashboard";
import { hasCanvasSession } from "../lib/canvas/client";
import { mockDashboard } from "../data/mockData";
import { emptyDashboard } from "../data/emptyDashboard";
import { useAuth } from "./AuthContext";
import type { DashboardData, DataSource } from "../types/dashboard";

type DashboardContextValue = {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  source: DataSource;
  refresh: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [data, setData] = useState<DashboardData>(mockDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource>("mock");
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((n) => n + 1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchDashboardData();
        if (!cancelled) {
          setData(result.data);
          setSource(result.source);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load dashboard";
          setError(
            hasCanvasSession()
              ? `${message}. Make sure the API server is running (npm run dev).`
              : message,
          );
          setData(session?.userName ? { ...emptyDashboard, studentName: session.userName } : emptyDashboard);
          setSource("mock");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tick, session]);

  return (
    <DashboardContext.Provider
      value={{ data, loading, error, source, refresh }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
