import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface WeatherCondition {
  label: string;
  emoji: string;
  icon: "sun" | "cloud" | "wind" | "cloud-rain" | "cloud-snow" | "zap";
}

export interface DayForecast {
  dateStr: string;
  dayName: string;
  shortDay: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherCondition;
  goodForFarming: boolean;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  condition: WeatherCondition;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DayForecast[];
  rainDayShort: string | null;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const DEFAULT_LAT = 19.07;
const DEFAULT_LNG = 72.87;
const DEFAULT_LOCATION_LABEL = "Maharashtra, India";

const RAPIDAPI_HOST = "open-weather13.p.rapidapi.com";
const RAPIDAPI_KEY = "7e85967994mshd20e4e726bacf41p147a1ejsn9cb5d39a921a";
const RAPIDAPI_HEADERS = {
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
  "Content-Type": "application/json",
};

const DEFAULT_DATA: WeatherData = {
  current: {
    temperature: 29,
    weatherCode: 0,
    windSpeed: 12,
    humidity: 65,
    condition: { label: "Partly Cloudy", emoji: "⛅", icon: "cloud" },
  },
  daily: [],
  rainDayShort: null,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function fToC(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

export function getCondition(description: string): WeatherCondition {
  const d = description.toLowerCase();
  if (d.includes("thunder")) return { label: "Thunderstorm", emoji: "⛈️", icon: "zap" };
  if (d.includes("snow")) return { label: "Snow", emoji: "❄️", icon: "cloud-snow" };
  if (d.includes("rain")) return { label: "Rain", emoji: "🌧️", icon: "cloud-rain" };
  if (d.includes("drizzle")) return { label: "Drizzle", emoji: "🌦️", icon: "cloud-rain" };
  if (d.includes("mist") || d.includes("fog")) return { label: "Foggy", emoji: "🌫️", icon: "wind" };
  if (d.includes("haze") || d.includes("smoke") || d.includes("dust"))
    return { label: "Haze", emoji: "🌫️", icon: "wind" };
  if (d.includes("cloud")) return { label: "Partly Cloudy", emoji: "⛅", icon: "cloud" };
  if (d.includes("clear")) return { label: "Clear Sky", emoji: "☀️", icon: "sun" };
  return { label: "Cloudy", emoji: "☁️", icon: "cloud" };
}

function isGoodForFarming(description: string, rainMm: number): boolean {
  const d = description.toLowerCase();
  const bad = ["thunder", "snow", "heavy rain", "extreme"];
  return !bad.some((b) => d.includes(b)) && rainMm < 5;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dayMeta(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return { dayName: FULL_DAYS[d.getDay()], shortDay: DAY_NAMES[d.getDay()] };
}

// ─── Location resolver ─────────────────────────────────────────────────────

async function resolveLocation(): Promise<{ lat: number; lng: number; label: string }> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, label: DEFAULT_LOCATION_LABEL };
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    let label = `${lat.toFixed(2)}°N ${lng.toFixed(2)}°E`;

    try {
      const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (geo && geo.length > 0) {
        const p = geo[0];
        const parts = [
          p.city ?? p.subregion ?? p.district,
          p.region,
          p.country,
        ].filter(Boolean);
        if (parts.length > 0) label = parts.join(", ");
      }
    } catch {
      // keep coordinate label
    }

    return { lat, lng, label };
  } catch {
    return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, label: DEFAULT_LOCATION_LABEL };
  }
}

// ─── API calls ─────────────────────────────────────────────────────────────

async function fetchCurrentWeather(lat: number, lng: number): Promise<CurrentWeather> {
  const url = `https://${RAPIDAPI_HOST}/city/latlon/${lat}/${lng}`;
  const res = await fetch(url, { headers: RAPIDAPI_HEADERS });
  if (!res.ok) throw new Error(`Current weather HTTP ${res.status}`);
  const json = await res.json();

  const tempC = fToC(json.main.temp as number);
  const description: string = json.weather?.[0]?.description ?? "clear sky";
  const windMph: number = json.wind?.speed ?? 0;
  const windKmh = Math.round(windMph * 1.60934);
  const humidity: number = json.main?.humidity ?? 0;

  return {
    temperature: tempC,
    weatherCode: 0,
    windSpeed: windKmh,
    humidity,
    condition: getCondition(description),
  };
}

async function fetchForecast(lat: number, lng: number): Promise<DayForecast[]> {
  const url = `https://${RAPIDAPI_HOST}/fivedaysforcast?latitude=${lat}&longitude=${lng}&lang=EN`;
  const res = await fetch(url, { headers: RAPIDAPI_HEADERS });
  if (!res.ok) throw new Error(`Forecast HTTP ${res.status}`);
  const json = await res.json();

  const list: any[] = json.list ?? [];

  // Group 3-hourly entries by date (YYYY-MM-DD)
  const byDate: Record<
    string,
    { temps: number[]; descriptions: string[]; rainMm: number }
  > = {};

  for (const item of list) {
    const dateStr: string = (item.dt_txt as string).split(" ")[0];
    const tempC = fToC(item.main.temp as number);
    const desc: string = item.weather?.[0]?.description ?? "clear sky";
    const rain: number = item.rain?.["3h"] ?? 0;

    if (!byDate[dateStr]) {
      byDate[dateStr] = { temps: [], descriptions: [], rainMm: 0 };
    }
    byDate[dateStr].temps.push(tempC);
    byDate[dateStr].descriptions.push(desc);
    byDate[dateStr].rainMm += rain;
  }

  const days: DayForecast[] = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 7)
    .map(([dateStr, { temps, descriptions, rainMm }]) => {
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      // pick the midday description if available, else the most frequent
      const dominantDesc = descriptions[Math.floor(descriptions.length / 2)] ?? descriptions[0];
      const precipitation = Math.round(rainMm * 10) / 10;
      const { dayName, shortDay } = dayMeta(dateStr);
      return {
        dateStr,
        dayName,
        shortDay,
        maxTemp,
        minTemp,
        precipitation,
        weatherCode: 0,
        condition: getCondition(dominantDesc),
        goodForFarming: isGoodForFarming(dominantDesc, rainMm),
      };
    });

  return days;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>("Locating…");
  const [locationReady, setLocationReady] = useState(false);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { lat, lng, label } = await resolveLocation();
      setLocationLabel(label);
      setLocationReady(true);

      const [current, daily] = await Promise.all([
        fetchCurrentWeather(lat, lng),
        fetchForecast(lat, lng),
      ]);

      const rainDay = daily.find((_d, i) => i > 0 && _d.precipitation > 0.5);
      const rainDayShort = rainDay ? rainDay.shortDay : null;

      setData({ current, daily, rainDayShort });
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
      if (!locationReady) {
        setLocationLabel(DEFAULT_LOCATION_LABEL);
        setLocationReady(true);
      }
      setData((prev) => prev ?? DEFAULT_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather: data, loading, error, locationLabel, refetch: fetchWeather };
}
