import { Suggestion } from '../utils/weather'

const typeStyle = {
  info:    'bg-sky-500/10 border-sky-400/30 text-sky-100',
  warning: 'bg-amber-500/10 border-amber-400/30 text-amber-100',
  success: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-100',
}

export function SuggestionsPanel({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 sm:p-5 text-white">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
        Smart Suggestions
      </h3>
      <div className="flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <div key={i} className={`flex items-start sm:items-center gap-3 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 border text-xs sm:text-sm ${typeStyle[s.type]}`}>
            <span className="text-base sm:text-lg shrink-0 mt-0.5 sm:mt-0">{s.icon}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
