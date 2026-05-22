import {
  BarChart2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Route,
  Theater,
  Truck,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'
import { useUIStore } from '../../../stores/uiStore'

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Início', badge: null },
  { path: '/mapa', icon: MapPin, label: 'Mapa Vivo', badge: null },
  { path: '/espetaculos', icon: Theater, label: 'Espetáculos', badge: null },
  { path: '/circuitos', icon: Route, label: 'Circuitos', badge: '3' },
  { path: '/recursos', icon: Package, label: 'Banco de Recursos', badge: null },
  { path: '/escolas', icon: GraduationCap, label: 'Escolas', badge: null },
  { path: '/metricas', icon: BarChart2, label: 'Índice de Cena', badge: null },
  { path: '/logistica', icon: Truck, label: 'Central Logística', badge: null },
]

export const Sidebar = () => {
  const collapsed = useUIStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-40 hidden flex-col bg-[var(--color-primary-700)] text-white transition-all md:flex ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <button
          aria-label="Alternar menu lateral"
          className="rounded-lg p-2 hover:bg-white/10"
          onClick={toggleSidebar}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
        {!collapsed ? (
          <div>
            <h1 className="font-display text-lg leading-none">Pulso Cena PE</h1>
            <p className="text-xs opacity-70">Sesc Pernambuco</p>
          </div>
        ) : null}
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl border-l-4 px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'border-[var(--color-secondary-300)] bg-white/15'
                  : 'border-transparent opacity-75 hover:bg-white/10 hover:opacity-100'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed ? <span className="flex-1">{item.label}</span> : null}
            {!collapsed && item.badge ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-secondary-300)] px-1 text-[10px]">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-secondary-300)] font-bold">
            {user?.name.charAt(0) ?? 'U'}
          </div>
          {!collapsed ? (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{user?.name}</p>
                <p className="truncate text-xs opacity-70">Gestor Sesc</p>
              </div>
              <button aria-label="Sair" className="rounded-lg p-2 hover:bg-white/10" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
