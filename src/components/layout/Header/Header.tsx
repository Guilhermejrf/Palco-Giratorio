import { Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { municipalities } from '../../../constants/municipalities'
import { useAuthStore } from '../../../stores/authStore'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { NotificationBell } from '../../notifications/NotificationBell/NotificationBell'

const titleFromPath = (path: string) => {
  if (path === '/') return 'Dashboard'
  const segment = path.split('/').filter(Boolean)[0]
  if (!segment) return 'Dashboard'
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export const Header = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const shows = useDemoDataStore((state) => state.shows)
  const suggestions = [...municipalities.slice(0, 4).map((city) => city.name), ...shows.slice(0, 2).map((show) => show.name)]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-4 md:px-6">
      <div className="hidden min-w-32 md:block">
        <p className="text-xs text-[var(--color-warm-gray)]">Seção</p>
        <strong>{titleFromPath(location.pathname)}</strong>
      </div>
      <div className="group relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-warm-gray)]" />
        <input
          aria-label="Busca global"
          className="h-10 w-full rounded-full border border-[var(--color-cream-dark)] bg-white pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary-300)]"
          placeholder="Buscar município, espetáculo, grupo ou circuito"
        />
        <div className="absolute left-0 right-0 top-12 z-40 hidden rounded-2xl border border-[var(--color-cream-dark)] bg-white p-2 shadow-xl group-focus-within:block">
          {suggestions.map((suggestion) => (
            <Link key={suggestion} className="block rounded-xl px-3 py-2 text-sm hover:bg-[var(--color-cream)]" to="/mapa">
              {suggestion}
            </Link>
          ))}
        </div>
      </div>
      <Link
        className="hidden min-h-10 items-center justify-center rounded-lg border border-[var(--color-secondary-300)] px-4 py-2 text-sm font-semibold text-[var(--color-secondary-500)] transition hover:bg-[var(--color-secondary-50)] md:inline-flex"
        to="/demo"
      >
        Modo Demo
      </Link>
      <NotificationBell />
      <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary-700)] text-sm font-bold text-white">
        {user?.name.charAt(0) ?? 'P'}
      </div>
    </header>
  )
}
