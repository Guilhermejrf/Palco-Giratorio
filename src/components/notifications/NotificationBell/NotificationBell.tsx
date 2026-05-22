import { Bell, CheckCircle2, Package, Route, Sparkles, Truck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppNotification } from '../../../stores/uiStore'
import { useUIStore } from '../../../stores/uiStore'

const typeIcon: Record<AppNotification['type'], React.ElementType> = {
  interest: Sparkles,
  confirmation: CheckCircle2,
  proposal: Route,
  logistics: Truck,
  system: Package,
}

const typeColor: Record<AppNotification['type'], string> = {
  interest: 'text-[var(--color-secondary-500)]',
  confirmation: 'text-[var(--color-success)]',
  proposal: 'text-[var(--color-primary-700)]',
  logistics: 'text-[var(--color-secondary-500)]',
  system: 'text-[var(--color-warm-gray)]',
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) +
    ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useUIStore()

  const handleClick = (n: AppNotification) => {
    markNotificationRead(n.id)
    if (n.link) navigate(n.link)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        aria-label="Abrir notificações"
        className="relative rounded-full p-2 hover:bg-[var(--color-cream-dark)]"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-secondary-300)] px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-96 rounded-2xl border border-[var(--color-cream-dark)] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--color-cream-dark)] px-4 py-3">
            <h3 className="text-sm font-bold">Notificações</h3>
            {unreadCount > 0 && (
              <button
                className="text-xs font-semibold text-[var(--color-secondary-500)] hover:underline"
                onClick={() => { markAllRead(); setOpen(false) }}
                type="button"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-[var(--color-warm-gray)]">Nenhuma notificação.</p>
            )}
            {notifications.map((n) => {
              const Icon = typeIcon[n.type]
              return (
                <button
                  key={n.id}
                  className={`flex w-full gap-3 border-b border-[var(--color-cream-dark)] p-4 text-left transition hover:bg-[var(--color-cream)] last:border-b-0 ${!n.read ? 'bg-[var(--color-secondary-50)]' : ''}`}
                  onClick={() => handleClick(n)}
                  type="button"
                >
                  <div
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${!n.read ? 'bg-[var(--color-secondary-50)]' : 'bg-[var(--color-cream)]'}`}
                  >
                    <Icon className={`h-4 w-4 ${typeColor[n.type]}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="block text-sm leading-tight">{n.title}</strong>
                      {!n.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-secondary-300)]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-warm-gray)]">{n.body}</p>
                    <p className="mt-1 text-[10px] text-[var(--color-warm-gray)]">{formatTime(n.createdAt)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
