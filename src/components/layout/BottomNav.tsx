import { BarChart2, Home, MapPin, Package, Route } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ITEMS = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/mapa', icon: MapPin, label: 'Mapa' },
  { path: '/circuitos', icon: Route, label: 'Rotas' },
  { path: '/espetaculos', icon: Package, label: 'Cenas' },
  { path: '/metricas', icon: BarChart2, label: 'IAC' },
]

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 grid h-16 grid-cols-5 border-t border-[var(--color-cream-dark)] bg-white md:hidden">
    {ITEMS.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
            isActive ? 'text-[var(--color-secondary-300)]' : 'text-[var(--color-warm-gray)]'
          }`
        }
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </NavLink>
    ))}
  </nav>
)
