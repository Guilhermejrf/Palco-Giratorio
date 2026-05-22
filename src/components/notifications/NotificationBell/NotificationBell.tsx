import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '../../../hooks/useNotifications'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markNotificationRead } = useNotifications()

  return (
    <div className="relative">
      <button
        aria-label="Abrir notificações"
        className="relative rounded-full p-2 hover:bg-[var(--color-cream-dark)]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Bell className="h-5 w-5" />
        {unreadCount ? (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-secondary-300)] px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-[var(--color-cream-dark)] bg-white p-3 shadow-xl">
          <h3 className="px-2 pb-2 text-sm font-bold">Notificações</h3>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className={`w-full rounded-xl p-3 text-left transition hover:bg-[var(--color-cream)] ${
                  notification.read ? 'opacity-70' : 'bg-[var(--color-secondary-50)]'
                }`}
                onClick={() => markNotificationRead(notification.id)}
                type="button"
              >
                <strong className="block text-sm">{notification.title}</strong>
                <span className="text-xs text-[var(--color-warm-gray)]">{notification.body}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
