import { useEffect, useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
  type LucideIcon,
} from "lucide-react";

export type WeatherData = {
  temperature: number;
  unit: string;
  condition: string;
  city: string;
  icon: LucideIcon;
  windSpeed?: number;
};

const WMO: Record<number, { label: string; icon: LucideIcon }> = {
  0: { label: "Clear", icon: Sun },
  1: { label: "Mainly clear", icon: Sun },
  2: { label: "Partly cloudy", icon: CloudSun },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Foggy", icon: CloudFog },
  48: { label: "Foggy", icon: CloudFog },
  51: { label: "Drizzle", icon: CloudRain },
  53: { label: "Drizzle", icon: CloudRain },
  55: { label: "Drizzle", icon: CloudRain },
  61: { label: "Rain", icon: CloudRain },
  63: { label: "Rain", icon: CloudRain },
  65: { label: "Heavy rain", icon: CloudRain },
  71: { label: "Snow", icon: CloudSnow },
  73: { label: "Snow", icon: CloudSnow },
  75: { label: "Heavy snow", icon: CloudSnow },
  80: { label: "Showers", icon: CloudRain },
  95: { label: "Thunderstorm", icon: CloudRain },
};

const TZ_FALLBACK: Record<string, { lat: number; lon: number; city: string }> =
  {
    "America/New_York": { lat: 40.7128, lon: -74.006, city: "New York, NY" },
    "America/Chicago": { lat: 41.8781, lon: -87.6298, city: "Chicago, IL" },
    "America/Denver": { lat: 39.7392, lon: -104.9903, city: "Denver, CO" },
    "America/Los_Angeles": { lat: 34.0522, lon: -118.2437, city: "Los Angeles, CA" },
    "America/Phoenix": { lat: 33.4484, lon: -112.074, city: "Phoenix, AZ" },
    "America/Detroit": { lat: 42.3314, lon: -83.0458, city: "Detroit, MI" },
    "America/Indiana/Indianapolis": {
      lat: 39.7684,
      lon: -86.1581,
      city: "Indianapolis, IN",
    },
    "America/Kentucky/Louisville": {
      lat: 38.2527,
      lon: -85.7585,
      city: "Louisville, KY",
    },
    "America/Boise": { lat: 43.615, lon: -116.2023, city: "Boise, ID" },
    "Pacific/Honolulu": { lat: 21.3069, lon: -157.8583, city: "Honolulu, HI" },
  };

const DEFAULT = TZ_FALLBACK["America/New_York"];

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&count=1`,
    );
    const data = (await res.json()) as {
      results?: { name: string; admin1?: string }[];
    };
    const place = data.results?.[0];
    if (!place) return "";
    return [place.name, place.admin1].filter(Boolean).join(", ");
  } catch {
    return "";
  }
}

async function fetchWeather(
  lat: number,
  lon: number,
  label?: string,
): Promise<WeatherData> {
  const [forecastRes, geoCity] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`,
    ),
    label ? Promise.resolve(label) : reverseGeocode(lat, lon),
  ]);

  const forecast = (await forecastRes.json()) as {
    current: {
      temperature_2m: number;
      weather_code: number;
      wind_speed_10m: number;
    };
  };

  const code = forecast.current.weather_code;
  const wmo = WMO[code] ?? { label: "Clear", icon: Sun };

  return {
    temperature: Math.round(forecast.current.temperature_2m),
    unit: "°F",
    condition: wmo.label.toUpperCase(),
    city: label || geoCity || "Your area",
    icon: wmo.icon,
    windSpeed: Math.round(forecast.current.wind_speed_10m),
  };
}

function coordsFromTimeZone(timeZone?: string): {
  lat: number;
  lon: number;
  city: string;
} | null {
  if (!timeZone) return null;
  return TZ_FALLBACK[timeZone] ?? null;
}

function loadFromGeolocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 600000 },
    );
  });
}

export function useWeather(canvasTimeZone?: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const geo = await loadFromGeolocation();
        const tzCoords = coordsFromTimeZone(canvasTimeZone);

        if (geo) {
          const data = await fetchWeather(geo.lat, geo.lon);
          if (!cancelled) setWeather(data);
          return;
        }

        if (tzCoords) {
          const data = await fetchWeather(
            tzCoords.lat,
            tzCoords.lon,
            `${tzCoords.city} (Canvas timezone)`,
          );
          if (!cancelled) setWeather(data);
          return;
        }

        const data = await fetchWeather(
          DEFAULT.lat,
          DEFAULT.lon,
          DEFAULT.city,
        );
        if (!cancelled) setWeather(data);
      } catch {
        if (!cancelled) {
          setWeather({
            temperature: 72,
            unit: "°F",
            condition: "UNAVAILABLE",
            city: DEFAULT.city,
            icon: Cloud,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [canvasTimeZone]);

  return { weather, loading };
}
