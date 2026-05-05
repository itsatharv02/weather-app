import { useState } from 'react'
import {
  Weather, DayForecast, Unit,
  fetchByCity, fetchByCoords,
  getBgGradient, getSuggestions,
} from './utils/weather'
import { SearchBar } from './components/SearchBar'
import { WeatherCard } from './components/WeatherCard'
import { SuggestionsPanel } from './components/SuggestionsPanel'
import { Forecast } from './components/Forecast'

interface State {
  weather: Weather | null
  forecast: DayForecast[]
  loading: boolean
  error: string | null
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('metric')
  const [state, setState] = useState<State>({
    weather: null, forecast: [], loading: false, error: null,
  })

  const setLoading = () => setState(s => ({ ...s, loading: true, error: null }))
  const setError = (msg: string) => setState(s => ({ ...s, loading: false, error: msg }))
  const setData = (weather: Weather, forecast: DayForecast[]) =>
    setState({ weather, forecast, loading: false, error: null })

  async function handleSearch(city: string) {
    setLoading()
    try {
      const { weather, forecast } = await fetchByCity(city)
      setData(weather, forecast)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleLocate() {
    if (!navigator.geolocation) return setError('Geolocation not supported by your browser.')
    setLoading()
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { weather, forecast } = await fetchByCoords(coords.latitude, coords.longitude)
          setData(weather, forecast)
        } catch (e) {
          setError((e as Error).message)
        }
      },
      () => setError('Location access denied. Search for a city instead.')
    )
  }

  const gradient = state.weather
    ? getBgGradient(state.weather.condition)
    : 'from-blue-950 via-indigo-900 to-blue-950'

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-700`}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🌤️</span>
          <span className="font-bold text-white text-base sm:text-lg tracking-tight">SkyWise</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        <SearchBar onSearch={handleSearch} onLocate={handleLocate} loading={state.loading} />

        {/* Error */}
        {state.error && (
          <div className="bg-red-500/20 border border-red-400/40 rounded-2xl px-3 sm:px-4 py-3 text-white text-xs sm:text-sm flex gap-3 items-center">
            <span>⚠️</span>
            <span className="flex-1">{state.error}</span>
            <button
              onClick={() => setState(s => ({ ...s, error: null }))}
              className="text-white/50 hover:text-white ml-auto shrink-0"
            >✕</button>
          </div>
        )}

        {/* Loading */}
        {state.loading && (
          <div className="flex flex-col items-center py-16 text-white/60 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-white/70 animate-spin" />
            <span className="text-sm">Fetching weather...</span>
          </div>
        )}

        {/* Data */}
        {!state.loading && state.weather && (
          <>
            <WeatherCard
              weather={state.weather}
              unit={unit}
              onToggleUnit={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')}
            />
            <SuggestionsPanel suggestions={getSuggestions(state.weather)} />
            {state.forecast.length > 0 && <Forecast forecast={state.forecast} unit={unit} />}
          </>
        )}

        {/* Empty state */}
        {!state.loading && !state.weather && !state.error && (
          <div className="text-center py-16 sm:py-20 px-4">
            <div className="text-5xl sm:text-6xl mb-4">🌍</div>
            <h2 className="text-white font-bold text-lg sm:text-xl mb-2">Smart Weather Forecasting</h2>
            <p className="text-white/50 text-sm mb-6">Search for a city or use your location to get started.</p>
            <button
              onClick={handleLocate}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              📍 Use My Location
            </button>
          </div>
        )}

        <footer className="text-center pt-2 pb-4">
          <p className="text-white/20 text-xs">
            Powered by OpenWeatherMap · BCA 6th Sem · Atharv Ninad Tanksale
          </p>
        </footer>
      </main>
    </div>
  )
}
