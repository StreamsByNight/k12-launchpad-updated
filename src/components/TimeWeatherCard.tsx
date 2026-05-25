import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Card } from "./Card";
import { useWeather } from "../hooks/useWeather";
import { useDashboard } from "../context/DashboardContext";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function TimeWeatherCard() {
  const [now, setNow] = useState(new Date());
  const { data } = useDashboard();
  const { weather, loading } = useWeather(data?.timeZone);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const WeatherIcon = weather?.icon;

  return (
    <Card className="flex h-full flex-col items-center justify-between p-5 text-center">
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {formatTime(now)}
        </p>
        <p className="mt-1 text-sm text-slate-500">{formatDate(now)}</p>
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-gradient-to-b from-k12-sky/80 to-transparent py-4">
        {loading ? (
          <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        ) : (
          WeatherIcon && (
            <WeatherIcon
              className="h-12 w-12 text-amber-500"
              strokeWidth={1.25}
            />
          )
        )}
        {loading ? (
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="text-sm font-bold tracking-wide text-slate-800">
            {weather?.condition}{" "}
            <span className="text-k12-blue">
              {weather?.temperature}
              {weather?.unit}
            </span>
          </p>
        )}
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" />
          {loading ? "Locating…" : weather?.city}
        </p>
        {!loading && weather?.windSpeed != null && (
          <p className="text-[10px] text-slate-400">
            Wind {weather.windSpeed} mph
          </p>
        )}
      </div>
    </Card>
  );
}
