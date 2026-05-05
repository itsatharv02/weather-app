import { useState } from "react";
import {
  Weather,
  Unit,
  displayTemp,
  displayWind,
  formatTime,
} from "../utils/weather";

// Emoji fallback map if OWM icon fails to load
const conditionEmoji: Record<string, string> = {
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Rain: "🌧️",
  Snow: "❄️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "🌫️",
  Fog: "🌫️",
  Sand: "🌫️",
  Ash: "🌫️",
  Squall: "🌬️",
  Tornado: "🌪️",
  Clear: "☀️",
  Clouds: "☁️",
};

interface Props {
  weather: Weather;
  unit: Unit;
  onToggleUnit: () => void;
}

export function WeatherCard({ weather, unit, onToggleUnit }: Props) {
  const fallbackEmoji = conditionEmoji[weather.condition] ?? "🌡️";

  const stats = [
    { icon: "💧", label: "Humidity", value: `${weather.humidity}%` },
    { icon: "💨", label: "Wind", value: displayWind(weather.windKph, unit) },
    { icon: "👁️", label: "Visibility", value: `${weather.visibility} km` },
    { icon: "🌡️", label: "Pressure", value: `${weather.pressure} hPa` },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 sm:p-6 text-white">
      {/* City + unit toggle */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight truncate">
            {weather.city}
            <span className="text-white/50 text-lg sm:text-xl ml-2">
              {weather.country}
            </span>
          </h2>
          <p className="text-white/60 text-xs sm:text-sm capitalize mt-0.5">
            {weather.description}
          </p>
        </div>
        <button
          onClick={onToggleUnit}
          className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/20 font-semibold transition-all shrink-0 whitespace-nowrap"
        >
          {unit === "metric" ? "°C → °F" : "°F → °C"}
        </button>
      </div>

      {/* Temperature + icon */}
      <div className="flex items-center gap-2 sm:gap-3 my-3 sm:my-4">
        <span className="text-6xl sm:text-7xl leading-none select-none">
          {fallbackEmoji}
        </span>

        <div>
          <div className="text-5xl sm:text-7xl font-bold leading-none">
            {displayTemp(weather.tempC, unit)}
          </div>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Feels like {displayTemp(weather.feelsLikeC, unit)}
          </p>
        </div>
      </div>

      {/* Stats grid — 2 cols on mobile, 4 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center border border-white/10"
          >
            <div className="text-lg sm:text-xl mb-1">{s.icon}</div>
            <div className="font-semibold text-xs sm:text-sm">{s.value}</div>
            <div className="text-white/50 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sunrise / Sunset */}
      <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
        {[
          { icon: "🌅", label: "Sunrise", time: formatTime(weather.sunrise) },
          { icon: "🌇", label: "Sunset", time: formatTime(weather.sunset) },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 bg-white/10 rounded-2xl p-2.5 sm:p-3 text-center border border-white/10"
          >
            <div className="text-lg sm:text-xl">{s.icon}</div>
            <div className="font-semibold text-xs sm:text-sm">{s.time}</div>
            <div className="text-white/50 text-xs">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
