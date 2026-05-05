import { useState, FormEvent } from 'react'

interface Props {
  onSearch: (city: string) => void
  onLocate: () => void
  loading: boolean
}

export function SearchBar({ onSearch, onLocate, loading }: Props) {
  const [input, setInput] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) onSearch(input.trim())
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 w-full max-w-xl mx-auto">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">🔍</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search city..."
          disabled={loading}
          className="w-full h-11 pl-9 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-all text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="h-11 px-5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/20 text-white font-semibold text-sm transition-all disabled:opacity-40 shrink-0"
      >
        Go
      </button>
      <button
        type="button"
        onClick={onLocate}
        disabled={loading}
        title="Use my location"
        className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 border border-white/20 text-white transition-all disabled:opacity-40 shrink-0"
      >
        📍
      </button>
    </form>
  )
}
