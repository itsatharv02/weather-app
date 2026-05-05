import { DayForecast, Unit, displayTemp } from "../utils/weather";

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
  forecast: DayForecast[];
  unit: Unit;
}

export function Forecast({ forecast, unit }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 sm:p-5 text-white">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
        5-Day Forecast
      </h3>
      <div className="flex flex-col gap-2">
        {forecast.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 border border-white/10"
          >
            <span className="font-semibold w-8 sm:w-9 text-xs sm:text-sm shrink-0">
              {d.dayName}
            </span>
            <span className="text-white/40 text-xs w-14 sm:w-16 shrink-0 hidden xs:block">
              {d.date}
            </span>
            <span className="text-2xl w-8 text-center shrink-0 leading-none select-none">
              {conditionEmoji[d.condition] ?? "🌡️"}
            </span>
            <span className="flex-1 text-white/50 text-xs capitalize truncate hidden sm:block">
              {d.description}
            </span>
            <div className="flex gap-1 sm:gap-2 text-xs sm:text-sm font-semibold shrink-0 ml-auto">
              <span>{displayTemp(d.highC, unit)}</span>
              <span className="text-white/30">/</span>
              <span className="text-white/50">{displayTemp(d.lowC, unit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
