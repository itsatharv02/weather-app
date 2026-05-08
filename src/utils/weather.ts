// ─── Types ───────────────────────────────────────────────────────────────────

export type Unit = "metric" | "imperial";

export interface Weather {
  city: string;
  country: string;
  tempC: number; // always stored in °C
  feelsLikeC: number;
  humidity: number;
  windKph: number; // always stored in km/h
  condition: string; // e.g. "Rain", "Clear"
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  pressure: number;
  visibility: number; // km
}

export interface DayForecast {
  dayName: string;
  date: string;
  highC: number;
  lowC: number;
  icon: string;
  description: string;
  condition: string;
}

// ─── Unit conversion (no API call needed) ────────────────────────────────────

export function displayTemp(tempC: number, unit: Unit): string {
  if (unit === "metric") return `${Math.round(tempC)}°C`;
  return `${Math.round((tempC * 9) / 5 + 32)}°F`;
}

export function displayWind(kph: number, unit: Unit): string {
  if (unit === "metric") return `${kph} km/h`;
  return `${Math.round(kph * 0.621371)} mph`;
}

// ─── Gradient based on weather condition ─────────────────────────────────────

export function getBgGradient(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("thunderstorm"))
    return "from-gray-900 via-purple-950 to-gray-900";
  if (c.includes("rain") || c.includes("drizzle"))
    return "from-slate-900 via-blue-950 to-slate-900";
  if (c.includes("snow")) return "from-slate-800 via-blue-900 to-slate-800";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze"))
    return "from-gray-800 via-gray-700 to-gray-800";
  if (c.includes("clear")) return "from-blue-950 via-indigo-900 to-blue-950";
  if (c.includes("cloud")) return "from-slate-800 via-gray-800 to-slate-900";
  return "from-blue-950 via-indigo-900 to-blue-950";
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

export interface Suggestion {
  icon: string;
  text: string;
  type: "info" | "warning" | "success";
}

export function getSuggestions(w: Weather): Suggestion[] {
  const s: Suggestion[] = [];
  const c = w.condition.toLowerCase();
  const t = w.tempC;

  if (c.includes("thunderstorm")) {
    s.push({
      icon: "⚡",
      text: "Thunderstorm alert! Stay indoors and avoid open areas.",
      type: "warning",
    });
  } else if (c.includes("rain") || c.includes("drizzle")) {
    s.push({
      icon: "☂️",
      text: "Carry an umbrella — rain expected.",
      type: "warning",
    });
    s.push({
      icon: "🚗",
      text: "Drive carefully — roads may be slippery.",
      type: "warning",
    });
  } else if (c.includes("snow")) {
    s.push({
      icon: "🧥",
      text: "Heavy snowfall — wear warm winter clothing.",
      type: "warning",
    });
  } else if (c.includes("mist") || c.includes("fog")) {
    s.push({
      icon: "🌫️",
      text: "Low visibility — use headlights while driving.",
      type: "warning",
    });
  } else if (c.includes("clear") && t >= 18 && t <= 30) {
    s.push({
      icon: "🌿",
      text: "Perfect day for a walk or outdoor activity!",
      type: "success",
    });
  } else if (c.includes("cloud")) {
    s.push({
      icon: "🌤️",
      text: "Partly cloudy — good for outdoor plans.",
      type: "success",
    });
  }

  if (t >= 38) {
    s.push({
      icon: "🌡️",
      text: "Extreme heat! Stay hydrated and avoid peak sun hours.",
      type: "warning",
    });
  } else if (t >= 30) {
    s.push({
      icon: "🧴",
      text: "Hot day — apply sunscreen and drink plenty of water.",
      type: "info",
    });
  } else if (t <= 0) {
    s.push({
      icon: "🥶",
      text: "Freezing! Wear gloves, scarf and thermal layers.",
      type: "warning",
    });
  } else if (t <= 10) {
    s.push({ icon: "🧥", text: "It's chilly — wear a jacket.", type: "info" });
  }

  if (w.humidity > 85) {
    s.push({
      icon: "💦",
      text: "Very humid — avoid strenuous outdoor exercise.",
      type: "info",
    });
  }

  if (s.length === 0) {
    s.push({
      icon: "✅",
      text: "Weather looks good — have a great day!",
      type: "success",
    });
  }

  return s;
}

// ─── OpenWeatherMap API response shapes ──────────────────────────────────────

interface OWMWeatherEntry {
  main: string;
  description: string;
  icon: string;
}

interface OWMCurrentResponse {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number };
  weather: OWMWeatherEntry[];
  visibility: number;
}

interface OWMForecastItem {
  dt: number;
  main: { temp: number };
  weather: OWMWeatherEntry[];
}

interface OWMForecastResponse {
  list: OWMForecastItem[];
}

// ─── API ─────────────────────────────────────────────────────────────────────

const BASE = "https://api.openweathermap.org/data/2.5";

function key(): string {
  const k = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!k) throw new Error("Missing VITE_OPENWEATHER_API_KEY in .env");
  return k;
}

function mapWeather(d: OWMCurrentResponse): Weather {
  return {
    city: d.name,
    country: d.sys.country,
    tempC: d.main.temp,
    feelsLikeC: d.main.feels_like,
    humidity: d.main.humidity,
    windKph: Math.round(d.wind.speed * 3.6 * 10) / 10, // m/s → km/h
    condition: d.weather[0].main,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    sunrise: d.sys.sunrise,
    sunset: d.sys.sunset,
    pressure: d.main.pressure,
    visibility: Math.round(d.visibility / 1000),
  };
}

function mapForecast(d: OWMForecastResponse): DayForecast[] {
  const days: Record<string, OWMForecastItem[]> = {};
  d.list.forEach((item) => {
    const day = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const key = `${day}|${date}`;
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });

  return Object.entries(days)
    .slice(0, 5)
    .map(([k, items]) => {
      const [dayName, date] = k.split("|");
      const temps = items.map((i) => i.main.temp);
      const mid = items[Math.floor(items.length / 2)];
      return {
        dayName,
        date,
        highC: Math.max(...temps),
        lowC: Math.min(...temps),
        icon: mid.weather[0].icon,
        description: mid.weather[0].description,
        condition: mid.weather[0].main,
      };
    });
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404)
      throw new Error("City not found. Check the spelling and try again.");
    if (res.status === 401)
      throw new Error("Invalid API key. Check your .env file.");
    throw new Error("Failed to fetch. Please try again.");
  }
  return res.json() as Promise<T>;
}

export async function fetchByCity(
  city: string,
): Promise<{ weather: Weather; forecast: DayForecast[] }> {
  const [w, f] = await Promise.all([
    get<OWMCurrentResponse>(
      `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key()}`,
    ),
    get<OWMForecastResponse>(
      `${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${key()}`,
    ),
  ]);
  return { weather: mapWeather(w), forecast: mapForecast(f) };
}

export async function fetchByCoords(
  lat: number,
  lon: number,
): Promise<{ weather: Weather; forecast: DayForecast[] }> {
  const [w, f] = await Promise.all([
    get<OWMCurrentResponse>(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key()}`),
    get<OWMForecastResponse>(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key()}`),
  ]);
  return { weather: mapWeather(w), forecast: mapForecast(f) };
}

export function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
